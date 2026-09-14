const { Readable } = require("stream");
const cloudinary = require("./cloudinary");

// Uploads a single file buffer (from multer memoryStorage) to Cloudinary and
// resolves with the result object ({ secure_url, public_id, ... }).
const uploadBufferToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "brick-and-beams/properties",
        transformation: [
          { width: 1920, height: 1440, crop: "limit", quality: "auto", fetch_format: "auto" },
        ],
        ...options,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    Readable.from(buffer).pipe(uploadStream);
  });
};

// Convenience helper for multer's req.files array — uploads all of them in parallel
const uploadFilesToCloudinary = (files = []) =>
  Promise.all(files.map((file) => uploadBufferToCloudinary(file.buffer)));

module.exports = { uploadBufferToCloudinary, uploadFilesToCloudinary };
