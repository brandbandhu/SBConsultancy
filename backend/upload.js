import fs from "fs";
import path from "path";
import multer from "multer";

const uploadRoot = path.resolve(process.env.UPLOAD_DIR || "backend/uploads");
fs.mkdirSync(uploadRoot, { recursive: true });

const allowedTypes = new Set(["application/pdf", "image/jpeg", "image/png"]);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadRoot),
  filename: (_req, file, cb) => {
    const safeBase = path
      .basename(file.originalname, path.extname(file.originalname))
      .replace(/[^a-z0-9_-]/gi, "-")
      .slice(0, 80);
    cb(null, `${Date.now()}-${safeBase}${path.extname(file.originalname).toLowerCase()}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!allowedTypes.has(file.mimetype)) {
      return cb(new Error("Only PDF, JPG and PNG files are allowed"));
    }
    cb(null, true);
  },
});

export function filePayload(file) {
  if (!file) return {};
  return {
    file_name: file.originalname,
    file_path: `/uploads/${file.filename}`,
    mime_type: file.mimetype,
  };
}
