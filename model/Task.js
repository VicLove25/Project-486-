import db from "../db.js";

const tasks = db.collection("Tasks");
export default class Task {
    constructor(date, event) {
        this.Date = date;
        this.Event = event;
    }

    // Save this task to MongoDB
    async save() {
        const result = await tasks.insertOne(this);
        this._id = result.insertedId;
        return result;
    }

    // Get all tasks
    static async getAll() {
        return await tasks.find().toArray();
    }

    // Find a task by ID
    static async findById(id) {
        const { ObjectId } = await import("mongodb");
        return await tasks.findOne({ _id: new ObjectId(id) });
    }

    // Delete a task
    static async deleteById(id) {
        const { ObjectId } = await import("mongodb");
        return await tasks.deleteOne({ _id: new ObjectId(id) });
    }
}