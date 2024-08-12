const Brand = require('../models/brandModel');
const asyncHandler = require('express-async-handler');
const validateMongoDbId = require('../utils/validateMongoDbId');

//create product category
const createBrand = asyncHandler(async(req, res)=>{
    try{
        const newBrand = await Brand.create(req.body);
        res.json(newBrand);
    }catch(error){
        throw new Error(error);
    }
});

//update product category
const updateBrand = asyncHandler(async(req, res)=>{
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const updateBrand = await Brand.findByIdAndUpdate(id, req.body,{
            new : true,
        });
        res.json(updateBrand);
    }catch(error){
        throw new Error(error);
    }
});


//delete product category
const deleteBrand = asyncHandler(async(req, res)=>{
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const deleteBrand = await Brand.findByIdAndDelete(id);
        res.json(deleteBrand);
    }catch(error){
        throw new Error(error);
    }
});

//get a product category
const getBrand = asyncHandler(async(req, res)=>{
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const getBrand = await Brand.findById(id);
        res.json(getBrand);
    }catch(error){
        throw new Error(error);
    }
});


//get all product category
const getAllBrand = asyncHandler(async(req, res)=>{
    try{
        const getAllBrand = await Brand.find();
        res.json(getAllBrand);
    }catch(error){
        throw new Error(error);
    }
});



module.exports = {
    createBrand,
    updateBrand,
    deleteBrand,
    getBrand,
    getAllBrand
};