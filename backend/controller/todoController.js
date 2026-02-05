// let todos=[];
// let id=1;
const Todo = require("../models/Todo")

exports.getTodo = async (req, res) => {
    try {
        const todos = await Todo.find();
        res.status(200).json(todos)
    } catch (err) {
        res.status(500).send(err)
    }
};

exports.createTodo = async (req, res) => {
    try {
        const { task } = req.body;
        if (task === undefined)
            return res.status(401).json({ message: "Task not found" })
        const todos = await Todo.create({
            task,
            completed: false
        })
        res.status(200).json(todos)
    }
    catch (err) {
        res.status(500).send(err);
    }
    // todos.push(newTodo)
    // res.json(newTodo)
};

{/*exports.updateTodo = (req, res) => {
    const todo = todos.find((t) => t.id === req.parseInt(req.params.id))
    if (!todo) {
        res.json({ message: "Todo not found" })
    }
    todo.task = res.body.task || todo.task;
    todo.Completed = req.body.Completed === undefined ? todo.Completed : req.body.Completed;
    res.json(todo)
};*/}
exports.updateTodo=async(req,res)=>{
    try{
     const todo=await Todo.findById(req.params.id)
     if(!todo){
        res.status(401).json({message:"Todo not found"})
     }
     todo.task = req.body.task || todo.task;
     todo.completed = req.body.completed===undefined?todo.completed:req.body.completed;
     await todo.save();
     res.status(200).json(todo)
    
    } catch (err) {
        res.status(500).send(err);
}
}

{/*exports.deleteTodo = (req, res) => {
    const index = todos.findIndex((t) => t.id === parseInt(req.params.id))
    if (index === -1)
        return res.status(404).json({ message: "Todo not found" })
    todos = todos.filter((_, i) => i !== index);
    res.status(200).json({ message: "Task Delete Sucessfully" })
};*/}
exports.deleteTodo = async (req, res) => {
    try {
        const todo = await Todo.findByIdAndDelete(req.params.id);
        if (!todo) return res.status(404).json({ message: "Todo not found" });
        res.status(200).json({ message: "Task deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};