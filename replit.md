# Overview

Stock Price Checker is a web application that provides real-time stock prices and allows users to "like" stocks. Built as part of FreeCodeCamp's Information Security curriculum, it fetches stock data from external APIs and tracks user engagement through an anonymous like system. The application supports viewing individual stock prices or comparing two stocks side-by-side with relative like counts.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Static HTML/CSS/JavaScript**: Simple client-side interface with two forms for stock queries
- **Vanilla JavaScript**: Handles form submissions and API calls using fetch()
- **Real-time Updates**: Results displayed immediately in JSON format on the page

## Backend Architecture
- **Express.js Server**: RESTful API server handling stock price requests
- **Node.js Runtime**: Server-side JavaScript execution environment
- **Modular Route Structure**: API routes separated into dedicated files for maintainability

## Data Storage
- **PostgreSQL Database**: Persistent storage for stock symbols and like tracking
- **JSONB Fields**: Stores anonymized IP addresses as JSON arrays for efficient querying
- **Connection Pooling**: Uses pg Pool for database connection management

## Security and Privacy
- **Helmet.js**: Content Security Policy implementation required by FreeCodeCamp
- **IP Anonymization**: SHA-256 hashing of IP addresses before storage
- **Proxy Trust**: Configured for deployment platforms like Replit, Heroku, and Render
- **CORS**: Cross-origin resource sharing enabled for API access

## API Design
- **Single Stock Endpoint**: `/api/stock-prices?stock=SYMBOL&like=true`
- **Comparison Endpoint**: `/api/stock-prices?stock=SYMBOL1&stock=SYMBOL2&like=true`
- **Like System**: Prevents duplicate likes from same IP address
- **Relative Likes**: Shows like differences when comparing two stocks

# External Dependencies

## Stock Data API
- **FreeCodeCamp Proxy**: `stock-price-checker-proxy.freecodecamp.rocks`
- **Purpose**: Fetches real-time stock prices and company data
- **Data Format**: Returns symbol, latest price, and other stock metrics

## Database
- **PostgreSQL**: Primary data storage via `pg` library
- **Environment Configuration**: Database URL configured through environment variables
- **Auto-initialization**: Creates required tables on startup if they don't exist

## HTTP Client
- **Axios**: HTTP client for external API requests
- **Error Handling**: Manages API timeouts and connection issues
- **Response Processing**: Parses stock data from external service

## Testing Framework
- **Mocha**: Test runner for functional tests
- **Chai**: Assertion library with HTTP testing capabilities
- **FreeCodeCamp Test Suite**: Custom testing utilities for project validation

## Development Tools
- **dotenv**: Environment variable management
- **body-parser**: Request body parsing middleware
- **cors**: Cross-origin request handling