const express    = require('express');
const upload     = require('../middleware/upload');
const { uploadImage } = require('../config/cloudinary');
const authenticate    = require('../middleware/auth.middleware');

const router = express.Router();
router.use(authenticate);

// Upload single image
router.post('/', upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    // Convert buffer to base64 for Cloudinary
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    const result = await uploadImage({ path: dataURI });

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;