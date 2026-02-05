const express=require("express");
const {getUser,getUserById,createUser,editUser,deleteUser}
const userRoute=express.Router();
userRoute.get("/",getUser);
userRoute.get("/:id",getUserById);
userRoute.post("/create",createUser);
userRoute.put("/update/:id",editUser);
userRoute.delete("/delete",deleteUser);
module.exports=userRoute;