import db from "../db.js"; // your MongoDB connection
import { ObjectId } from "mongodb";

const users = db.collection("Users");
const taskLists = db.collection("TaskLists");
const tasks = db.collection("Tasks");

export default class User {
    constructor(username, password, taskLists = []) {
        this.Username = username;
        this.Password = password;
        this.TaskLists = taskLists; // array of TaskList IDs as strings
    }

    // Save a new user to MongoDB
    async save() {
        const result = await users.insertOne(this);
        this._id = result.insertedId; // store MongoDB _id in the instance
        return result;
    }

    // Find a user by ID
    static async findById(id) {
        return await users.findOne({ _id: new ObjectId(id) });
    }


    // Add a TaskList
    async addTaskList(listId) {
        if (!this._id) throw new Error("User _id not set. Cannot add TaskList.");
        if (!this.TaskLists.includes(listId)) this.TaskLists.push(listId);

        await users.updateOne(
            { _id: this._id },
            { $addToSet: { TaskLists: listId } }
        );
    }

    // Fetch all tasks from TaskLists the user is subscribed to
    async getAllTasks() {
        if (!this._id) throw new Error("User _id not set. Cannot fetch tasks.");

        const user = await users.findOne({ _id: new ObjectId(this._id) });
        if (!user) throw new Error("User not found");

        // Fetch all TaskLists the user is subscribed to
        const userTaskLists = await taskLists
            .find({ _id: { $in: user.TaskLists.map(id => new ObjectId(id)) } })
            .toArray();

        // Fetch all tasks for each TaskList
        const allTasks = {};
        for (const list of userTaskLists) {
            const listTasks = await tasks
                .find({ _id: { $in: list.ids.map(id => new ObjectId(id)) } })
                .toArray();
            allTasks[list.Name] = listTasks; // Group tasks by TaskList name
        }

        return allTasks;
    }
}
