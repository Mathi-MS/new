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
exports.PlaylistService = void 0;
const playlist_repository_1 = require("../dao/playlist.repository");
const custom_error_1 = __importDefault(require("../config/custom.error"));
const http_status_code_1 = require("../config/enum/http-status.code");
const error_messages_enum_1 = require("../config/enum/error-messages.enum");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const util_1 = require("util");
class PlaylistService {
    constructor() {
        this.playlistRepository = new playlist_repository_1.PlaylistRepository();
    }
    createPlaylist(playlistData, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const playlist = yield this.playlistRepository.create(playlistData, userId);
                return this.mapToResponseDto(playlist);
            }
            catch (error) {
                throw new custom_error_1.default(`${error_messages_enum_1.ErrorMessages.PLAYLIST_CREATION_FAILED}: ${error.message}`, http_status_code_1.HTTPStatusCode.InternalServerError);
            }
        });
    }
    getPlaylistById(playlistId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const playlist = yield this.playlistRepository.findById(playlistId);
            if (!playlist) {
                throw new custom_error_1.default(error_messages_enum_1.ErrorMessages.PLAYLIST_NOT_FOUND, http_status_code_1.HTTPStatusCode.NotFound);
            }
            return this.mapToResponseDto(playlist);
        });
    }
    getPlaylistByUid(uid, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const playlist = yield this.playlistRepository.findByUid(uid);
            if (!playlist) {
                throw new custom_error_1.default(error_messages_enum_1.ErrorMessages.PLAYLIST_NOT_FOUND, http_status_code_1.HTTPStatusCode.NotFound);
            }
            return this.mapToResponseDto(playlist);
        });
    }
    getUserPlaylists(userId, page = 1, limit = 10) {
        return __awaiter(this, void 0, void 0, function* () {
            const [playlists, total] = yield Promise.all([
                this.playlistRepository.findByOwner(userId, page, limit),
                this.playlistRepository.countByOwner(userId)
            ]);
            const mappedPlaylists = playlists.map(playlist => {
                try {
                    return this.mapToSummaryDto(playlist);
                }
                catch (error) {
                    console.error('Error mapping playlist to summary DTO:', error);
                    console.error('Playlist data:', playlist);
                    throw error;
                }
            });
            return {
                playlists: mappedPlaylists,
                total,
                page,
                totalPages: Math.ceil(total / limit)
            };
        });
    }
    getAccessiblePlaylists(userId, page = 1, limit = 10) {
        return __awaiter(this, void 0, void 0, function* () {
            const [playlists, total] = yield Promise.all([
                this.playlistRepository.findAccessiblePlaylists(userId, page, limit),
                this.playlistRepository.countAccessiblePlaylists(userId)
            ]);
            return {
                playlists: playlists.map(playlist => this.mapToSummaryDto(playlist)),
                total,
                page,
                totalPages: Math.ceil(total / limit)
            };
        });
    }
    getPublicPlaylists(page = 1, limit = 10) {
        return __awaiter(this, void 0, void 0, function* () {
            const [playlists, total] = yield Promise.all([
                this.playlistRepository.findPublicPlaylists(page, limit),
                this.playlistRepository.countPublicPlaylists()
            ]);
            return {
                playlists: playlists.map(playlist => this.mapToSummaryDto(playlist)),
                total,
                page,
                totalPages: Math.ceil(total / limit)
            };
        });
    }
    getSharedPlaylists(userId, page = 1, limit = 10) {
        return __awaiter(this, void 0, void 0, function* () {
            // Sharing functionality has been removed
            // Return empty array with a note in the logs
            console.log('Sharing functionality has been removed. Use getPublicPlaylists() instead.');
            return [];
        });
    }
    updatePlaylist(playlistId, updateData, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const playlist = yield this.playlistRepository.findById(playlistId);
            if (!playlist) {
                throw new custom_error_1.default(error_messages_enum_1.ErrorMessages.PLAYLIST_NOT_FOUND, http_status_code_1.HTTPStatusCode.NotFound);
            }
            const updatedPlaylist = yield this.playlistRepository.update(playlistId, updateData);
            if (!updatedPlaylist) {
                throw new custom_error_1.default(error_messages_enum_1.ErrorMessages.PLAYLIST_UPDATE_FAILED, http_status_code_1.HTTPStatusCode.InternalServerError);
            }
            return this.mapToResponseDto(updatedPlaylist);
        });
    }
    deletePlaylist(playlistId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const playlist = yield this.playlistRepository.findById(playlistId);
            if (!playlist) {
                throw new custom_error_1.default(error_messages_enum_1.ErrorMessages.PLAYLIST_NOT_FOUND, http_status_code_1.HTTPStatusCode.NotFound);
            }
            return yield this.playlistRepository.delete(playlistId);
        });
    }
    addSongToPlaylist(playlistId, songData, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('=== addSongToPlaylist Debug ===');
            console.log('Playlist ID:', playlistId);
            console.log('User ID from service:', userId, '(type:', typeof userId, ')');
            const playlist = yield this.playlistRepository.findById(playlistId);
            if (!playlist) {
                throw new custom_error_1.default(error_messages_enum_1.ErrorMessages.PLAYLIST_NOT_FOUND, http_status_code_1.HTTPStatusCode.NotFound);
            }
            console.log('Found playlist:', playlist.name);
            console.log('Playlist owner from DB:', playlist.owner);
            console.log('Proceeding with adding song');
            console.log('================================');
            const updatedPlaylist = yield this.playlistRepository.addSong(playlistId, songData.songIds);
            if (!updatedPlaylist) {
                throw new custom_error_1.default(error_messages_enum_1.ErrorMessages.SONG_ADD_FAILED, http_status_code_1.HTTPStatusCode.InternalServerError);
            }
            // Update total duration
            yield this.playlistRepository.updateTotalDuration(playlistId);
            return this.mapToResponseDto(updatedPlaylist);
        });
    }
    removeSongFromPlaylist(playlistId, songData, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const playlist = yield this.playlistRepository.findById(playlistId);
            if (!playlist) {
                throw new custom_error_1.default(error_messages_enum_1.ErrorMessages.PLAYLIST_NOT_FOUND, http_status_code_1.HTTPStatusCode.NotFound);
            }
            const updatedPlaylist = yield this.playlistRepository.removeSong(playlistId, songData.songId);
            if (!updatedPlaylist) {
                throw new custom_error_1.default(error_messages_enum_1.ErrorMessages.SONG_REMOVE_FAILED, http_status_code_1.HTTPStatusCode.InternalServerError);
            }
            // Update total duration
            yield this.playlistRepository.updateTotalDuration(playlistId);
            return this.mapToResponseDto(updatedPlaylist);
        });
    }
    reorderSongs(playlistId, reorderData, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const playlist = yield this.playlistRepository.findById(playlistId);
            if (!playlist) {
                throw new custom_error_1.default(error_messages_enum_1.ErrorMessages.PLAYLIST_NOT_FOUND, http_status_code_1.HTTPStatusCode.NotFound);
            }
            const updatedPlaylist = yield this.playlistRepository.reorderSongs(playlistId, reorderData.songIds);
            if (!updatedPlaylist) {
                throw new custom_error_1.default(error_messages_enum_1.ErrorMessages.PLAYLIST_REORDER_FAILED, http_status_code_1.HTTPStatusCode.InternalServerError);
            }
            return this.mapToResponseDto(updatedPlaylist);
        });
    }
    sharePlaylist(playlistId, shareData, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const playlist = yield this.playlistRepository.findById(playlistId);
            if (!playlist) {
                throw new custom_error_1.default(error_messages_enum_1.ErrorMessages.PLAYLIST_NOT_FOUND, http_status_code_1.HTTPStatusCode.NotFound);
            }
            // Sharing functionality has been removed
            // Return the playlist as is with a note in the logs
            console.log('Sharing functionality has been removed. To make a playlist accessible, set it to public.');
            return this.mapToResponseDto(playlist);
        });
    }
    unsharePlaylist(playlistId, userIds, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const playlist = yield this.playlistRepository.findById(playlistId);
            if (!playlist) {
                throw new custom_error_1.default(error_messages_enum_1.ErrorMessages.PLAYLIST_NOT_FOUND, http_status_code_1.HTTPStatusCode.NotFound);
            }
            // Sharing functionality has been removed
            // Return the playlist as is with a note in the logs
            console.log('Sharing functionality has been removed. Playlist access is now controlled only by visibility setting.');
            return this.mapToResponseDto(playlist);
        });
    }
    playPlaylist(playlistId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const playlist = yield this.playlistRepository.findById(playlistId);
            if (!playlist) {
                throw new custom_error_1.default(error_messages_enum_1.ErrorMessages.PLAYLIST_NOT_FOUND, http_status_code_1.HTTPStatusCode.NotFound);
            }
            // Increment play count
            yield this.playlistRepository.incrementPlayCount(playlistId);
            return this.mapToResponseDto(playlist);
        });
    }
    searchPlaylists(searchParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const playlists = yield this.playlistRepository.search(searchParams);
            return playlists.map(playlist => this.mapToSummaryDto(playlist));
        });
    }
    getThumbnails(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const readFileAsync = (0, util_1.promisify)(fs.readFile);
            const statAsync = (0, util_1.promisify)(fs.stat);
            const results = [];
            // Log the request for debugging
            console.log('getThumbnails called with filenames:', data.filenames);
            // Process each filename
            for (const filename of data.filenames) {
                try {
                    // Sanitize the filename to prevent directory traversal
                    const sanitizedFilename = path.basename(filename);
                    const filePath = path.join(__dirname, '..', 'uploads', 'Playlists', 'thumbnails', sanitizedFilename);
                    console.log(`Looking for thumbnail at path: ${filePath}`);
                    // Check if file exists
                    if (!fs.existsSync(filePath)) {
                        console.warn(`Thumbnail file not found: ${sanitizedFilename}`);
                        continue;
                    }
                    // Get file stats
                    const stats = yield statAsync(filePath);
                    // Read file content
                    const fileBuffer = yield readFileAsync(filePath);
                    const base64Content = fileBuffer.toString('base64');
                    // Determine mime type based on extension
                    const ext = path.extname(filePath).toLowerCase();
                    let mimeType = 'application/octet-stream'; // Default
                    if (ext === '.jpg' || ext === '.jpeg')
                        mimeType = 'image/jpeg';
                    else if (ext === '.png')
                        mimeType = 'image/png';
                    else if (ext === '.gif')
                        mimeType = 'image/gif';
                    else if (ext === '.webp')
                        mimeType = 'image/webp';
                    // Add to results
                    results.push({
                        filename: sanitizedFilename,
                        content: base64Content,
                        mimeType: mimeType,
                        mediaType: 'image',
                        size: stats.size
                    });
                    console.log(`Successfully processed thumbnail: ${sanitizedFilename}`);
                }
                catch (error) {
                    console.error(`Error processing thumbnail ${filename}:`, error);
                    // Continue with next file instead of failing the whole request
                }
            }
            console.log(`Returning ${results.length} thumbnails`);
            return results;
        });
    }
    mapToResponseDto(playlist) {
        return {
            _id: playlist._id.toString(),
            name: playlist.name,
            description: playlist.description,
            owner: playlist.owner,
            visibility: playlist.visibility,
            songs: playlist.songs || [],
            totalDuration: playlist.totalDuration || 0,
            playCount: playlist.playCount || 0,
            thumbnail: playlist.thumbnail,
            uid: playlist.uid,
            createdAt: playlist.createdAt,
            updatedAt: playlist.updatedAt
        };
    }
    mapToSummaryDto(playlist) {
        return {
            _id: playlist._id.toString(),
            name: playlist.name,
            description: playlist.description,
            owner: playlist.owner,
            visibility: playlist.visibility,
            songCount: playlist.songs ? playlist.songs.length : 0,
            totalDuration: playlist.totalDuration || 0,
            playCount: playlist.playCount || 0,
            thumbnail: playlist.thumbnail,
            uid: playlist.uid,
            createdAt: playlist.createdAt,
            updatedAt: playlist.updatedAt
        };
    }
}
exports.PlaylistService = PlaylistService;
//# sourceMappingURL=playlist.service.js.map