"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("./config/database");
const todo_routes_1 = __importDefault(require("./routes/todo.routes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const rabbitmq_1 = require("./config/rabbitmq");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3002;
// Middleware
app.use((0, cors_1.default)());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Routes
app.use("/api/todos", todo_routes_1.default);
// Health check endpoint
app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok", service: "todo-service" });
});
// Graceful shutdown
process.on("SIGINT", async () => {
    console.log("Shutting down Todo Service...");
    await (0, rabbitmq_1.closeRabbitMQ)();
    process.exit(0);
});
// Start server
const startServer = async () => {
    try {
        await (0, database_1.connectDatabase)();
        await (0, rabbitmq_1.connectRabbitMQ)();
        app.listen(PORT, () => {
            console.log(`Todo Service running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error("Failed to start Todo Service:", error);
        process.exit(1);
    }
};
startServer();
//# sourceMappingURL=index.js.map