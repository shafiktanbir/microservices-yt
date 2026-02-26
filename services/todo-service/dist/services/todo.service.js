"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTodo = void 0;
const todo_model_1 = require("../models/todo.model");
const rabbitmq_1 = require("../config/rabbitmq");
// Create a new todo
const createTodo = async (userId, todoData) => {
    try {
        const todo = new todo_model_1.Todo({
            ...todoData,
            userId,
        });
        await todo.save();
        const event = {
            todoId: todo._id.toString(),
            userId: todo.userId,
            title: todo.title,
            description: todo.description,
            dueDate: todo.dueDate,
            priority: todo.priority,
        };
        await (0, rabbitmq_1.publishToQueue)("todo_created", event);
        return todo;
    }
    catch (error) {
        throw error;
    }
};
exports.createTodo = createTodo;
//# sourceMappingURL=todo.service.js.map