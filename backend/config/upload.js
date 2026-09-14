const multer = require("multer");

// Files are held in memory as buffers, then streamed to Cloudinary manually
// (see config/uploadToCloudinary.js). This avoids the multer-storage-cloudinary
// package, which only supports the old cloudinary v1 SDK and conflicts with v2.
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files (jpg, jpeg, png, webp) are allowed"));
  }
};

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024, files: 5 }, // 5MB per file, 5 files max
});

module.exports = upload;
