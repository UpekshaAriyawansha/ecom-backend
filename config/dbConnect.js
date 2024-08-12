const { default: mongoose } = require('mongoose');

const dbConnect =()=>{
    try{
        const con = mongoose.connect(process.env.MONGODB_URL);
            console.log('Database connection Successfully');
    } catch(error){
        console.log('Database error: ' + error);
        }
    };
    
module.exports = dbConnect;

