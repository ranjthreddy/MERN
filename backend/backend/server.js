const express=require("express")
const todoRoute=require("./router/todoRouter")
const dotenv=require("dotenv")
const connectDB=require("./config/db")
dotenv.config();
const app=express();
connectDB();

app.use(express.json());
app.use("/api/todo",todoRoute);
app.use("/api/user",userRoute);
const PORT=process.env.PORT;
// app.get("/",(req,res)=>{
//     res.send("Get route is working")
// })
// app.post("/",(req,res)=>{
//     res.json({
//         message:"Post Route is working"
//     })
// })
// app.put("/",(req,res)=>{
//     res.status(200).json({
//         message:"put Route is Working"
//     })
// })
// app.delete("/",(req,res)=>{
//     res.status(200).json({
//         message:"Delete Route is working"
//     })
// })
app.listen(PORT,()=>{
    console.log(`server running on port http://localhost:${PORT}`);
    
})