'use strict';

const express = require('express');
const router = express.Router();

// Usa fetch nativo en Node 18+; fallback si no existiera
const fetchFn = (...args) => {
  if (typeof fetch !== 'undefined') return fetch(...args);
  return import('node-fetch').then(({ default: f }) => f(...args));
};

// Likes por IP en memoria
const likesByStock = new Map();
const norm = (t) => String(t || '').trim().toUpperCase();
const getIP = (req) => String(req.ip || req.headers['x-forwarded-for'] || req.connection?.remoteAddress || '').replace(/^::ffff:/, '');

function likeStock(t, ip) {
  const k = norm(t);
  const set = likesByStock.get(k) || new Set();
  set.add(ip);
  likesByStock.set(k, set);
}

function likes(t) {
  return (likesByStock.get(norm(t)) || new Set()).size;
}

async function price(t) {
  const sym = norm(t);
  const url = `https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${sym}/quote`;
  const res = await fetchFn(url);
  if (!res.ok) throw new Error(`Price fetch failed for ${sym}: ${res.status}`);
  const data = await res.json();
  const p = data?.latestPrice ?? data?.price;
  if (p == null) throw new Error(`No price for ${sym}`);
  return Number(p);
}

router.get('/api/stock-prices', async (req, res) => {
  try {
    const q = req.query.stock;
    const like = String(req.query.like || '').toLowerCase() === 'true';
    const ip = getIP(req);

    if (typeof q === 'string') {
      const s = norm(q);
      if (like) likeStock(s, ip);
      const [pr] = await Promise.all([price(s)]);
      return res.json({ stockData: { stock: s, price: pr, likes: likes(s) } });
    }

    if (Array.isArray(q) && q.length === 2) {
      const [a, b] = [norm(q[0]), norm(q[1])];
      if (like) { likeStock(a, ip); likeStock(b, ip); }
      const [pa, pb] = await Promise.all([price(a), price(b)]);
      const la = likes(a), lb = likes(b);
      return res.json({ stockData: [
        { stock: a, price: pa, rel_likes: la - lb },
        { stock: b, price: pb, rel_likes: lb - la },
      ]});
    }

    return res.status(400).json({ error: 'invalid query' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'internal error' });
  }
});

module.exports = router;
