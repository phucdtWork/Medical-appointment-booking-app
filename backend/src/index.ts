import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import morgan from "morgan";
import path from "path";

import { initializeSocket } from "./socket/socketServer";
import scheduleRoutes from "./routes/scheduleRoutes";

import routes from "./routes";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});

const app = express();
const PORT = process.env.PORT || 5000;

const server = require("http").createServer(app);

initializeSocket(server);

// Middleware
app.use(helmet());

// CORS configuration
const corsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void,
  ) => {
    // List of allowed origins
    const allowedOrigins = [
      "http://localhost:3000",
      "http://localhost:5000",
      process.env.CORS_ORIGIN,
      process.env.FRONTEND_URL,
    ].filter(Boolean);

    if (process.env.NODE_ENV === "development") {
      // Allow all origins in development
      callback(null, true);
    } else if (!origin || allowedOrigins.includes(origin)) {
      // In production, check against allowed origins
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

// Routes
app.use(routes);

// Error handler (must be last)
app.use(errorHandler);

app.use("/api/schedules", scheduleRoutes);

server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  if (process.env.CORS_ORIGIN) {
    console.log(`✅ CORS enabled for: ${process.env.CORS_ORIGIN}`);
  }
});
