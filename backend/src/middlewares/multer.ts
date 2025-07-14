import multer, { FileFilterCallback } from "multer";
import { Request } from "express";

const MAX_SIZE = 2 * 1024 * 1024; // 2MB

// File filter for images only
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const allowedTypes = /jpeg|jpg|png/;
  const mimeType = allowedTypes.test(file.mimetype);
  const extName = allowedTypes.test(file.originalname.toLowerCase());

  if (mimeType && extName) {
    cb(null, true);
  } else {
    cb(new Error("Only .jpg, .jpeg, and .png files are allowed!"));
  }
};

// In-memory storage
const storage = multer.memoryStorage();

// Upload configeration
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_SIZE },
});

export default upload;
