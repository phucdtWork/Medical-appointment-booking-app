import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import morgan from "morgan";
import path from "path";
import { createServer } from "http";

import { initializeSocket } from "./socket/socketServer";
import scheduleRoutes from "./routes/scheduleRoutes";
import routes from "./routes";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});

const app = express();
const PORT = parseInt(process.env.PORT || "5000", 10);
const HOST = "0.0.0.0";

// ✅ Tạo HTTP server cho Socket.IO
const server = createServer(app);

// Initialize Socket.IO
initializeSocket(server);

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
