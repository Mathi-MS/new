"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorMessages = void 0;
var ErrorMessages;
(function (ErrorMessages) {
    ErrorMessages["AppStartupFail"] = "Unable to start the app!";
    ErrorMessages["CreateFail"] = "Unable to save entry to DB!";
    ErrorMessages["GetFail"] = "Unable to retrieve data from DB!";
    ErrorMessages["UpdateFail"] = "Unable to update data in DB!";
    ErrorMessages["DeleteFail"] = "Unable to delete entry from DB!";
    ErrorMessages["DuplicateEntryFail"] = "User already exists!";
    ErrorMessages["PasswordMismatchFail"] = "Passwords must match!";
    ErrorMessages["Generic"] = "Something went wrong!";
    ErrorMessages["NotFound"] = "Unable to find the requested resource!";
    ErrorMessages["UncaughtException"] = "Uncaught Exception thrown!";
    ErrorMessages["UnhandledRejection"] = "Unhandled Exception thrown!";
    // Playlist specific errors
    ErrorMessages["PLAYLIST_NOT_FOUND"] = "Playlist not found!";
    ErrorMessages["PLAYLIST_ACCESS_DENIED"] = "You do not have access to this playlist!";
    ErrorMessages["PLAYLIST_EDIT_DENIED"] = "You do not have permission to edit this playlist!";
    ErrorMessages["PLAYLIST_DELETE_DENIED"] = "You do not have permission to delete this playlist!";
    ErrorMessages["PLAYLIST_SHARE_DENIED"] = "You do not have permission to share this playlist!";
    ErrorMessages["PLAYLIST_UNSHARE_DENIED"] = "You do not have permission to unshare this playlist!";
    ErrorMessages["PLAYLIST_CREATION_FAILED"] = "Failed to create playlist!";
    ErrorMessages["PLAYLIST_UPDATE_FAILED"] = "Failed to update playlist!";
    ErrorMessages["PLAYLIST_SHARE_FAILED"] = "Failed to share playlist!";
    ErrorMessages["PLAYLIST_UNSHARE_FAILED"] = "Failed to unshare playlist!";
    ErrorMessages["PLAYLIST_REORDER_FAILED"] = "Failed to reorder songs in playlist!";
    ErrorMessages["SONG_ADD_FAILED"] = "Failed to add song to playlist!";
    ErrorMessages["SONG_REMOVE_FAILED"] = "Failed to remove song from playlist!";
})(ErrorMessages || (exports.ErrorMessages = ErrorMessages = {}));
//# sourceMappingURL=error-messages.enum.js.map