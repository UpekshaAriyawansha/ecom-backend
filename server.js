const bodyParser = require('body-parser');
const express = require('express');
const dbConnect = require('./config/dbConnect');
const app = express();
const dotenv = require('dotenv').config();
const { notFound, errorHandler } = require('./middlewares/errorHandler');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cors = require('cors');
// import cors from 'cors';

const authRouter = require('./routes/authRoute');
const productRouter = require('./routes/productRoute');
const blogRouter = require('./routes/blogRoute');
const productCategoryRouter = require('./routes/productCategoryRoute');
const blogCategoryRouter = require('./routes/blogCategoryRoutes');
const brandRoute = require('./routes/brandRoute');
const couponRoute = require('./routes/couponRoute');
const colorRoute = require('./routes/colorRoute');
const EnquiryRoute = require('./routes/enquiryRoute');
const UploadRoute = require('./routes/uploadRoute');

const PORT = process.env.PORT || 4000;

dbConnect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(morgan('dev'));
app.use(cors());

app.use('/api/user',authRouter);
app.use('/api/product',productRouter);
app.use('/api/blog',blogRouter);
app.use('/api/productCategory',productCategoryRouter);
app.use('/api/blogCategory',blogCategoryRouter);
app.use('/api/brand',brandRoute);
app.use('/api/color',colorRoute);
app.use('/api/coupon',couponRoute);
app.use('/api/enquiry',EnquiryRoute);
app.use('/api/upload',UploadRoute);

app.use(notFound);
app.use(errorHandler);

// app.use('/', (req,res)=>{
//     res.send('Hello from server side');
// });testing
// 

app.listen(PORT,()=>{
    console.log(`Server is running at PORT ${PORT}`);
});

