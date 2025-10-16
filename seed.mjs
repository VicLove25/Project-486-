import 'dotenv/config'
import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = process.env.MONGO_URI;

// Create a MongoClient
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Sample task data
const sampleTasks = [
  { description: "Finish project proposal", isCompleted: false },
  { description: "Buy groceries", isCompleted: false },
  { description: "Call the bank", isCompleted: true },
  { description: "Schedule dentist appointment", isCompleted: false },
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await client.connect();
    console.log("Connected to MongoDB Atlas!");

    const db = client.db("task_manager");
    const collection = db.collection("tasks");

    await collection.deleteMany({}); // Clear old tasks first
    const result = await collection.insertMany(sampleTasks);
    console.log(`✅ Successfully seeded ${result.insertedCount} tasks!`);
    
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    // Close the connection
    await client.close();
    console.log("\n🔌 Database connection closed");
  }
}

// Run the seed function
seedDatabase().catch(console.dir);
