import 'dotenv/config'
import express from 'express'
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { connectDB, getDB, closeDB } from './db.js';
import Task from './model/Task.js';
import User from './model/User.js';

const app = express()
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(join(__dirname, 'public')));
app.use(express.json());

// Retrieve MongoDB connection URI and JWT Secret
const uri = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;


// Create and keep the connection open for our CRUD operations
const db = await connectDB();


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
        const existingUser = await User.findByUsername(username);
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user instance and save
        const newUser = new User(username, hashedPassword);
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully', userId: newUser._id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to register user' });
    }
});


// Login user
app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        // Use the model to find the user
        const user = await User.findByUsername(username);
        if (!user) return res.status(400).json({ error: 'Invalid username or password' });

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.Password);
        if (!isValidPassword) return res.status(400).json({ error: 'Invalid username or password' });

        // Create JWT token
        const token = jwt.sign({ userId: user._id, username: user.Username }, JWT_SECRET, { expiresIn: '24h' });

        res.json({
            message: 'Login successful',
            token,
            user: { id: user._id, username: user.Username }
        });
    } catch (error) {
        console.error(error);
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

        // Create a new Task instance
        const task = new Task(new Date(), description);
        task.createdBy = req.user.username;
        task.isCompleted = false;

        // Save using the model method
        await task.save();

        res.status(201).json({
            message: 'Task created successfully',
            taskId: task._id,
            task: task
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create task' });
    }
});

// READ - Get all tasks for the logged-in user (PROTECTED)
app.get('/api/tasks', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const userTasks = await user.getAllTasks(); // fetch tasks only from user's TaskLists
        res.json(userTasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});


// DELETE - Delete a task by ID (PROTECTED)
app.delete('/api/tasks/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findById(id);

        if (!task || task.createdBy !== req.user.username) {
            return res.status(404).json({ error: 'Task not found or permission denied' });
        }

        await Task.deleteById(id);
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete task' });
    }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})
