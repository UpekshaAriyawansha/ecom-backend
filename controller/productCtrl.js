const Product = require('../models/productModel');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
const validateMongoDbId = require('../utils/validateMongoDbId');
const fs = require("fs");


//create product
const createProduct = asyncHandler(async(req,res)=>{
    try{
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
          }
        const newProduct = await Product.create(req.body);
            res.json(newProduct);
            // res.json({
            //     // message:'this product backend',
            // });   
    }catch(error){
        throw new Error(error);
    }
}); 

//get one product
const getOneProduct = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    validateMongoDbId(_id);
    try{
        const findProduct = await Product.findById(id).populate("color");
        res.json(findProduct);
    }catch(error){
        throw new Error(error);
    }
});

//get all products
const getAllProducts = asyncHandler(async(req,res)=>{
    // console.log(req.query);

   // filtering products
    try{
        const queryObj ={...req.query};
        const excludeFields = ['page', 'sort', 'limit', 'fields'];
        excludeFields.forEach((el)=> delete queryObj[el]);
        // console.log(queryObj);
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match)=> `$${match}`);
        // console.log(JSON.parse(queryStr));
        // console.log(queryObj, req.query);
        // const getallProducts = await Product.where('category').equals(
        //     req.query.category
        // );
        let query = Product.find(JSON.parse(queryStr));
        

        //sorting products
        if(req.query.sort){
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        }else{
            query = query.sort('-createdAt');
        }

        // limit the fields
        if(req.query.fields){
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields);
        }else{
            query = query.select('-__v')
        }

        //pagination
        const page =req.query.page;
        const limit = req.query.limit;
        const skip =(page-1)*limit;
        query=query.skip(skip).limit(limit);
        if(req.query.page){
            const productCount = await Product.countDocuments();
            if(skip >= productCount) throw new Error('This page does not exists');
        }
        // console.log(page,limit,skip);
        
        const product = await query;
        // const getallProducts = await Product.find(queryObj);
        res.json(product);
    }catch(error){
        throw new Error(error);
    }
});


//update product
const updateProduct = asyncHandler(async(req,res)=>{
    // const id = req.params;
    const id = req.params.id;
    try{
        if(req.body.title){
            req.body.slug = slugify(req.body.title);
        }
        const updateproduct = await Product.findOneAndUpdate({ _id: id } ,req.body,{
            new:true,
        });
        res.json(updateproduct);
    }catch(error){
        throw new Error(error);
    }
});


//delete product
const deleteProduct = asyncHandler(async(req,res)=>{
    // const id = req.params;
    const id = req.params.id;
    try{
        const deleteproduct = await Product.findByIdAndDelete(id);
        res.json(deleteproduct);
    }catch(error){
        throw new Error(error);
    }
});

//add to wish list product  
const addToWishList = asyncHandler(async(req,res)=>{
    const {_id} = req.user;
    const {productId} = req.body;
    try{
        const user = await User.findById(_id);
        const alreadyAdded = user.wishlist.find((id) => id.toString() === productId);
        if(alreadyAdded){
            let user = await User.findByIdAndUpdate(
                _id,
                {
                    $pull:{wishlist:productId}, 
                },
                {
                    new: true,
                }
            );
            res.json(user);
        }else{
            let user = await User.findByIdAndUpdate(
                _id,
                {
                    $push:{wishlist:productId}, 
                },
                {
                    new: true,
                }
            );
            res.json(user);
        }
    }catch(error){
        throw new Error(error);
    }
});

// rating product
const rating = asyncHandler(async(req,res)=>{
    const {_id} = req.user;
    const {star, productId, comment} = req.body;
    try{
        const product = await Product.findById(productId);
        let alreadyRated = product.ratings.find(
            (userId) => userId.postedby.toString() === _id.toString()
        );
        if(alreadyRated){
            const updateRating = await Product.updateOne(
                {
                    ratings:{$elemMatch:alreadyRated},
                },
                {
                    $set:{'ratings.$.star':star,'ratings.$.comment':comment},
                },
                {
                    new:true,
                }
            );
        }else{
            const rateProduct = await Product.findByIdAndUpdate(
                productId,
                {
                    $push:{
                        ratings:{
                            star:star,
                            comment:comment,
                            postedby:_id,
                        },
                    },
                },
                {
                    new:true,
                }
            );
            // res.json(rateProduct);
        }
        const getallratings = await Product.findById(productId);
        let totalRating = getallratings.ratings.length;
        let ratingsum = getallratings.ratings
            .map((item)=>item.star)
            .reduce((prev, curr) => prev + curr, 0);
            let actualRating = Math.round(ratingsum/totalRating);
            let finalproduct = await Product.findByIdAndUpdate(
                productId,
                {
                    totalrating:actualRating,
                },
                {
                    new:true
                }
            );
            res.json(finalproduct);
    }catch(error){
        throw new Error(error);
    }

});

// const uploadImages = asyncHandler(async(req, res)=>{
//     // console.log(req.files);
//     const {id} = req.params;
//     validateMongoDbId(id);
//     try {
//         const uploader = (path)=> cloudinaryUploadImg(path,'images');
//         const urls = [];
//         const files = req.files;
//         for(const file of files){
//             const {path} = file;
//             const newpath = await uploader(path);
//             console.log('path' + newpath);
//             urls.push(newpath);
//             fs.unlink(path);
//             // fs.unlinkSync(path);
//         }
//         // const findProduct = await Product.findByIdAndUpdate(id,
//         //     {
//         //         images:urls.map((file)=>{
//         //             return file;
//         //         }),
//         //     },
//         //     {
//         //         new:true,
//         //     }
//         // );
//         // console.log(findProduct);
//         // res.json(findProduct);
        
//        const images = urls.map((file)=>{
//             return file;
//         });
//         res.json(images);


//     }catch(error){
//         throw new Error(error);
//     }

// });


        
module.exports = {
    createProduct,
    getOneProduct,
    getAllProducts,
    updateProduct,
    deleteProduct,
    addToWishList,
    rating,
};