let todos=[];
let id=1;


exports.getTodo=(req,res)=>{
    res.status(200).json(todos)
};
exports.createTodo=(req,res)=>{
    const {task}=req.body;
    const newTodo={
        id:id++,
        task,
        Completed:false
    }
    todos.push(newTodo)
    res.json(newTodo)
};
exports.updateTodo=(req,res)=>{
    res.json(todo)
};
exports.deleteTodo=(req,res)=>{
    const index=todos.findIndex((t)=>t.id===parseInt(req.params.id))
    if(index===-1)
        return res.status(404).json({message:"todo not found"})
    todos=todos.filter((_,i)=>i!==index);
    res.status(204).json({message:"Task deleted successfully"})
};