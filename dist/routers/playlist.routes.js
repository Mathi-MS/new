"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const playlist_controller_1 = require("../controller/playlist.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const upload_middleware_1 = require("../middleware/upload.middleware");
// Configure storage for playlist thumbnails
const playlistThumbnailStorage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path_1.default.resolve(__dirname, '../uploads/Playlists/thumbnails');
        // Ensure the directory exists
        if (!fs_1.default.existsSync(uploadPath)) {
            fs_1.default.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path_1.default.extname(file.originalname);
        cb(null, 'playlist-thumbnail-' + uniqueSuffix + ext);
    }
});
// File filter for image files
const imageFileFilter = (req, file, cb) => {
    // Accept only common image file types
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error('Only image files are allowed (JPEG, PNG, GIF, WEBP)'));
    }
};
// Create the upload middleware directly in this file
let playlistThumbnailUpload;
try {
    // Ensure the upload directory exists
    const uploadDir = path_1.default.resolve(__dirname, '../uploads/Playlists/thumbnails');
    console.log('__dirname:', __dirname);
    console.log('uploadDir:', uploadDir);
    if (!fs_1.default.existsSync(uploadDir)) {
        fs_1.default.mkdirSync(uploadDir, { recursive: true });
        console.log('Created upload directory:', uploadDir);
    }
    // Create a simple multer configuration first
    playlistThumbnailUpload = (0, multer_1.default)({
        dest: uploadDir,
        limits: {
            fileSize: 5 * 1024 * 1024, // 5MB default
            files: 1
        }
    });
    console.log('Multer upload middleware created successfully');
}
catch (error) {
    console.error('Error creating multer upload middleware:', error);
    // Fallback to basic multer
    playlistThumbnailUpload = (0, multer_1.default)({ dest: 'uploads/' });
}
const router = (0, express_1.Router)();
const playlistController = new playlist_controller_1.PlaylistController();
// Public routes (no authentication required)
router.get('/', playlistController.getPublicPlaylists); // Main playlist listing
router.get('/search', playlistController.searchPlaylists);
router.get('/uid/:uid', playlistController.getPlaylistByUid);
router.get('/thumbnail/:fileName', playlistController.downloadThumbnail);
router.get('/thumbnails', playlistController.getThumbnails);
// Protected routes (authentication required)
router.use(auth_middleware_1.protect);
// Playlist CRUD operations that require authentication
router.post('/', playlistThumbnailUpload ? playlistThumbnailUpload.single('thumbnail') : (req, res, next) => next(), upload_middleware_1.handleUploadErrors, playlistController.createPlaylist);
router.get('/my', playlistController.getUserPlaylists);
router.get('/accessible', playlistController.getAccessiblePlaylists);
router.get('/shared', playlistController.getSharedPlaylists);
// Generic routes that should come after specific ones
router.get('/:id', playlistController.getPlaylistById);
router.put('/:id', playlistThumbnailUpload ? playlistThumbnailUpload.single('thumbnail') : (req, res, next) => next(), upload_middleware_1.handleUploadErrors, playlistController.updatePlaylist);
router.delete('/:id', playlistController.deletePlaylist);
// Song management in playlists
router.post('/:id/songs', playlistController.addSongToPlaylist);
router.delete('/:id/songs', playlistController.removeSongFromPlaylist);
router.put('/:id/reorder', playlistController.reorderSongs);
// Playlist sharing
router.post('/:id/share', playlistController.sharePlaylist);
router.post('/:id/unshare', playlistController.unsharePlaylist);
// Playlist interaction
router.post('/:id/play', playlistController.playPlaylist);
exports.default = router;
//# sourceMappingURL=playlist.routes.js.map