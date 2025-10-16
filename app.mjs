import 'dotenv/config'
import express from 'express'
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const app = express()
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(join(__dirname, 'public')));
app.use(express.json());

const uri = process.env.MONGO_URI;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Keep the connection open for our CRUD operations
let db;
async function connectDB() {
  try {
    await client.connect();
    db = client.db("task_manager"); // Database name
    console.log("Connected to MongoDB!");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
  }
}
connectDB();

// JWT Secret (in production, this should be in .env file)
const JWT_SECRET = 'super-secret-key-for-demo-only';

// JWT Middleware - Protect routes that require authentication
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }

    req.user = user; // Add user info to request
    next();
  });
}

// Serve the main application file
app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'public', 'index.html'));
});

// AUTHENTICATION ENDPOINTS
// Register new user
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Simple validation
    if (!username || !password || password.length < 6) {
      return res.status(400).json({ error: 'Username and a password of at least 6 characters are required' });
    }

    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const result = await db.collection('users').insertOne({ username, password: hashedPassword, createdAt: new Date() });
    res.status(201).json({ message: 'User registered successfully', userId: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// Login user
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    /* DESTRUCTURING. 
    The syntax { username, password } = req.body means:
    Pull out the properties named username and password directly into variables with the same names.
    */

    // Simple validation
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Find user
    const user = await db.collection('users').findOne({ username });
    if (!user) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    // Create JWT token
    const token = jwt.sign({ userId: user._id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ message: 'Login successful', token: token, user: { id: user._id, username: user.username } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to login' });
  }
});

// TASK CRUD ENDPOINTS
// CREATE - Add a new task (PROTECTED)
app.post('/api/tasks', authenticateToken, async (req, res) => {
  try {
    const { description } = req.body;
    if (!description) {
      return res.status(400).json({ error: 'Task description is required' });
    }
    const task = {
      description,
      isCompleted: false,
      createdBy: req.user.username, 
      createdAt: new Date()
    };
    const result = await db.collection('tasks').insertOne(task);
    res.status(201).json({ message: 'Task created successfully', taskId: result.insertedId, task: { ...task, _id: result.insertedId } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// READ - Get all tasks for the logged-in user (PROTECTED)
app.get('/api/tasks', authenticateToken, async (req, res) => {
  try {
    const tasks = await db.collection('tasks').find({ createdBy: req.user.username }).toArray();
    res.json(tasks); 
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// UPDATE - Update a task by ID (PROTECTED)
app.put('/api/tasks/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid task ID' });
    }
    const result = await db.collection('tasks').updateOne(
      { _id: new ObjectId(id), createdBy: req.user.username },
      { $set: { isCompleted: req.body.isCompleted, updatedAt: new Date() } }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Task not found or permission denied' });
    }
    res.json({ message: 'Task updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// DELETE - Delete a task by ID (PROTECTED)
app.delete('/api/tasks/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid task ID' });
    }
    const result = await db.collection('tasks').deleteOne({ _id: new ObjectId(id), createdBy: req.user.username });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Task not found or permission denied' });
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})
