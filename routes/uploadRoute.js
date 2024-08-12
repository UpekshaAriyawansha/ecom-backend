const express = require('express');
const router = express.Router();
const {
    uploadImages,
    deleteImages
} = require('../controller/uploadCtrl');
const {isAdmin, authMiddleware} = require('../middlewares/authMiddleware');
const {uploadPhoto, productImgResize,} = require('../middlewares/uploadImages');

// router.put('/', authMiddleware, isAdmin, 
// uploadImage.array('images',10), productImageResize, uploadImages);

router.post(
    "/",
    authMiddleware,
    isAdmin,
    uploadPhoto.array("images", 10),
    productImgResize,
    uploadImages
  );

router.delete('/delete-images/:id', authMiddleware, isAdmin, deleteImages);

module.exports = router;