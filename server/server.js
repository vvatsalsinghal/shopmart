// =============================================================================
// FILE: server/server.js
// PURPOSE: Node.js Backend Server Entry Point (Layer 6 Foundation).
// DEMONSTRATES: Node.js Runtime, V8 Engine, Operating System Integration,
//               Environment Variables (process.env), Native HTTP Server,
//               Process Lifecycle & Graceful Shutdown.
// In Layer 7, we will expand this with Express.js routing and middleware!
// =============================================================================

// NODE.JS CONCEPT: Built-in Core Modules
// Node.js comes with built-in C++ backed modules prefixed with "node:".
// They require ZERO npm installation!
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// NODE.JS CONCEPT: Environment Variables with dotenv
// Reads key-value pairs from .env and injects them into the global "process.env" object.
// SECURITY CONCEPT: Never hardcode sensitive ports, passwords, or API keys in source code!
import 'dotenv/config';

// NODE.JS CONCEPT: ES Modules Directory Path Resolution
// In older CommonJS, __dirname existed automatically.
// In modern ES Modules ("type": "module"), we generate __dirname using fileURLToPath:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =============================================================================
// SERVER CONFIGURATION
// Reads from process.env with fallback defaults
// =============================================================================
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const APP_NAME = process.env.APP_NAME || 'ShopMart Server';
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

// =============================================================================
// NODE.JS CONCEPT: The Native HTTP Server
// http.createServer() creates an event-driven server.
// Every time a browser or client makes a request, the callback function executes,
// receiving two objects:
//   1. req (http.IncomingMessage): What the client asked for (URL, Method, Headers).
//   2. res (http.ServerResponse): What the server sends back (Status Code, Data).
// =============================================================================
const server = http.createServer((req, res) => {
  const { method, url } = req;
  const timestamp = new Date().toISOString();

  console.log(`📡 [${timestamp}] Incoming Request: ${method} ${url}`);

  // SECURITY & API CONCEPT: CORS Headers (Cross-Origin Resource Sharing)
  // Tells the browser: "Allow our React app running on port 5173 to read this response!"
  res.setHeader('Access-Control-Allow-Origin', CLIENT_ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle pre-flight browser security checks (OPTIONS request)
  if (method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Set response format to JSON
  res.setHeader('Content-Type', 'application/json');

  // ===========================================================================
  // ROUTE 1: GET /api/health
  // PURPOSE: Health check endpoint verifying that the backend server is alive.
  // ===========================================================================
  if (url === '/api/health' && method === 'GET') {
    const healthData = {
      status: 'UP',
      appName: APP_NAME,
      environment: NODE_ENV,
      serverTime: timestamp,
      uptimeSeconds: Math.floor(process.uptime()),
      nodeVersion: process.version,
      platform: `${os.type()} (${os.arch()})`,
      freeMemoryMB: Math.floor(os.freemem() / (1024 * 1024)),
      totalMemoryMB: Math.floor(os.totalmem() / (1024 * 1024))
    };

    // HTTP STATUS CODE 200: OK
    res.writeHead(200);
    res.end(JSON.stringify(healthData, null, 2));
    return;
  }

  // ===========================================================================
  // ROUTE 2: GET /api/info
  // PURPOSE: Returns server runtime metadata.
  // ===========================================================================
  if (url === '/api/info' && method === 'GET') {
    const infoData = {
      message: 'Welcome to ShopMart B2B Quotation Management API',
      version: '1.0.0 (Layer 6: Node.js Runtime)',
      availableEndpoints: [
        'GET /api/health - Server health and hardware diagnostics',
        'GET /api/info   - Server API information'
      ]
    };

    res.writeHead(200);
    res.end(JSON.stringify(infoData, null, 2));
    return;
  }

  // ===========================================================================
  // ROUTE 3: 404 Not Found (Fallback for unhandled URLs)
  // ===========================================================================
  res.writeHead(404);
  res.end(JSON.stringify({
    error: 'Not Found',
    message: `Cannot ${method} ${url}`,
    statusCode: 404
  }, null, 2));
});

// =============================================================================
// NODE.JS CONCEPT: Starting the Server with server.listen()
// Tells the operating system: "Reserve port PORT for this Node.js process
// and start listening for incoming network traffic!"
// =============================================================================
server.listen(PORT, () => {
  console.log('================================================================');
  console.log(`🚀 ${APP_NAME} IS RUNNING`);
  console.log(`🌐 Local Server URL:  http://localhost:${PORT}`);
  console.log(`🏥 Health Check API:   http://localhost:${PORT}/api/health`);
  console.log(`ℹ️  Server Info API:   http://localhost:${PORT}/api/info`);
  console.log(`💻 Node.js Version:   ${process.version} (PID: ${process.pid})`);
  console.log(`🖥️  Operating System:  ${os.type()} ${os.release()} (${os.arch()})`);
  console.log(`🧠 System Memory:     ${Math.floor(os.freemem() / (1024 * 1024))} MB free / ${Math.floor(os.totalmem() / (1024 * 1024))} MB total`);
  console.log(`⚙️  Environment Mode:  ${NODE_ENV}`);
  console.log(`🔒 Allowed Client:    ${CLIENT_ORIGIN}`);
  console.log('================================================================');
});

// =============================================================================
// NODE.JS CONCEPT: Process Lifecycle & Graceful Shutdown
// Listens for operating system interrupt signals (SIGINT = Ctrl + C).
// Ensures active network connections close cleanly before Node terminates.
// =============================================================================
process.on('SIGINT', () => {
  console.log('\n🛑 SIGINT signal received: Closing ShopMart server gracefully...');
  server.close(() => {
    console.log('✅ All network listeners closed. Node process terminated cleanly.');
    process.exit(0);
  });
});
