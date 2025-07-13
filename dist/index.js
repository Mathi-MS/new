"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
// ✅ Add this line RIGHT AFTER importing mongoose
mongoose_1.default.set("strictQuery", true); // or false if you prefer the future default behavior
const path_1 = __importDefault(require("path"));
const config_1 = __importDefault(require("./config"));
const user_routes_1 = __importDefault(require("./routers/user.routes"));
const cors_1 = __importDefault(require("cors"));
const auth_routes_1 = __importDefault(require("./routers/auth.routes"));
const music_routes_1 = __importDefault(require("./routers/music.routes"));
const playlist_routes_1 = __importDefault(require("./routers/playlist.routes"));
const bulk_user_routes_1 = __importDefault(require("./routers/bulk-user.routes"));
const exception_handler_1 = require("./config/exception.handler");
const page_not_found_exception_1 = require("./config/page-not-found.exception");
const app = (0, express_1.default)();
const allowedOrigins = ["http://localhost:5173", "*"];
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
// Serve static files from the uploads directory and its subdirectories
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "uploads")));
// Serve static files from the public directory
app.use("/public", express_1.default.static(path_1.default.join(__dirname, "public")));
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
app.use("/v1/auth", auth_routes_1.default);
app.use("/v1/user", user_routes_1.default);
app.use("/v1/music", music_routes_1.default);
app.use("/v1/playlists", playlist_routes_1.default);
app.use("/v1/bulk-user", bulk_user_routes_1.default);
// Additional route mapping for backward compatibility
app.use("/api/playlists", playlist_routes_1.default);
// Error Handlers
app.use("*", page_not_found_exception_1.pageNotFoundExceptionHandler);
app.use(exception_handler_1.exceptionHandler);
// Start Server
app.listen(config_1.default.server.port, () => {
    console.log(`Server running on port ${config_1.default.server.port}`);
    // Connect to MongoDB
    mongoose_1.default
        .connect(config_1.default.mongo.url, { retryWrites: true, w: "majority" })
        .then(() => {
        console.log("Connected to MongoDB.");
    })
        .catch((error) => {
        console.log("Unable to connect to MongoDB:", error.message);
    });
});
//# sourceMappingURL=index.js.map