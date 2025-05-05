const multer = require('multer');
const path = require('path');

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const sanitizedOriginalName = file.originalname
      .replace(/\s+/g, '-')                 // Replace spaces with dashes
      .replace(/[^a-zA-Z0-9.\-_]/g, '');    // Remove unsafe characters
    const uniqueName = `${Date.now()}-${sanitizedOriginalName}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only images are allowed'));
  }
};

//  Export the actual multer instance (not an object)
module.exports = multer({ storage, fileFilter });
