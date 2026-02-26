"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeRabbitMQ = exports.connectRabbitMQ = exports.publishToQueue = void 0;
const src_1 = __importDefault(require("@tanuj_malode/common/src"));
const rabbitMQ = new src_1.default({
    serviceName: "Todo Service",
    queues: ["todo_created"],
});
const publishToQueue = async (queue, message) => {
    await rabbitMQ.publishToQueue(queue, message);
};
exports.publishToQueue = publishToQueue;
const connectRabbitMQ = async () => rabbitMQ.connect();
exports.connectRabbitMQ = connectRabbitMQ;
const closeRabbitMQ = async () => rabbitMQ.close();
exports.closeRabbitMQ = closeRabbitMQ;
//# sourceMappingURL=rabbitmq.js.map