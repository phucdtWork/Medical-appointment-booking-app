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

// CORS configuration - allow all origins in development
const corsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    if (process.env.NODE_ENV === "development") {
      // Allow all origins in development
      callback(null, true);
    } else {
      // In production, use CORS_ORIGIN from env
      const allowedOrigin = process.env.CORS_ORIGIN || "http://localhost:3000";
      if (!origin || origin === allowedOrigin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
