"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadCustomizer = exports.uploadMultiple = exports.uploadSingle = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uploadDir = path_1.default.join(process.cwd(), 'uploads');
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path_1.default.extname(file.originalname).toLowerCase();
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    }
});
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp',
        'image/heic',
        'image/svg+xml',
        'application/pdf'
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error('Unsupported file format. Only JPEG, PNG, WEBP, and PDF files are allowed.'));
    }
};
exports.uploadSingle = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: { fileSize: 25 * 1024 * 1024 } // 25 MB
}).single('file');
exports.uploadMultiple = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: { fileSize: 25 * 1024 * 1024 }
}).array('files', 20);
exports.uploadCustomizer = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: { fileSize: 30 * 1024 * 1024 }
}).fields([
    { name: 'photo', maxCount: 1 },
    { name: 'mockup', maxCount: 1 }
]);
