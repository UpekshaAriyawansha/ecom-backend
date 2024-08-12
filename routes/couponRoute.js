const express = require('express');
const router = express.Router();
const {authMiddleware, isAdmin} = require('../middlewares/authMiddleware');
const {
    createCoupon,
    getAllCoupon,
    updateCoupon,
    deleteCoupon,
    getCoupon

    
} = require('../controller/couponCtrl');


router.post('/', authMiddleware, isAdmin, createCoupon);
router.put('/:id', authMiddleware, isAdmin, updateCoupon);
router.delete('/:id', authMiddleware, isAdmin, deleteCoupon);
router.get('/:id', authMiddleware, isAdmin,  getCoupon);
router.get('/', authMiddleware, isAdmin, getAllCoupon);



module.exports = router;