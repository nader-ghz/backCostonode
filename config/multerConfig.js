import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Ensure this matches your upload folder path
  },
  filename: (req, file, cb) => {
    // Generate a unique identifier prefix
    const uniquePrefix = Date.now() + '-';
    // Use uniquePrefix and the original filename
    cb(null, uniquePrefix + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png/;
  const mimetype = allowedFileTypes.test(file.mimetype);
  const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error('File upload only supports the following filetypes - ' + allowedFileTypes));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 } // Limit file size to 5MB
});

export default upload;
