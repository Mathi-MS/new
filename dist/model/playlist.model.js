"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaylistVisibility = void 0;
const mongoose_1 = __importStar(require("mongoose"));
/**
 * @swagger
 * tags:
 *   name: Playlist
 *   description: Playlist management API
 */
var PlaylistVisibility;
(function (PlaylistVisibility) {
    PlaylistVisibility["PRIVATE"] = "private";
    PlaylistVisibility["PUBLIC"] = "public";
})(PlaylistVisibility || (exports.PlaylistVisibility = PlaylistVisibility = {}));
const PlaylistSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    description: {
        type: String,
        trim: true,
        maxlength: 500
    },
    owner: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    visibility: {
        type: String,
        enum: Object.values(PlaylistVisibility),
        default: PlaylistVisibility.PRIVATE,
        required: true
    },
    songs: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Music'
        }],
    totalDuration: {
        type: Number,
        default: 0
    },
    playCount: {
        type: Number,
        default: 0
    },
    thumbnail: {
        type: String,
        default: null
    },
    uid: {
        type: String,
        required: true,
        unique: true
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});
// Index for efficient querying
PlaylistSchema.index({ owner: 1, name: 1 });
PlaylistSchema.index({ visibility: 1 });
const Playlist = mongoose_1.default.model('Playlist', PlaylistSchema);
exports.default = Playlist;
//# sourceMappingURL=playlist.model.js.map