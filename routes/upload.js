
import express from 'express';
import multer from 'multer';
import fs from 'fs';
import cloudinary from '../utils/cloudinary.js';

const router = express.Router();


const upload = multer({
  dest: 'temp/',
  limits: { fileSize: 1 * 1024 * 1024 }, // 1MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png/;
    if (allowed.test(file.mimetype)) cb(null, true);
    else cb(new Error('Only JPG, JPEG, PNG allowed'));
  },
});

router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const folderName = req.body.folder || 'default';

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: folderName, 
    });

    fs.unlinkSync(req.file.path); 

    res.status(200).json({
      message: 'Upload successful',
      url: result.secure_url,
      folder: result.folder,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
