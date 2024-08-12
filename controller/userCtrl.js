const User = require('../models/userModel');
const Product = require('../models/productModel');
const Cart = require('../models/cartModel');
const Coupon = require('../models/couponModel');
const Order = require('../models/orderModel');
const uniqid = require('uniqid'); 


const asyncHandler = require('express-async-handler');
const { generateToken } = require("../config/jwtToken");
const validateMongoDbId = require('../utils/validateMongoDbId');
const { generateRefreshToken } = require("../config/refreshtoken");
const sendEmail = require('../controller/emailCtrl');
const crypto = require('crypto');
const jwt = require("jsonwebtoken");




//create a user
const createUser = asyncHandler(async (req,res)=>{
    const email = req.body.email;
    const findUser = await User.findOne({email: email});
    if (!findUser){
        //create a new user
        const newUser = await User.create(req.body);
        res.json(newUser);
    }else {
        throw new Error('User already exists');
        // res.json({
        //     msg: 'User already exists',
        //     success:false,
        // });
    }
});

//login a user
const loginUserCtrl = asyncHandler(async (req, res)=>{
    const {email, password} = req.body;
    // console.log(email, password);
    const findUser = await User.findOne({email});
    if (findUser && await findUser.isPasswordMatched(password)){ 
        const refreshToken = await generateRefreshToken(findUser?._id);
        const updateuser = await User.findByIdAndUpdate(
            findUser.id,
            {
                refreshToken: refreshToken,
            },
            {new: true}
        );
        res.cookie('refreshToken', refreshToken,{
            httpOnly: true,
            maxAge:72 * 60 * 60 * 1000,
        });
        res.json({
            _id: findUser?._id,
            firstname: findUser?.firstname,
            lastname: findUser?.lastname,
            email:findUser?.email,
            mobile:findUser?.mobile,
            token: generateToken(findUser?._id),
        });  
    }else{
        throw new Error('Invalid Credentials');
    }
});

//login a admin
const loginAdminCtrl = asyncHandler(async (req, res)=>{
    const {email, password} = req.body;
    // console.log(email, password);
    const findAdmin = await User.findOne({email});
    if(findAdmin.role !== 'admin') throw new Error('Not Authorized');
    if (findAdmin && await findAdmin.isPasswordMatched(password)){ 
        const refreshToken = await generateRefreshToken(findAdmin?._id);
        const updateuser = await User.findByIdAndUpdate(
            findAdmin.id,
            {
                refreshToken: refreshToken,
            },
            {new: true}
        );
        res.cookie('refreshToken', refreshToken,{
            httpOnly: true,
            maxAge:72 * 60 * 60 * 1000,
        });
        res.json({
            _id: findAdmin?._id,
            firstname: findAdmin?.firstname,
            lastname: findAdmin?.lastname,
            email:findAdmin?.email,
            mobile:findAdmin?.mobile,
            token: generateToken(findAdmin?._id),
        });  
    }else{
        throw new Error('Invalid Credentials');
    }
});



//get all users
const getallUser = asyncHandler(async (req, res)=>{
    try{
        const getUsers = await User.find();
        res.json(getUsers);
    }catch(error){
        throw new Error(error);
    }
});

//get one user
const getOneUser = asyncHandler(async (req,res) => {
    // console.log(req.params);
  const {id}=req.params;
  validateMongoDbId(id);
  try{
    const getUser = await User.findById(id);
    res.json(getUser);
}catch(error){
    throw new Error(error);
}
//   console.log(id);
});


// get wishlist
const getWishlist = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    console.log('req.user:', req.user);

    try {
      const findUser = await User.findById(_id).populate("wishlist");
      res.json(findUser);
    } catch (error) {
      throw new Error(error);
    }
  });


//delete user
const deleteOneUser = asyncHandler(async (req,res) => {
    // console.log(req.params);
  const {id}=req.params;
  validateMongoDbId(id);

  try{
    const deleteUser = await User.findByIdAndDelete(id);
    res.json(deleteUser);
}catch(error){
    throw new Error(error);
}
//   console.log(id);
});

//update user
const updateOneUser = asyncHandler(async (req, res) => {
    // const { id } =req.params;
    // console.log(req.params);
    const { _id } = req.user;
    // console.log(req.user);
    validateMongoDbId(_id);
    try {
        const updateUser = await User.findByIdAndUpdate(_id, {
            firstname: req?.body?.firstname,
            lastname: req?.body?.lastname,
            email: req?.body?.email,
            mobile: req?.body?.mobile,
        }, {
            new: true,
        });
        res.json(updateUser);
    } catch (error) {
        throw new Error(error);
    }
});


//save user address
const saveAddress = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);
    try {
        const updateUser = await User.findByIdAndUpdate(_id, {
            address: req?.body?.address,
        }, {
            new: true,
        });
        res.json(updateUser);
    } catch (error) {
        throw new Error(error);
    }
});


// user blocked
const blockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try{
        const block = await User.findByIdAndUpdate(
            id,
            {
                isBlocked:true,
            },
            {
                new: true,
            }
        );
        res.json({
        message:'User Blocked',
         });
    } catch (error) {
        throw new Error(error);
    }
});

// user unblocked
const unblockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try{
        const unblock = await User.findByIdAndUpdate(
            id,
            {
                isBlocked:false,
            },
            {
                new: true,
            }
        );
        res.json({
            message:'User Unblocked',
        });
    } catch (error) {
        throw new Error(error);
    }
});

//handle refresh token
const handleRefreshToken = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    // console.log(cookie);
    if(!cookie?.refreshToken)throw new Error('No Refresh Token is cookies');
    const refreshToken = cookie.refreshToken;
    // console.log(refreshToken);
    const user = await User.findOne({ refreshToken });
    // res.json(user);
    if(!user) throw new Error('No Refresh token present in db or not matched');
    jwt.verify(
        refreshToken,
        process.env.JWT_SECRET,
        (error,decoded)=>{
                // console.log(decoded);
                if(error || user.id !== decoded.id){
                    throw new Error('There is something wrong with refresh token')
                }
                const accessToken = generateToken(user?._id);
                res.json({accessToken});
            });
});

//user logout
const logout = asyncHandler(async (req, res) => {
    // console.log(req.cookies);
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
      });
      return res.sendStatus(204); // forbidden
    }
    await User.findOneAndUpdate({ refreshToken: refreshToken }, {
        refreshToken: "",
      }); 
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    res.sendStatus(204); // forbidden
  });


//update password
const updatePassword = async (req, res) => {
    const {_id} = req.user;
    const {password} = req.body;
    validateMongoDbId(_id);
    const user = await User.findById(_id);
    if(password){
        user.password = password;
        const updatePassword = await user.save();
        res.json(updatePassword)
    }else{
        res.json(user);
    }
};


//forgot password token 
const forgotPasswordToken = asyncHandler(async (req, res) => {
    const {email} = req.body;
    const user = await User.findOne({email});
    if(!user)throw new Error ('User not found with this token');
    try{
        const token = await user.createPasswordResetToken();
        await user.save();
        const resetURL = `Hi, Please follow this link to reset Your Password. This link is valid till 10 minutes from now. <a href='http://localhost:5000/api/user/reset-password/${token}'>Click Here</>`;
        const data ={
            to:email,
            text:'Hello User',
            subject:'Forgot Password Link',
            html: resetURL,
        };
        sendEmail(data);
        res.json(token);
    }catch(error){
        throw new Error(error);
    }
});


//reset password
const resetPassword =asyncHandler(async(req, res)=>{
    const {password} = req.body;
    const {token} = req.params;
    const hanshedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user =await User.findOne({
        passwordResetToken: hanshedToken,
        passwordResetExpires: {$gt :Date.now()},
    });
    if(!user) throw new Error ('Token Expired, Please try again later');
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.json(user);
});

//user cart
const userCart =asyncHandler(async (req, res) => {
    // console.log (req.body);++
    // console.log('req.user:', req.user);
    const { productId, quantity, price, color } = req.body;
    const { _id } = req.user;
    validateMongoDbId(_id);
    try {
      // let products = [];
      // const user = await User.findById(_id);
      // // check already have product in cart
      // const alreadyExistCart = await Cart.findOne({ orderby: user._id });
      // if (alreadyExistCart) {
      //   alreadyExistCart.remove();
      // }
      // for (let i = 0; i < cart.length; i++) {
      //   let object = {};
      //   object.product = cart[i]._id;
      //   object.count = cart[i].count;
      //   object.color = cart[i].color;
      //   let getPrice = await Product.findById(cart[i]._id).select("price").exec();
      //   object.price = getPrice.price;
      //   products.push(object);
      // }
      // let cartTotal = 0;
      // for (let i = 0; i < products.length; i++) {
      //   cartTotal = cartTotal + products[i].price * products[i].count;
      // }

      let newCart = await new Cart({
        userId:_id,
        productId,
        color,
        price,
        quantity,
      }).save();
    //   console.log(products);
    //   console.log(cartTotal);
      res.json(newCart);
    } catch (error) {
      throw new Error(error);
    }
  });

  //get cart
  const getUserCart = asyncHandler(async(req,res,next)=>{
    const {_id} = req.user;
    validateMongoDbId(_id);
    try{
        const cart = await Cart.find({userId: _id}).populate(
            'productId',
            // '_id title price totalAfterDiscount'
            ).populate("color");
        res.json(cart);
    }catch (error) {
        throw new Error(error);
    }
  });

  const removeProductFromCart = asyncHandler(async (req,res)=>{
    const {_id} = req.user;
    // const {cartItemId} = req.body;
    const {cartItemId} = req.params;

    validateMongoDbId(_id);
    try{
        const deleteProductFromCart = await Cart.deleteOne({userId:_id,_id:cartItemId})
        res.json(deleteProductFromCart);
    }catch (error) {
        throw new Error(error);
    }
  });

  const updateProductQuantityFromCart = asyncHandler(async (req,res)=>{
    const {_id} = req.user;
    // const {cartItemId} = req.body;
    const {cartItemId, cartItem} = req.params;

    validateMongoDbId(_id);
    try{
        const cartItem = await Cart.findOne({userId:_id, _id:cartItemId})
        cartItem.quantity = newQuantity
        cartItem.save();
        res.json(cartItem);
    }catch (error) {
        throw new Error(error);
    }
  });

  const createOrder = asyncHandler(async (req,res)=>{
    const {shippingInfo, orderItems, totalPrice, totalPriceAfterDiscount, paymentInfo} = req.body;
    const {_id} = req.user;
    try{
      const order = await Order.create({
        shippingInfo, orderItems, totalPrice, totalPriceAfterDiscount, paymentInfo, user:_id
      })
      res.json({
        order,
        success:true
      })
    }catch (error){
      throw new Error(error)
    }
  });

  const getMyOrders = asyncHandler(async(req,res)=>{
    const {_id} = req.user;
    try{
        const orders = await Order.find({user:_id}).populate('user').populate('orderItems.product').populate('orderItems.color')
        res.json({
            orders
        })

    }catch(error){
        throw new Error(error)
    }
  })


  

module.exports = {
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
    // createOrder,
    // getOrders,
    // getAllOrders,
    // updateOrderStatus,
    // getOrderByUserId,
    removeProductFromCart,
    updateProductQuantityFromCart,
    createOrder,
    getMyOrders,

};



//delete cart
  // const deleteCart = asyncHandler(async (req, res) => {
  //   const { _id } = req.user;
  //   validateMongoDbId(_id);
  //   try {
  //     const user = await User.findOne({ _id });
  //     const cart = await Cart.findOneAndDelete({ orderby: user._id });
  //     res.json(cart);
  //   } catch (error) {
  //     throw new Error(error);
  //   }
  // });

  // //apply coupon
  // const applyCoupon = asyncHandler(async (req, res) =>{
  //   const { _id } = req.user;
  //   validateMongoDbId(_id);
  //   const {coupon} = req.body;
  //   const validCoupon = await Coupon.findOne({name:coupon});
  //   console.log(validCoupon);
  //   if (validCoupon === null) {
  //     throw new Error("Invalid Coupon");
  //   }
  //   const user = await User.findOne({ _id });
  //   let { products, cartTotal } = await Cart.findOne({
  //     orderby: user._id,
  //   }).populate("products.product");
  //   let totalAfterDiscount = (
  //       cartTotal -
  //       (cartTotal * validCoupon.discount) / 100
  //     ).toFixed(2);
  //     await Cart.findOneAndUpdate(
  //       { orderby: user._id },
  //       { totalAfterDiscount },
  //       { new: true }
  //     );
  //     res.json(totalAfterDiscount);
  // });

  // //create order
  // const createOrder = asyncHandler(async (req, res) => {
  //   const { COD, couponApplied } = req.body;
  //   const { _id } = req.user;
  //   validateMongoDbId(_id);
  //   try {
  //     if (!COD) throw new Error("Create cash order failed");
  //     const user = await User.findById(_id);
  //     let userCart = await Cart.findOne({ orderby: user._id });
  //     let finalAmout = 0;
  //     if (couponApplied && userCart.totalAfterDiscount) {
  //       finalAmout = userCart.totalAfterDiscount;
  //     } else {
  //       finalAmout = userCart.cartTotal;
  //     }
  
  //     let newOrder = await new Order({
  //       products: userCart.products,
  //       paymentIntent: {
  //         id: uniqid(),
  //         method: "COD",
  //         amount: finalAmout,
  //         status: "Cash on Delivery",
  //         created: Date.now(),
  //         currency: "usd",
  //       },
  //       orderby: user._id,
  //       orderStatus: "Cash on Delivery",
  //     }).save();
  //     let update = userCart.products.map((item) => {
  //       return {
  //         updateOne: {
  //           filter: { _id: item.product._id },
  //           update: { $inc: { quantity: -item.count, sold: +item.count } },
  //         },
  //       };
  //     });
  //     const updated = await Product.bulkWrite(update, {});
  //     res.json({ message: "success" });
  //     console.log(userCart.products);
  //   } catch (error) {
  //     throw new Error(error);
  //   }
  // });


  // //get orders
  // // const getOrders = asyncHandler(async (req, res) => {
  // //   const { _id } = req.user;
  // //   validateMongoDbId(_id);
  // //   try {
  // //     const userorders = await Order.findOne({ orderby: _id })
  // //       .populate("products.product")
  // //       .populate("orderby")
  // //       .exec();
  // //     res.json(userorders);
  // //   } catch (error) {
  // //     throw new Error(error);
  // //   }
  // // });

  // const getOrders = asyncHandler(async (req, res) => {
  //   const { _id } = req.user;
  //   validateMongoDbId(_id);
  //   try {
  //     const userorders = await Order.findOne({ orderby: _id })
  //       .populate("products.product")
  //       .populate("orderby")
  //       .exec();
  //     res.json(userorders);
  //   } catch (error) {
  //     throw new Error(error);
  //   }
  // });

  // //get all orders
  // const getAllOrders = asyncHandler(async (req, res) => {
  //   try {
  //     const alluserorders = await Order.find()
  //       .populate("products.product")
  //       .populate("orderby")
  //       .exec();
  //     res.json(alluserorders);
  //   } catch (error) {
  //     throw new Error(error);
  //   }
  // });


  // //get order with user id
  // const getOrderByUserId = asyncHandler(async (req, res) => {
  //   const { id } = req.params;
  //   validateMongoDbId(id);
  //   try {
  //     const userorders = await Order.findOne({ orderby: id })
  //       .populate("products.product")
  //       .populate("orderby")
  //       .exec();
  //     res.json(userorders);
  //   } catch (error) {
  //     throw new Error(error);
  //   }
  // });

  // //update order status
  // const updateOrderStatus = asyncHandler(async (req, res) => {
  //   const { status } = req.body;
  //   const { id } = req.params;
  //   validateMongoDbId(id);
  //   try {
  //     const updateOrderStatus = await Order.findByIdAndUpdate(
  //       id,
  //       {
  //         orderStatus: status,
  //         paymentIntent: {
  //         status: status,
  //         },
  //       },
  //       { new: true }
  //     );
  //     res.json(updateOrderStatus);
  //   } catch (error) {
  //     throw new Error(error);
  //   }
  // });