"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bulk_user_controller_1 = __importDefault(require("../controller/bulk-user.controller"));
const typedi_1 = __importDefault(require("typedi"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const user_model_1 = require("../model/user.model");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Configure storage for Excel uploads
const excelUploadDir = path_1.default.join(__dirname, '../uploads/Excel');
// Ensure directory exists
if (!fs_1.default.existsSync(excelUploadDir)) {
    fs_1.default.mkdirSync(excelUploadDir, { recursive: true });
}
const excelStorage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, excelUploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path_1.default.extname(file.originalname);
        cb(null, 'user-upload-' + uniqueSuffix + ext);
    }
});
// File filter for Excel files
const excelFileFilter = (req, file, cb) => {
    const allowedTypes = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel.sheet.macroEnabled.12'
    ];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error('Only Excel files are allowed'));
    }
};
// Create Excel upload middleware
const excelUpload = (0, multer_1.default)({
    storage: excelStorage,
    fileFilter: excelFileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB max file size
        files: 1 // Only one file at a time
    }
});
const router = (0, express_1.Router)();
const bulkUserController = typedi_1.default.get(bulk_user_controller_1.default);
/**
 * @swagger
 * /v1/bulk-user/template:
 *   get:
 *     summary: Download Excel template for bulk user upload
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Excel template file
 *       500:
 *         description: Internal server error
 */
router.get('/template', auth_middleware_1.protect, (0, auth_middleware_1.authorize)(user_model_1.UserRole.ADMIN, user_model_1.UserRole.TEACHER), (req, res, next) => bulkUserController.downloadBulkUploadTemplate(req, res, next));
/**
 * @swagger
 * /v1/bulk-user/upload:
 *   post:
 *     summary: Bulk upload users from Excel file
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Excel file with user data
 *     responses:
 *       200:
 *         description: Users uploaded successfully
 *       400:
 *         description: Invalid file or data
 *       500:
 *         description: Internal server error
 */
router.post('/upload', auth_middleware_1.protect, (0, auth_middleware_1.authorize)(user_model_1.UserRole.ADMIN, user_model_1.UserRole.TEACHER), excelUpload.single('file'), (req, res, next) => bulkUserController.bulkUploadUsers(req, res, next));
exports.default = router;
//# sourceMappingURL=bulk-user.routes.js.map