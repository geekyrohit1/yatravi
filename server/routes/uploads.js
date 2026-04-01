const express = require('express');
const router = express.Router();
const multer = require('multer');
const ImageKit = require('imagekit');
const path = require('path');
const Image = require('../models/Image');
const authMiddleware = require('../middleware/auth');

// --- IMAGEKIT CONFIGURATION ---
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

// Configure Multer with memory storage for ImageKit
const storage = multer.memoryStorage();

// File filter for images and videos
const fileFilter = (req, file, cb) => {
  const isImage = file.mimetype.startsWith('image/');
  const isVideo = file.mimetype.startsWith('video/');
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedVideoExts = ['.mp4', '.webm', '.mov', '.m4v', '.ogv'];
  const allowedImageExts = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'];
  const isAllowedExt = allowedVideoExts.includes(ext) || allowedImageExts.includes(ext);

  if (isImage || isVideo || isAllowedExt) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only Images and Videos (MP4, WebM, etc.) are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 200 * 1024 * 1024 } // 200MB Limit
});

// --- UPLOAD ROUTE ---
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const result = await imagekit.upload({
      file: req.file.buffer,
      fileName: req.file.originalname,
      folder: 'yatravi_uploads'
    });

    const newImage = new Image({
      title: req.body.title || 'Untitled',
      filename: result.name,
      path: result.url
    });

    await newImage.save();

    res.status(201).json({
      message: 'File uploaded successfully',
      url: result.url
    });
  } catch (error) {
    console.error('[UPLOAD] Failure:', error.message);
    res.status(500).json({
      message: 'Server Error during upload',
      error: error.message
    });
  }
});

// GET all images
router.get('/', async (req, res) => {
  try {
    const images = await Image.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE image
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Image.findByIdAndDelete(req.params.id);
    res.json({ message: 'Image deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
