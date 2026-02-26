"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const todo_service_1 = require("../services/todo.service");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// All routes require authentication
router.use(auth_middleware_1.authenticateToken);
// Create a new todo
router.post("/", async (req, res) => {
    try {
        const { title, description, dueDate, priority } = req.body;
        if (!title) {
            res.status(400).json({ error: "Title is required" });
            return;
        }
        const todo = await (0, todo_service_1.createTodo)(req.userId, {
            title,
            description,
            dueDate: dueDate ? new Date(dueDate) : undefined,
            priority,
        });
        res.status(201).json(todo);
    }
    catch (error) {
        const err = error;
        res.status(500).json({ error: err.message });
    }
});
exports.default = router;
//# sourceMappingURL=todo.routes.js.map