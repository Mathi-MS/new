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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaylistRepository = void 0;
const playlist_model_1 = __importStar(require("../model/playlist.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const uuid_1 = require("uuid");
class PlaylistRepository {
    create(playlistData, ownerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const playlist = new playlist_model_1.default(Object.assign(Object.assign({}, playlistData), { owner: new mongoose_1.default.Types.ObjectId(ownerId), uid: (0, uuid_1.v4)(), visibility: playlistData.visibility || playlist_model_1.PlaylistVisibility.PRIVATE }));
            return yield playlist.save();
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield playlist_model_1.default.findById(id)
                .populate('owner', 'firstName lastName username')
                .populate('songs', 'title music duration thumbnail uid');
        });
    }
    findByUid(uid) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield playlist_model_1.default.findOne({ uid })
                .populate('owner', 'firstName lastName username')
                .populate('songs', 'title music duration thumbnail uid');
        });
    }
    findByOwner(ownerId, page = 1, limit = 10) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield playlist_model_1.default.find({ owner: new mongoose_1.default.Types.ObjectId(ownerId) })
                .populate('owner', 'firstName lastName username')
                .populate('songs', 'title music duration thumbnail uid')
                .sort({ updatedAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit);
        });
    }
    findAccessiblePlaylists(userId, page = 1, limit = 10) {
        return __awaiter(this, void 0, void 0, function* () {
            // Return all playlists without permission checks
            return yield playlist_model_1.default.find({})
                .populate('owner', 'firstName lastName username')
                .populate('songs', 'title music duration thumbnail uid')
                .sort({ updatedAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit);
        });
    }
    findPublicPlaylists(page = 1, limit = 10) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield playlist_model_1.default.find({ visibility: playlist_model_1.PlaylistVisibility.PUBLIC })
                .populate('owner', 'firstName lastName username')
                .populate('songs', 'title music duration thumbnail uid')
                .sort({ playCount: -1, updatedAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit);
        });
    }
    // Shared playlists functionality has been removed
    findSharedWithUser(userId, page = 1, limit = 10) {
        return __awaiter(this, void 0, void 0, function* () {
            // Return empty array since sharing functionality is removed
            return [];
        });
    }
    update(id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield playlist_model_1.default.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true })
                .populate('owner', 'firstName lastName username')
                .populate('songs', 'title music duration thumbnail uid');
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield playlist_model_1.default.findByIdAndDelete(id);
            return result !== null;
        });
    }
    addSong(playlistId, songId) {
        return __awaiter(this, void 0, void 0, function* () {
            const objectIds = songId.map((id) => new mongoose_1.default.Types.ObjectId(id));
            return yield playlist_model_1.default.findByIdAndUpdate(playlistId, {
                $addToSet: { songs: { $each: objectIds } },
            }, { new: true })
                .populate('owner', 'firstName lastName username')
                .populate('songs', 'title music duration thumbnail uid');
        });
    }
    removeSong(playlistId, songId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield playlist_model_1.default.findByIdAndUpdate(playlistId, {
                $pull: { songs: new mongoose_1.default.Types.ObjectId(songId) }
            }, { new: true })
                .populate('owner', 'firstName lastName username')
                .populate('songs', 'title music duration thumbnail uid');
        });
    }
    reorderSongs(playlistId, songIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const objectIds = songIds.map(id => new mongoose_1.default.Types.ObjectId(id));
            return yield playlist_model_1.default.findByIdAndUpdate(playlistId, { $set: { songs: objectIds } }, { new: true })
                .populate('owner', 'firstName lastName username')
                .populate('songs', 'title music duration thumbnail uid');
        });
    }
    // Sharing functionality has been removed
    shareWithUsers(playlistId, userIds, canEdit = false) {
        return __awaiter(this, void 0, void 0, function* () {
            // Return the playlist without changes since sharing is removed
            return yield playlist_model_1.default.findById(playlistId)
                .populate('owner', 'firstName lastName username')
                .populate('songs', 'title music duration thumbnail uid');
        });
    }
    // Unsharing functionality has been removed
    unshareWithUsers(playlistId, userIds) {
        return __awaiter(this, void 0, void 0, function* () {
            // Return the playlist without changes since sharing is removed
            return yield playlist_model_1.default.findById(playlistId)
                .populate('owner', 'firstName lastName username')
                .populate('songs', 'title music duration thumbnail uid');
        });
    }
    updateTotalDuration(playlistId) {
        return __awaiter(this, void 0, void 0, function* () {
            const playlist = yield playlist_model_1.default.findById(playlistId).populate('songs', 'duration');
            if (!playlist)
                return null;
            const totalDuration = playlist.songs.reduce((total, song) => {
                return total + (song.duration || 0);
            }, 0);
            playlist.totalDuration = totalDuration;
            return yield playlist.save();
        });
    }
    incrementPlayCount(playlistId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield playlist_model_1.default.findByIdAndUpdate(playlistId, { $inc: { playCount: 1 } }, { new: true });
        });
    }
    search(searchParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = {};
            if (searchParams.name) {
                query.name = { $regex: searchParams.name, $options: 'i' };
            }
            if (searchParams.visibility) {
                query.visibility = searchParams.visibility;
            }
            if (searchParams.owner) {
                query.owner = new mongoose_1.default.Types.ObjectId(searchParams.owner);
            }
            const page = searchParams.page || 1;
            const limit = searchParams.limit || 10;
            return yield playlist_model_1.default.find(query)
                .populate('owner', 'firstName lastName username')
                .populate('songs', 'title music duration thumbnail uid')
                .sort({ updatedAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit);
        });
    }
    countByOwner(ownerId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield playlist_model_1.default.countDocuments({ owner: new mongoose_1.default.Types.ObjectId(ownerId) });
        });
    }
    countAccessiblePlaylists(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Count all playlists without permission checks
            return yield playlist_model_1.default.countDocuments({});
        });
    }
    countPublicPlaylists() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield playlist_model_1.default.countDocuments({ visibility: playlist_model_1.PlaylistVisibility.PUBLIC });
        });
    }
}
exports.PlaylistRepository = PlaylistRepository;
//# sourceMappingURL=playlist.repository.js.map