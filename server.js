'use strict';
require('dotenv').config();

const express = require('express');
const cors    = require('cors');
const path    = require('path');
const helmet  = require('helmet');

const apiRoutes        = require('./routes/api.js');       // exporta un Router
const fccTestingRoutes = require('./routes/fcctesting.js');
const runner           = require('./test-runner');

const app = express();
app.set('trust proxy', 1);

// ── Helmet v6: 1 sola cabecera CSP, sin headers legados ──
app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc:  ["'self'"],
      styleSrc:   ["'self'"],
    },
  },
  // Evita políticas extra que algunos PaaS agregan por defecto
  crossOriginEmbedderPolicy: false,
  crossOriginOpenerPolicy:  false,
  crossOriginResourcePolicy: { policy: 'same-origin' },
}));

// Estáticos y middlewares
app.use('/public', express.static(path.join(process.cwd(), 'public')));
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Home
app.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'views', 'index.html'));
});

// Rutas FCC (función)
fccTestingRoutes(app);

// Rutas API (Router)
app.use('/', apiRoutes);

// 404
app.use((req, res) => {
  res.status(404).type('text').send('Not Found');
});

// Start + runner local
const listener = app.listen(process.env.PORT || 5000, '0.0.0.0', () => {
  console.log('Your app is listening on port ' + listener.address().port);
  if (process.env.NODE_ENV === 'test') {
    console.log('Running Tests...');
    setTimeout(() => {
      try { runner.run(); }
      catch (e) {
        console.log('Tests are not valid:');
        console.error(e);
      }
    }, 3500);
  }
});

module.exports = app;