const express = require('express');
const router = express.Router();
const {
    createProduct,
    getOneProduct,
    getAllProducts,
    updateProduct,
    deleteProduct,
    addToWishList,
    rating,
    uploadImages,
    deleteImages
} = require('../controller/productCtrl');
const {isAdmin, authMiddleware} = require('../middlewares/authMiddleware');
const {uploadImage, productImageResize,} = require('../middlewares/uploadImages');

router.post('/', authMiddleware, isAdmin, createProduct);

router.get('/:id',getOneProduct);//
router.put('/wishlist', authMiddleware, addToWishList);
router.put('/rating', authMiddleware, rating);
router.put('/:id', authMiddleware, isAdmin, updateProduct);
router.delete('/:id', authMiddleware, isAdmin, deleteProduct);
router.get('/',getAllProducts);





module.exports = router;