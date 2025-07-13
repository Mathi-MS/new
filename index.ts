import "reflect-metadata";

import express from "express";
import mongoose from "mongoose";
// ✅ Add this line RIGHT AFTER importing mongoose
mongoose.set("strictQuery", true); // or false if you prefer the future default behavior
import path from "path";
import config from "./config";

import userRoutes from "./routers/user.routes";
import cors from "cors";
import authRoutes from "./routers/auth.routes";
import musicRoutes from "./routers/music.routes";
import playlistRoutes from "./routers/playlist.routes";
import bulkUserRoutes from "./routers/bulk-user.routes";
import { exceptionHandler } from "./config/exception.handler";
import { pageNotFoundExceptionHandler } from "./config/page-not-found.exception";

const app = express();
const allowedOrigins = ["http://localhost:5173", "*"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// Serve static files from the uploads directory and its subdirectories
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Serve static files from the public directory
app.use("/public", express.static(path.join(__dirname, "public")));

// Root route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API Server is running",
    version: "1.0.0",
  });
});

// Test route
app.get("/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is working",
  });
});

// API Routes
app.use("/v1/auth", authRoutes);
app.use("/v1/user", userRoutes);
app.use("/v1/music", musicRoutes);
app.use("/v1/playlists", playlistRoutes);
app.use("/v1/bulk-user", bulkUserRoutes);

// Additional route mapping for backward compatibility
app.use("/api/playlists", playlistRoutes);

// Error Handlers
app.use("*", pageNotFoundExceptionHandler);
app.use(exceptionHandler);

// Start Server
app.listen(config.server.port, () => {
  console.log(`Server running on port ${config.server.port}`);

  // Connect to MongoDB
  mongoose
    .connect(config.mongo.url, { retryWrites: true, w: "majority" })
    .then(() => {
      console.log("Connected to MongoDB.");
    })
    .catch((error) => {
      console.log("Unable to connect to MongoDB:", error.message);
    });
});
