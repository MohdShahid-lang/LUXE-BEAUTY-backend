const fs = require('fs');
const path = require('path');
const multer = require('multer');

const uploadsDir = path.join(process.cwd(), 'uploads');

fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, uploadsDir);
  },
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname || '').toLowerCase();
    const safeBaseName = path
      .basename(file.originalname || 'image', extension)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 40) || 'image';

    callback(null, `${Date.now()}-${safeBaseName}${extension}`);
  }
});

const fileFilter = (_req, file, callback) => {
  if (!file.mimetype?.startsWith('image/')) {
    callback(new Error('Only image files are allowed'));
    return;
  }

  callback(null, true);
};

const uploadProductImage = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
}).single('imageFile');

module.exports = {
  uploadProductImage
};
