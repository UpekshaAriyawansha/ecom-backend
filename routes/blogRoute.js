const express = require('express');
const router = express.Router();
const {authMiddleware, isAdmin} = require('../middlewares/authMiddleware');
const {
    createBlog,
    updateBlog,
    getBlog,
    getAllBlog,
    deleteBlog,
    likeBlog,
    disLikeBlog,
    uploadImages
} = require('../controller/blogCrtl');
const {uploadPhoto, blogImgResize} = require('../middlewares/uploadImages');



router.post('/', authMiddleware, isAdmin, createBlog);

// router.put('/upload/:id', authMiddleware, isAdmin, 
// uploadImage.array('images',2), blogImageResize, uploadImages);

router.put(
    "/upload/:id",
    authMiddleware,
    isAdmin,
    uploadPhoto.array("images", 2),
    blogImgResize,
    uploadImages
  );

router.put('/likes', authMiddleware, likeBlog);
router.put('/dislikes', authMiddleware, disLikeBlog);
router.put('/:id', authMiddleware, isAdmin, updateBlog);
router.get('/:id', getBlog);
router.get('/', getAllBlog);
router.delete('/:id', authMiddleware, isAdmin, deleteBlog);





module.exports = router;