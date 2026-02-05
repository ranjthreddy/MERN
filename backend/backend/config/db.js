const mongoose=require("mongoose")

const connectDB=async()=>{
    try{
        await mongoose.connect("mongodb://localhost:27017/myDB");//process.env.MONGO_URL
        console.log("MongoDb connected successfully");
    }catch(err){
        console.log(err);
        
    }
}
module.exports=connectDB;