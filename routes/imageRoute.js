const express = require('express');
const router = express.Router();
const {
    uploadImages,
    deleteImages
} = require('../controller/imageCtrl');
const {isAdmin, authMiddleware} = require('../middlewares/authMiddleware');
const {uploadImage, productImageResize,} = require('../middlewares/uploadImages');

router.put('/upload', authMiddleware, isAdmin, 
uploadImage.array('images',10), productImageResize, uploadImages);
router.delete('/delete-images/:id', authMiddleware, isAdmin, deleteImages);


module.exports = router;