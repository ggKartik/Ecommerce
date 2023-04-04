const mongoose=require("mongoose");
mongoose.set('strictQuery', false);
const connectDB=( )=>{
    mongoose.connect(process.env.DB_URL,{useNewUrlParser: true}).then(
        (data)=>{
            console.log(`mongoDB is connected with server: ${data.connection.host}`);
        }).catch((err)=>{
        console.log(err);
    });
};

module.exports=connectDB;