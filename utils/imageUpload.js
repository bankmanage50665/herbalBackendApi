const multer = require("multer");
const uuid = require("uuid").v4;

const MIMETYPE_MAP = {
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
  "image/png": "png",
  "image/avif": "avif",
  "image/jfif": "jfif",
};

const fileUpload = multer({
  limits: 50000,
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/images");
    },
    filename: (req, file, cb) => {
      const ext = MIMETYPE_MAP[file.mimetype];
      cb(null, uuid() + "." + ext);
    },
  }),
  fileFilter: (req, file, cb) => {
    const isValid = !!MIMETYPE_MAP[file.mimetype];
    const err = isValid ? null : new Error("Invalid mimetype");
    cb(err, isValid);
  },
});

module.exports = fileUpload;
