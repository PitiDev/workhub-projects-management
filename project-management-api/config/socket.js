module.exports = {
    // Configure Socket.IO with CORS settings
    cors: {
      // Allow requests from your frontend
      origin: [
        'http://localhost:3000',  // Default Nuxt development server
        'http://127.0.0.1:3000',  // Alternative localhost
        process.env.FRONTEND_URL || 'http://localhost:3000'  // Environment variable if defined
      ],
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true // This is important for cookies/authentication
    },
    
    // Additional Socket.IO options
    serveClient: false, // Don't serve client files
    pingInterval: 10000, // How often to ping clients
    pingTimeout: 5000,   // How long to wait for ping response
    cookie: false,       // Don't use cookies
    transports: ['websocket', 'polling'], // Support both WebSocket and HTTP long-polling
    allowUpgrades: true, // Allow transport upgrades
    path: '/socket.io' // Default Socket.IO path
  };