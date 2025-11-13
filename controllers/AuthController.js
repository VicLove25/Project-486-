// authController.js
import bcrypt from 'bcrypt';
import User from './User.js';
import { connectDB, getDB } from './db.js';

const SALT_ROUNDS = 10;

export async function accRegister(uName, secret, fName, lName) {
    try {
        const db = await connectDB();
        const collection = db.collection("Users");

        // Check if username exists
        const existingUser = await collection.findOne({ Username: uName });
        if (existingUser) {
            console.error("Account with that username already exists");
            return null;
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(secret, SALT_ROUNDS);

        const newUser = new User(uName, hashedPassword, fName, lName);
        await newUser.save(); // Save the new user to the database

        console.log(`Successfully created user profile for ${uName}!`);
        return newUser;

    } catch (error) {
        console.error("Error registering user:", error);
    }
}

export async function authLogin(userName, secret) {
    try {
        const db = await connectDB();
        const collection = db.collection("Users");

        // Find the user by username
        const user = await collection.findOne({ Username: userName });
        if (!user) {
            console.error("Invalid username or password");
            return null;
        }

        // Compare hashed password
        const isValid = await bcrypt.compare(secret, user.Password);
        if (!isValid) {
            console.error("Invalid username or password");
            return null;
        }

        console.log("Successfully authenticated user!");
        return user;

    } catch (error) {
        console.error("Error logging in:", error);
    }
}
