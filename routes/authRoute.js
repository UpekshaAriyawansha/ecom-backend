const express = require('express');
const router = express.Router();
const {
    createUser,
    loginUserCtrl, 
    loginAdminCtrl,
    getallUser, 
    getOneUser,
    getWishlist, 
    deleteOneUser, 
    updateOneUser,
    saveAddress,
    blockUser,
    unblockUser,
    handleRefreshToken,
    logout,
    updatePassword,
    forgotPasswordToken,
    resetPassword,
    userCart,
    getUserCart,
    // deleteCart,
    // applyCoupon,
    createOrder,
    // getOrders,
    // getAllOrders,
    // updateOrderStatus,
    // getOrderByUserId,
    removeProductFromCart,
    updateProductQuantityFromCart,
    getMyOrders,
                } = require('../controller/userCtrl');
const {authMiddleware, isAdmin} = require('../middlewares/authMiddleware');
const {checkout, paymentVerification} = require('../controller/paymentCtrl');

router.post('/register',createUser);
router.post('/forgot-password-token',forgotPasswordToken);
router.put("/reset-password/:token", resetPassword);
router.put('/password', authMiddleware, updatePassword);
router.post('/login',loginUserCtrl);
router.post('/admin-login', loginAdminCtrl);
router.post('/cart/create-order', authMiddleware, createOrder);
router.post('/order/checkout', authMiddleware, checkout);
router.post('/order/paymentVerification', authMiddleware, paymentVerification);

router.post('/cart', authMiddleware, userCart);
router.get('/cart', authMiddleware, getUserCart);
// router.delete('/empty-cart', authMiddleware, deleteCart);
router.delete('/delete-product-cart/:cartItemId', authMiddleware, removeProductFromCart);
router.delete('/update-product-cart/:cartItemId/:newQuantity', authMiddleware, updateProductQuantityFromCart);

// router.post('/cart/apply-coupon', authMiddleware, applyCoupon);
// router.post('/cart/cash-order', authMiddleware, createOrder);
// router.get('/get-orders', authMiddleware, getOrders);
// router.get('/get-order-by-user/:id', authMiddleware, isAdmin, getOrderByUserId);
// router.get('/get-allorders', authMiddleware, isAdmin, getAllOrders);
// router.put('/order/update-order/:id', authMiddleware, isAdmin, updateOrderStatus);
router.get('/get-myOrders', authMiddleware, getMyOrders);

router.get('/all-users',getallUser);
router.get('/refresh',handleRefreshToken);
router.get("/logout", logout);
router.get('/wishlist',authMiddleware, getWishlist);
router.get('/:id',authMiddleware, isAdmin, getOneUser);
router.delete('/:id',deleteOneUser);
// router.put('/:id',updateOneUser);
router.put('/edit-user', authMiddleware, updateOneUser);
router.put('/save-address', authMiddleware, saveAddress);
router.put('/block-user/:id',authMiddleware, isAdmin, blockUser);
router.put('/unblock-user/:id',authMiddleware, isAdmin, unblockUser);





// router.post('/register', (req, res) => {
//     createUser
// });

module.exports = router;