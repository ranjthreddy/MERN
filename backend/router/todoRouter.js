const express = require("express");
const { getTodo,createTodo,updateTodo,deleteTodo } = require("../controller/todoController");

const todoRoute = express.Router();

todoRoute.get("/",getTodo);
todoRoute.post("/create",createTodo);
todoRoute.put("/update/:id", updateTodo);
todoRoute.delete("/delete/:id", deleteTodo);

module.exports = todoRoute