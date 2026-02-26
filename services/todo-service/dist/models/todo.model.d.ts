import mongoose, { Document } from 'mongoose';
export type TodoDocument = Document & {
    title: string;
    description: string;
    completed: boolean;
    userId: string;
    dueDate?: Date;
    priority: 'low' | 'medium' | 'high';
    createdAt: Date;
    updatedAt: Date;
};
export declare const Todo: mongoose.Model<TodoDocument, {}, {}, {}, mongoose.Document<unknown, {}, TodoDocument, {}, {}> & mongoose.Document<mongoose.Types.ObjectId, any, any, Record<string, any>, {}> & {
    title: string;
    description: string;
    completed: boolean;
    userId: string;
    dueDate?: Date;
    priority: "low" | "medium" | "high";
    createdAt: Date;
    updatedAt: Date;
} & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=todo.model.d.ts.map