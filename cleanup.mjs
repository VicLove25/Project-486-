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

async function cleanupDatabase() {
  try {
    // Connect to MongoDB
    await client.connect();
    console.log("Connected to MongoDB Atlas!");

    const db = client.db("task_manager");
    const collection = db.collection("tasks");

    const result = await collection.deleteMany({});
    console.log(`🗑️  Successfully deleted ${result.deletedCount} tasks!`);

  } catch (error) {
    console.error("❌ Error cleaning up database:", error);
  } finally {
    // Close the connection
    await client.close();
    console.log("\n🔌 Database connection closed");
  }
}

// Run the cleanup function
cleanupDatabase().catch(console.dir);
