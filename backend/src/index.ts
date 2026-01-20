import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import morgan from "morgan";
import path from "path";
import { createServer } from "http";
import fs from "fs";

import { initializeSocket } from "./socket/socketServer";
import scheduleRoutes from "./routes/scheduleRoutes";
import routes from "./routes";
import { errorHandler } from "./middleware/errorHandler";

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

// ✅ Tạo HTTP server cho Socket.IO
const server = createServer(app);

// Initialize Socket.IO with error handling
try {
  initializeSocket(server);
  console.log("[STARTUP] Socket.IO initialized");
} catch (error) {
  console.error("[STARTUP] Socket.IO initialization warning:", error);
}

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
      process.env.CORS_ORIGIN,
      process.env.FRONTEND_URL,
    ].filter(Boolean);

    if (process.env.NODE_ENV === "development") {
      callback(null, true);
    } else if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// ✅ THÊM HEALTH CHECK ENDPOINT (phải đặt TRƯỚC các routes khác)
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Server is running!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// ✅ ROUTES - Đặt đúng thứ tự
app.use("/api/schedules", scheduleRoutes); // Specific route trước
app.use(routes); // General routes sau

// ✅ ERROR HANDLER - PHẢI LÀ MIDDLEWARE CUỐI CÙNG
app.use(errorHandler);

// ✅ START SERVER
server.listen(PORT, HOST, () => {
  console.log(`✅ Server running on http://${HOST}:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  if (process.env.CORS_ORIGIN) {
    console.log(`✅ CORS enabled for: ${process.env.CORS_ORIGIN}`);
  }
});

// Handle server errors
server.on("error", (error: NodeJS.ErrnoException) => {
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
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});
