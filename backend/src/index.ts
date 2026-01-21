import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import morgan from "morgan";
import path from "path";
import { createServer } from "http";
import fs from "fs";

// Load .env file only if it exists (for local development)
const envPath = path.resolve(__dirname, "../../.env");
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const app = express();
const PORT = parseInt(process.env.PORT || "5000", 10);
const HOST = "0.0.0.0";

console.log(`[STARTUP] Starting backend on ${HOST}:${PORT}...`);
console.log(`[STARTUP] NODE_ENV: ${process.env.NODE_ENV || "development"}`);

// Create HTTP server for Socket.IO
const server = createServer(app);

// Middleware
app.use(helmet());

// CORS configuration
const corsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void,
  ) => {
    const allowedOrigins = [
      "http://localhost:3000",
      "http://localhost:5000",
      "http://127.0.0.1:3000",
      "http://10.21.174.176:3000",
      process.env.CORS_ORIGIN,
      process.env.FRONTEND_URL,
    ].filter(Boolean);

    console.log(`[CORS] Request from origin: ${origin}`);
    console.log(`[CORS] Allowed origins: ${allowedOrigins.join(", ")}`);

    if (process.env.NODE_ENV === "development") {
      callback(null, true);
    } else if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`[CORS] Rejected origin: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Disable morgan in production to save memory
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Health check endpoint - Must work even if other services fail
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Server is running!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// START SERVER FIRST - Bind to port immediately
const server_instance = server.listen(PORT, HOST, () => {
  console.log(`✅ Server BOUND to http://${HOST}:${PORT}`);

  // Initialize Socket.IO AFTER server is bound (only in development, skip in production)
  if (process.env.NODE_ENV !== "production") {
    try {
      const { initializeSocket } = require("./socket/socketServer");
      initializeSocket(server);
      console.log("[STARTUP] Socket.IO initialized");
    } catch (error) {
      console.error("[STARTUP] Socket.IO initialization warning:", error);
    }
  }

  // Initialize routes AFTER server is bound
  try {
    const scheduleRoutes = require("./routes/scheduleRoutes").default;
    const routes = require("./routes").default;
    const { errorHandler } = require("./middleware/errorHandler");

    app.use("/api/schedules", scheduleRoutes);
    app.use(routes);
    app.use(errorHandler);

    console.log("[STARTUP] Routes initialized");
  } catch (error) {
    console.error("[STARTUP] Routes initialization error:", error);
    process.exit(1);
  }
});

// Handle server errors
server_instance.on("error", (error: NodeJS.ErrnoException) => {
  if (error.code === "EADDRINUSE") {
    console.error(`❌ Port ${PORT} is already in use`);
  } else {
    console.error("❌ Server error:", error);
  }
  process.exit(1);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully...");
  server_instance.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});
