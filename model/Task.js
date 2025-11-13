import { getDB } from "../db.js";
import { ObjectId } from "mongodb";

export default class Task {
    constructor(date, event) {
        this.Date = date;
        this.Event = event;
        this.isCompleted = false;
    }

    // Access collection dynamically
    static get collection() {
        return getDB().collection("Tasks");
    }

    async save() {
        const result = await Task.collection.insertOne(this);
        this._id = result.insertedId;
        return result;
    }

    static async getAll() {
        return await Task.collection.find().toArray();
    }

    static async findById(id) {
        return await Task.collection.findOne({ _id: new ObjectId(id) });
    }

    static async deleteById(id) {
        return await Task.collection.deleteOne({ _id: new ObjectId(id) });
    }
}
