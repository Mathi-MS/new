"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
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
const typedi_1 = require("typedi");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const http_status_code_1 = require("../config/enum/http-status.code");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const user_service_1 = __importDefault(require("../service/user.service"));
const excel_utils_1 = require("../utils/excel.utils");
let BulkUserController = class BulkUserController {
    constructor(userService) {
        this.userService = userService;
        /**
         * @swagger
         * /v1/user/bulk-upload/template:
         *   get:
         *     summary: Download Excel template for bulk user upload
         *     tags: [Users]
         *     security:
         *       - bearerAuth: []
         *     responses:
         *       200:
         *         description: Excel template file
         *         content:
         *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
         *             schema:
         *               type: string
         *               format: binary
         *       500:
         *         description: Internal server error
         */
        this.downloadBulkUploadTemplate = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                // Generate the template file (now async)
                const templatePath = yield (0, excel_utils_1.generateUserUploadTemplate)();
                // Get filename from path
                const filename = path_1.default.basename(templatePath);
                // Set headers for file download
                res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                // Stream the file to the response
                const fileStream = fs_1.default.createReadStream(templatePath);
                fileStream.pipe(res);
                // Delete the file after sending (cleanup)
                fileStream.on('end', () => {
                    fs_1.default.unlink(templatePath, (err) => {
                        if (err)
                            console.error('Error deleting template file:', err);
                    });
                });
            }
            catch (error) {
                console.error('Error generating template:', error);
                return res.status(http_status_code_1.HTTPStatusCode.InternalServerError).json({
                    success: false,
                    message: 'Failed to generate Excel template'
                });
            }
        }));
        /**
         * @swagger
         * /v1/user/bulk-upload:
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
        this.bulkUploadUsers = (0, express_async_handler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                // Check if file was uploaded
                if (!req.file) {
                    return res.status(http_status_code_1.HTTPStatusCode.BadRequest).json({
                        success: false,
                        message: 'No file uploaded'
                    });
                }
                // Parse the Excel file
                const filePath = req.file.path;
                const userData = (0, excel_utils_1.parseUserUploadExcel)(filePath);
                // Validate that we have data
                if (!userData || userData.length === 0) {
                    return res.status(http_status_code_1.HTTPStatusCode.BadRequest).json({
                        success: false,
                        message: 'No user data found in the uploaded file'
                    });
                }
                // Process the bulk upload
                const result = yield this.userService.bulkCreateUsers(userData);
                // Delete the temporary file
                fs_1.default.unlink(filePath, (err) => {
                    if (err)
                        console.error('Error deleting uploaded file:', err);
                });
                return res.status(http_status_code_1.HTTPStatusCode.Ok).json({
                    success: true,
                    message: 'Bulk user upload processed',
                    data: result
                });
            }
            catch (error) {
                console.error('Error processing bulk upload:', error);
                return res.status(http_status_code_1.HTTPStatusCode.InternalServerError).json({
                    success: false,
                    message: 'Failed to process bulk user upload'
                });
            }
        }));
    }
};
BulkUserController = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [user_service_1.default])
], BulkUserController);
exports.default = BulkUserController;
//# sourceMappingURL=bulk-user.controller.js.map