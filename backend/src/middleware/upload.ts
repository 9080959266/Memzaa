import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
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
  } else {
    cb(new Error('Unsupported file format. Only JPEG, PNG, WEBP, and PDF files are allowed.'));
  }
};

export const uploadSingle = multer({
  storage,
  fileFilter,
  limits: { fileSize: 25 * 1024 * 1024 } // 25 MB
}).single('file');

export const uploadMultiple = multer({
  storage,
  fileFilter,
  limits: { fileSize: 25 * 1024 * 1024 }
}).array('files', 20);

export const uploadCustomizer = multer({
  storage,
  fileFilter,
  limits: { fileSize: 30 * 1024 * 1024 }
}).fields([
  { name: 'photo', maxCount: 1 },
  { name: 'mockup', maxCount: 1 }
]);
