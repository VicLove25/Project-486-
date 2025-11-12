// authController.js
import User from './User.js';
import { connectDB, closeDB, getDB } from './db.js';

async function accRegister(uName, secret, fName, lName) {
    try {
        const db = await connectDB();
        const collection = db.collection("Users");

        const existingUser = await collection.findOne({ Username: uName });
        if (existingUser) {
            console.error("Account with that username already exists");
            return null;
        }

        const newUser = new User(uName, secret, fName, lName);
        await newUser.save(); // Save the new user to the database
        console.log(`Successfully created user profile for ${uName}!`);
        return newUser;

    } catch (error) {
        console.error("Error registering user:", error);
    } finally {
        await closeDB();
    }
}

async function authLogin(userName, secret) {
    try {
        const db = await connectDB();
        const collection = db.collection("Users");

        const user = await collection.findOne({ Username: userName });
        if (user && user.Password === secret) {
            console.log("Successfully authenticated user!");
            return user;
        }

        console.error("Invalid username or password");
        return null;

    } catch (error) {
        console.error("Error logging in:", error);
    } finally {
        await closeDB();
    }
}

export { accRegister, authLogin };
