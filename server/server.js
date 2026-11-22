// =============================================================================
// FILE: server/server.js
// PURPOSE: Express.js REST API Server Entry Point (Layer 7).
// DEMONSTRATES: Express Application, Middleware Pipeline, Router Mounts,
//               Centralized Error Handling, CORS Configuration.
// =============================================================================

import express from 'express';
import cors from 'cors';
import os from 'node:os';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Load server/.env reliably
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Import Database Connection
import connectDB from './src/config/db.js';

// Import Modular Route Handlers
import productRoutes from './src/routes/productRoutes.js';
import quotationRoutes from './src/routes/quotationRoutes.js';
import { notFound, errorHandler } from './src/middleware/errorHandler.js';

// =============================================================================
// EXPRESS CONCEPT: Initializing the Express Application
// express() creates an Express application object containing routing methods
// (app.get, app.post) and the middleware pipeline (app.use).
// =============================================================================
const app = express();

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const APP_NAME = process.env.APP_NAME || 'ShopMart Express API Server';
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

// =============================================================================
// EXPRESS CONCEPT: Middleware Pipeline
// Middleware functions execute sequentially during the request-response cycle.
// They can inspect requests, transform data, or reject unauthorized calls.
// =============================================================================

// 1. CORS Middleware: Automatically configures cross-origin security headers
app.use(
  cors({
    origin: CLIENT_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// 2. Body Parser Middleware: Parses incoming JSON request payloads into req.body
// EXPRESS CONCEPT: express.json()
// Without this line, req.body is undefined when a client sends POST JSON!
app.use(express.json());

// 3. Custom Request Logger Middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`📡 [${timestamp}] ${req.method} ${req.originalUrl}`);
  // EXPRESS CONCEPT: next()
  // Must call next() to pass execution to the next middleware or route handler!
  next();
});

// =============================================================================
// ROUTE MOUNTING (REST API Endpoints)
// =============================================================================

// Health Check Route: Live hardware & uptime diagnostics
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    appName: APP_NAME,
    environment: NODE_ENV,
    serverTime: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    nodeVersion: process.version,
    platform: `${os.type()} (${os.arch()})`,
    freeMemoryMB: Math.floor(os.freemem() / (1024 * 1024)),
    totalMemoryMB: Math.floor(os.totalmem() / (1024 * 1024))
  });
});

// API Directory Route
app.get('/api', (req, res) => {
  res.status(200).json({
    message: 'Welcome to ShopMart B2B Quotations Express REST API',
    version: '2.0.0 (Layer 7: Express Architecture)',
    endpoints: {
      health: 'GET /api/health',
      products: 'GET /api/products, GET /api/products/:id',
      quotations: 'POST /api/quotations, GET /api/quotations, PATCH /api/quotations/:id/status'
    }
  });
});

// EXPRESS CONCEPT: Router Mounting
// All routes inside productRoutes are prefixed with /api/products
app.use('/api/products', productRoutes);

// All routes inside quotationRoutes are prefixed with /api/quotations
app.use('/api/quotations', quotationRoutes);

// =============================================================================
// ERROR HANDLING MIDDLEWARE PIPELINE
// Placed at the very bottom so they catch unmatched routes and controller errors!
// =============================================================================

// 404 Handler for undefined routes
app.use(notFound);

// Centralized Error Handler (Catches any error passed to next(err))
app.use(errorHandler);

// =============================================================================
// SERVER LISTENER & DATABASE BOOTSTRAP
// =============================================================================
const startServer = async () => {
  // 1. Connect to MongoDB Atlas
  await connectDB();

  // 2. Start HTTP listener
  const server = app.listen(PORT, () => {
    console.log('================================================================');
    console.log(`🚀 ${APP_NAME} IS RUNNING (Express 4 + MongoDB)`);
    console.log(`🌐 Local URL:         http://localhost:${PORT}`);
    console.log(`🏥 Health Check API:  http://localhost:${PORT}/api/health`);
    console.log(`📦 Products API:      http://localhost:${PORT}/api/products`);
    console.log(`📋 Quotations API:    http://localhost:${PORT}/api/quotations`);
    console.log(`⚙️  Environment Mode: ${NODE_ENV}`);
    console.log(`🔒 Allowed Client:   ${CLIENT_ORIGIN}`);
    console.log('================================================================');
  });

  // Graceful Shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 SIGINT received: Closing Express server gracefully...');
    server.close(() => {
      console.log('✅ Express server closed. Process terminated cleanly.');
      process.exit(0);
    });
  });
};

startServer();
