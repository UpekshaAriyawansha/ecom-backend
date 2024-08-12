const Blog = require('../models/blogModel');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const {cloudinaryUploadImg} = require('../utils/cloudinary');
const validateMongoDbId = require('../utils/validateMongoDbId');
const fs = require("fs");


//create blog
const createBlog = asyncHandler(async(req,res)=>{
    try{
        const newBlog = await Blog.create(req.body);
        // res.json({
        //     status: 'success',
        //     newBlog,
        // });
        res.json(newBlog);
    }catch(error){
        throw new Error(error);
    }
});


//update blog
const updateBlog = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const updateBlog = await Blog.findByIdAndUpdate(id, req.body,{
            new: true,
        });
        res.json(updateBlog);
    }catch(error){
        throw new Error(error);
    }
});


//get blog
const getBlog = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const getBlog = await Blog.findById(id)
        .populate('likes')
        .populate('dislikes');
        const updateViwes = await Blog.findByIdAndUpdate(id,
            {
                $inc:{numViews: 1},
            },
            {new: true}
            );
        res.json(getBlog);
    }catch(error){
        throw new Error(error);
    }
});


//get all blogs
const getAllBlog = asyncHandler(async (req, res) => {
    try {
      const getAllBlog = await Blog.find();
      res.json(getAllBlog);
    } catch (error) {
      throw new Error(error);
    }
  });


  //delete blog
const deleteBlog = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const deleteBlog = await Blog.findByIdAndDelete(id);
        res.json(deleteBlog);
    }catch(error){
        throw new Error(error);
    }
});


//like blog
const likeBlog = asyncHandler(async (req,res)=>{
    const {blogId}=req.body;
    // console.log(blogId,req.body);
    validateMongoDbId(blogId);
    //find blog
    const blog = await Blog.findById(blogId);
    // find user loging or not
    const loginUserId = req?.user?._id;
    //find user like?
    const isLiked = blog?.isLiked;
    //find user dislike?
    const alreadyDisliked = blog?.dislikes?.find(
        (userId) => userId?.toString() === loginUserId?.toString() 
    );
    if(alreadyDisliked){
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $pull : {dislikes: loginUserId},
                isDisliked:false,
            },
            {new:true}
        );
        res.json(blog);
    }
    if(isLiked){
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $pull : {likes: loginUserId},
                isLiked:false, 
            },
            {new:true}
            );
            res.json(blog);
    } else{
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $push : {likes: loginUserId},
                isLiked:true,
            },
            {new:true}
            );
            res.json(blog);
    }
});



//dislike blog
const disLikeBlog = asyncHandler(async (req,res)=>{
    const {blogId}=req.body;
    // console.log(blogId,req.body);
    validateMongoDbId(blogId);
    //find blog
    const blog = await Blog.findById(blogId);
    // find user loging or not
    const loginUserId = req?.user?._id;
    //find user like?
    const isDisLiked = blog?.isDisLiked;
    //find user dislike?
    const alreadyLiked = blog?.likes?.find(
        (userId) => userId?.toString() === loginUserId?.toString() 
    );
    if(alreadyLiked){
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $pull : {likes: loginUserId},
                isLiked:false,
            },
            {new:true}
        );
        res.json(blog);
    }
    if(isDisLiked){
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $pull : {dislikes: loginUserId},
                isDisLiked:false, 
            },
            {new:true}
            );
            res.json(blog);
    } else{
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $push : {dislikes: loginUserId},
                isDisliked:true,
            },
            {new:true}
            );
            res.json(blog);
    }
});

const uploadImages = asyncHandler(async(req, res)=>{
    // console.log(req.files);
    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const uploader = (path)=> cloudinaryUploadImg(path,'images');
        const urls = [];
        const files = req.files;
        for(const file of files){
            const {path} = file;
            const newpath = await uploader(path);
            console.log('path' + newpath);
            urls.push(newpath);
            fs.unlink(path);
            // fs.unlinkSync(path);
        }
        const findBlog = await Blog.findByIdAndUpdate(id,
            {
                images:urls.map((file)=>{
                    return file;
                }),
            },
            {
                new:true,
            }
        );
        console.log(findBlog);
        res.json(findBlog);

    }catch(error){
        throw new Error(error);
    }

});

module.exports ={
    createBlog,
    updateBlog,
    getBlog,
    getAllBlog,
    deleteBlog,
    likeBlog,
    disLikeBlog,
    uploadImages

};