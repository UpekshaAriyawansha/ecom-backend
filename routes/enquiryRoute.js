const express = require('express');
const router = express.Router();
const {authMiddleware, isAdmin} = require('../middlewares/authMiddleware');
const {
    createEnquiry,
    updateEnquiry,
    deleteEnquiry,
    getEnquiry,
    getAllEnquiry
} = require('../controller/enquiryCtrl');


router.post('/', createEnquiry);
router.put('/:id', authMiddleware, isAdmin, updateEnquiry);
router.delete('/:id', authMiddleware, isAdmin, deleteEnquiry);
router.get('/:id', getEnquiry);
router.get('/', getAllEnquiry);



module.exports = router;