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
app.use(cors({ origin: process.env.CORS_ORIGIN }));
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
