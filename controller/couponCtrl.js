const Coupon = require('../models/couponModel');
const asyncHandler = require('express-async-handler');
const validateMongoDbId = require('../utils/validateMongoDbId');

//create Coupon
const createCoupon = asyncHandler(async(req,res)=>{
try{
    const newCoupon = await Coupon.create(req.body);
    res.json(newCoupon);

}catch(error){
    throw new Error(error);
}
});


//get all Coupon
const getAllCoupon = asyncHandler(async(req,res)=>{
    try{
        const getAllCoupon = await Coupon.find();
        res.json(getAllCoupon);
    
    }catch(error){
        throw new Error(error);
    }
    });


//update Coupon
const updateCoupon = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const updateCoupon = await Coupon.findByIdAndUpdate(id, req.body,{
            new:true,
        });
        res.json(updateCoupon);
    
    }catch(error){
        throw new Error(error);
    }
    });

//delete Coupon
const deleteCoupon = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const deleteCoupon = await Coupon.findByIdAndDelete(id);
        res.json(deleteCoupon);
    
    }catch(error){
        throw new Error(error);
    }
    });


const getCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const getCoupon = await Coupon.findById(id);
        res.json(getCoupon);
    } catch (error) {
        throw new Error(error);
    }
});

module.exports = {
    createCoupon,
    getAllCoupon,
    updateCoupon,
    deleteCoupon,
    getCoupon
};