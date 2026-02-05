let users=[]
let id=1;

exports.createUser=(req,res)=>{
    const {name,email}=req.body;
    const newUser={
        id=id++,
        name,
        email
    }
    users.push(newUser);
    res.status(200).json(newUser);
}
exports.getUser=(req,res)=>{

    res.status(200).json(newUser)
}
exports.getUserById=(req,res)=>{
    res.status(200).json(users);
}
exports.editUser=(req,res)=>{}
exports.deleteUser=(req,res)=>{}