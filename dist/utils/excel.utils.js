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
exports.generateUID = exports.parseUserUploadExcel = exports.generateUserUploadTemplate = void 0;
const XLSX = __importStar(require("xlsx"));
const exceljs_1 = __importDefault(require("exceljs"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const user_model_1 = require("../model/user.model");
// Directory for storing temporary Excel files
const excelTempDir = path_1.default.join(__dirname, '../uploads/Excel');
// Ensure the directory exists
if (!fs_1.default.existsSync(excelTempDir)) {
    fs_1.default.mkdirSync(excelTempDir, { recursive: true });
}
/**
 * Generate a sample Excel template for user bulk upload with dropdown lists
 * @returns Path to the generated Excel file
 */
const generateUserUploadTemplate = () => __awaiter(void 0, void 0, void 0, function* () {
    // Create a new workbook using ExcelJS
    const workbook = new exceljs_1.default.Workbook();
    const worksheet = workbook.addWorksheet('Users');
    // Define columns with validation
    worksheet.columns = [
        { header: 'firstName', key: 'firstName', width: 15 },
        { header: 'lastName', key: 'lastName', width: 15 },
        { header: 'username', key: 'username', width: 15 },
        { header: 'email', key: 'email', width: 20 },
        { header: 'password', key: 'password', width: 15 },
        { header: 'age', key: 'age', width: 10 },
        { header: 'gender', key: 'gender', width: 10 },
        { header: 'mobileNumber', key: 'mobileNumber', width: 15 },
        { header: 'role', key: 'role', width: 10 },
        { header: 'class', key: 'class', width: 10 },
        { header: 'syllabus', key: 'syllabus', width: 15 }
    ];
    // Style the header row
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFD3D3D3' } // Light gray
    };
    // Add borders to header
    worksheet.getRow(1).eachCell((cell) => {
        cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };
    });
    // Add example row
    worksheet.addRow({
        firstName: 'John',
        lastName: 'Doe',
        username: 'johndoe',
        email: 'john.doe@example.com',
        password: 'password123',
        age: 30,
        gender: 'male',
        mobileNumber: '1234567890',
        role: 'student',
        class: '10',
        syllabus: 'CBSE'
    });
    // Add dropdown for gender (applies to column G, rows 2-1000)
    for (let row = 2; row <= 1000; row++) {
        worksheet.getCell(`G${row}`).dataValidation = {
            type: 'list',
            allowBlank: false,
            formulae: ['"male,female,other"']
        };
    }
    // Add dropdown for role (applies to column I, rows 2-1000)
    for (let row = 2; row <= 1000; row++) {
        worksheet.getCell(`I${row}`).dataValidation = {
            type: 'list',
            allowBlank: false,
            formulae: [`"${Object.values(user_model_1.UserRole).join(',')}"`]
        };
    }
    // Add dropdown for class (applies to column J, rows 2-1000)
    for (let row = 2; row <= 1000; row++) {
        worksheet.getCell(`J${row}`).dataValidation = {
            type: 'list',
            allowBlank: true,
            formulae: ['"1,2,3,4,5,6,7,8,9,10,11,12"']
        };
    }
    // Add dropdown for syllabus (applies to column K, rows 2-1000)
    for (let row = 2; row <= 1000; row++) {
        worksheet.getCell(`K${row}`).dataValidation = {
            type: 'list',
            allowBlank: true,
            formulae: ['"CBSE,ICSE,State Board,IB,IGCSE,Other"']
        };
    }
    // Generate a unique filename
    const timestamp = new Date().getTime();
    const filename = `user_upload_template_${timestamp}.xlsx`;
    const filePath = path_1.default.join(excelTempDir, filename);
    // Save the workbook
    yield workbook.xlsx.writeFile(filePath);
    return filePath;
});
exports.generateUserUploadTemplate = generateUserUploadTemplate;
/**
 * Parse an Excel file for user bulk upload
 * @param filePath Path to the Excel file
 * @returns Array of user data objects
 */
const parseUserUploadExcel = (filePath) => {
    // Read the Excel file
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    // Convert to JSON
    const data = XLSX.utils.sheet_to_json(worksheet);
    // Validate and transform data
    return data.map((row) => {
        // Convert age to number if it's a string
        if (row.age && typeof row.age === 'string') {
            row.age = parseInt(row.age, 10);
        }
        return {
            firstName: row.firstName,
            lastName: row.lastName,
            username: row.username,
            email: row.email,
            password: row.password,
            age: row.age,
            gender: row.gender,
            mobileNumber: row.mobileNumber,
            role: row.role,
            class: row.class,
            syllabus: row.syllabus
        };
    });
};
exports.parseUserUploadExcel = parseUserUploadExcel;
/**
 * Generate a UID for a user
 * @returns Random UID string
 */
const generateUID = () => {
    return Math.random().toString(36).substring(2, 12);
};
exports.generateUID = generateUID;
//# sourceMappingURL=excel.utils.js.map