"use strict";
/**
 * Playlist API Usage Examples
 *
 * This file demonstrates how to use the playlist functionality through HTTP requests.
 * Replace the placeholders with actual values when testing.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePlaylistExample = exports.unsharePlaylistExample = exports.removeSongFromPlaylistExample = exports.updatePlaylistExample = exports.playPlaylistExample = exports.searchPlaylistsExample = exports.reorderSongsExample = exports.getSharedPlaylistsExample = exports.getPublicPlaylistsExample = exports.addSongToPlaylistExample = exports.sharePlaylistExample = exports.getUserPlaylistsExample = exports.createPlaylistExample = void 0;
// Example: Create a new playlist
const createPlaylistExample = {
    method: 'POST',
    url: '/v1/playlists',
    headers: {
        'Authorization': 'Bearer YOUR_JWT_TOKEN',
        'Content-Type': 'application/json'
    },
    body: {
        name: "My Favorite Songs",
        description: "A collection of my favorite educational songs",
        visibility: "private", // or "public" or "shared"
        thumbnail: "https://example.com/playlist-thumbnail.jpg"
    }
};
exports.createPlaylistExample = createPlaylistExample;
// Example: Get user's own playlists
const getUserPlaylistsExample = {
    method: 'GET',
    url: '/v1/playlists/my?page=1&limit=10',
    headers: {
        'Authorization': 'Bearer YOUR_JWT_TOKEN'
    }
};
exports.getUserPlaylistsExample = getUserPlaylistsExample;
// Example: Share a playlist with other users
const sharePlaylistExample = {
    method: 'POST',
    url: '/v1/playlists/PLAYLIST_ID/share',
    headers: {
        'Authorization': 'Bearer YOUR_JWT_TOKEN',
        'Content-Type': 'application/json'
    },
    body: {
        userIds: ["USER_ID_1", "USER_ID_2"],
        canEdit: true // Allow shared users to edit the playlist
    }
};
exports.sharePlaylistExample = sharePlaylistExample;
// Example: Add a song to playlist
const addSongToPlaylistExample = {
    method: 'POST',
    url: '/v1/playlists/PLAYLIST_ID/songs',
    headers: {
        'Authorization': 'Bearer YOUR_JWT_TOKEN',
        'Content-Type': 'application/json'
    },
    body: {
        songId: "SONG_ID_TO_ADD"
    }
};
exports.addSongToPlaylistExample = addSongToPlaylistExample;
// Example: Get public playlists (no authentication required)
const getPublicPlaylistsExample = {
    method: 'GET',
    url: '/v1/playlists/public?page=1&limit=10'
};
exports.getPublicPlaylistsExample = getPublicPlaylistsExample;
// Example: Get playlists shared with current user
const getSharedPlaylistsExample = {
    method: 'GET',
    url: '/v1/playlists/shared?page=1&limit=10',
    headers: {
        'Authorization': 'Bearer YOUR_JWT_TOKEN'
    }
};
exports.getSharedPlaylistsExample = getSharedPlaylistsExample;
// Example: Reorder songs in a playlist
const reorderSongsExample = {
    method: 'PUT',
    url: '/v1/playlists/PLAYLIST_ID/reorder',
    headers: {
        'Authorization': 'Bearer YOUR_JWT_TOKEN',
        'Content-Type': 'application/json'
    },
    body: {
        songIds: ["SONG_ID_1", "SONG_ID_3", "SONG_ID_2"] // New order
    }
};
exports.reorderSongsExample = reorderSongsExample;
// Example: Search for playlists
const searchPlaylistsExample = {
    method: 'GET',
    url: '/v1/playlists/search?name=favorite&visibility=public&page=1&limit=10'
};
exports.searchPlaylistsExample = searchPlaylistsExample;
// Example: Play a playlist (increment play count)
const playPlaylistExample = {
    method: 'POST',
    url: '/v1/playlists/PLAYLIST_ID/play',
    headers: {
        'Authorization': 'Bearer YOUR_JWT_TOKEN'
    }
};
exports.playPlaylistExample = playPlaylistExample;
// Example: Update playlist details
const updatePlaylistExample = {
    method: 'PUT',
    url: '/v1/playlists/PLAYLIST_ID',
    headers: {
        'Authorization': 'Bearer YOUR_JWT_TOKEN',
        'Content-Type': 'application/json'
    },
    body: {
        name: "Updated Playlist Name",
        description: "Updated description",
        visibility: "public"
    }
};
exports.updatePlaylistExample = updatePlaylistExample;
// Example: Remove a song from playlist
const removeSongFromPlaylistExample = {
    method: 'DELETE',
    url: '/v1/playlists/PLAYLIST_ID/songs',
    headers: {
        'Authorization': 'Bearer YOUR_JWT_TOKEN',
        'Content-Type': 'application/json'
    },
    body: {
        songId: "SONG_ID_TO_REMOVE"
    }
};
exports.removeSongFromPlaylistExample = removeSongFromPlaylistExample;
// Example: Unshare playlist with specific users
const unsharePlaylistExample = {
    method: 'POST',
    url: '/v1/playlists/PLAYLIST_ID/unshare',
    headers: {
        'Authorization': 'Bearer YOUR_JWT_TOKEN',
        'Content-Type': 'application/json'
    },
    body: {
        userIds: ["USER_ID_1", "USER_ID_2"]
    }
};
exports.unsharePlaylistExample = unsharePlaylistExample;
// Example: Delete a playlist
const deletePlaylistExample = {
    method: 'DELETE',
    url: '/v1/playlists/PLAYLIST_ID',
    headers: {
        'Authorization': 'Bearer YOUR_JWT_TOKEN'
    }
};
exports.deletePlaylistExample = deletePlaylistExample;
//# sourceMappingURL=playlist-example.js.map