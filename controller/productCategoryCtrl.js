const Category = require('../models/productCategoryModel');
const asyncHandler = require('express-async-handler');
const validateMongoDbId = require('../utils/validateMongoDbId');

//create product category
const createCategory = asyncHandler(async(req, res)=>{
    try{
        const newCategory = await Category.create(req.body);
        res.json(newCategory);
    }catch(error){
        throw new Error(error);
    }
});


//update product category
const updateCategory = asyncHandler(async(req, res)=>{
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const updateCategory = await Category.findByIdAndUpdate(id, req.body,{
            new : true,
        });
        res.json(updateCategory);
    }catch(error){
        throw new Error(error);
    }
});


//delete product category
const deleteCategory = asyncHandler(async(req, res)=>{
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const deleteCategory = await Category.findByIdAndDelete(id);
        res.json(deleteCategory);
    }catch(error){
        throw new Error(error);
    }
});

//get a product category
const getCategory = asyncHandler(async(req, res)=>{
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const getCategory = await Category.findById(id);
        res.json(getCategory);
    }catch(error){
        throw new Error(error);
    }
});


//get all product category
const getAllCategory = asyncHandler(async(req, res)=>{
    try{
        const getAllCategory = await Category.find();
        res.json(getAllCategory);
    }catch(error){
        throw new Error(error);
    }
});



module.exports = {
    createCategory,
    updateCategory,
    deleteCategory,
    getCategory,
    getAllCategory
};