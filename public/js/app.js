// app.document.addEventListener('DOMContentLoaded', () => {
// Elements
const authSection = document.getElementById('auth-section');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');

const taskSection = document.getElementById('task-section');
const taskList = document.getElementById('task-list');
const logoutBtn = document.getElementById('logout-btn');
const totalTasksEl = document.getElementById('total-tasks');
const completedTasksEl = document.getElementById('completed-tasks');
const pendingTasksEl = document.getElementById('pending-tasks');
const upcomingListEl = document.getElementById('upcoming-list');

const errorMessage = document.getElementById('error-message');

// Sidebar toggle
const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('toggle-btn');
toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    document.body.classList.toggle('sidebar-collapsed');
});

// Show error messages
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    setTimeout(() => { errorMessage.style.display = 'none'; }, 4000);
}

// Get auth headers for API
function getAuthHeaders() {
    const token = localStorage.getItem('token');
    if (!token) return null;
    return { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
}

// Fetch tasks from API
async function fetchTasks() {
    const headers = getAuthHeaders();
    if (!headers) return;

    try {
        const response = await fetch('/api/tasks', { headers });
        if (!response.ok) {
            if (response.status === 401 || response.status === 403) logout();
            throw new Error('Could not fetch tasks.');
        }

        const tasks = await response.json();
        renderTasks(tasks);
        updateDashboard(tasks);
    } catch (error) {
        showError(error.message);
    }
}

// Render task list
function renderTasks(tasks) {
    taskList.innerHTML = '';
    upcomingListEl.innerHTML = '';

    if (!tasks.length) {
        taskList.innerHTML = '<li class="list-group-item text-muted">No tasks yet.</li>';
        upcomingListEl.innerHTML = '<li class="text-muted">No upcoming tasks</li>';
        return;
    }

    // Sort tasks by due date ascending
    tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.dataset.id = task._id;
        li.innerHTML = `
                <span class="${task.isCompleted ? 'completed' : ''}">${task.description} - Due: ${task.dueDate || 'No Date'}</span>
                <div>
                    <button class="btn btn-sm btn-outline-success toggle-btn">${task.isCompleted ? 'Undo' : 'Complete'}</button>
                    <button class="btn btn-sm btn-outline-danger delete-btn">Delete</button>
                </div>
            `;
        taskList.appendChild(li);

        if (!task.isCompleted) {
            const upLi = document.createElement('li');
            upLi.textContent = `${task.description} - Due: ${task.dueDate || 'No Date'}`;
            upcomingListEl.appendChild(upLi);
        }
    });

    if (upcomingListEl.innerHTML === '') {
        upcomingListEl.innerHTML = '<li class="text-muted">No upcoming tasks</li>';
    }
}

// Update dashboard counts
function updateDashboard(tasks) {
    const total = tasks.length;
    const completed = tasks.filter(t => t.isCompleted).length;
    const pending = total - completed;

    totalTasksEl.textContent = total;
    completedTasksEl.textContent = completed;
    pendingTasksEl.textContent = pending;
}

// Handle task list button clicks
taskList.addEventListener('click', async (e) => {
    const target = e.target;
    const li = target.closest('li');
    if (!li) return;
    const id = li.dataset.id;
    const headers = getAuthHeaders();

    if (target.classList.contains('delete-btn')) {
        try {
            const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE', headers });
            if (!res.ok) throw new Error('Failed to delete task.');
            fetchTasks();
        } catch (err) { showError(err.message); }
    }

    if (target.classList.contains('toggle-btn')) {
        const isCompleted = !li.querySelector('span').classList.contains('completed');
        try {
            const res = await fetch(`/api/tasks/${id}`, {
                method: 'PUT',
                headers,
                body: JSON.stringify({ isCompleted })
            });
            if (!res.ok) throw new Error('Failed to update task.');
            fetchTasks();
        } catch (err) { showError(err.message); }
    }
});

// Register user
registerBtn.addEventListener('click', async () => {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    if (!username || !password) return showError('Username and password required.');

    try {
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Registration failed.');
        alert('Registration successful! Please log in.');
    } catch (err) { showError(err.message); }
});

// Login user
loginBtn.addEventListener('click', async () => {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    if (!username || !password) return showError('Username and password required.');

    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Login failed.');

        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.user.username);
        updateUIForAuthState();
    } catch (err) { showError(err.message); }
});

// Logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    updateUIForAuthState();
}
logoutBtn.addEventListener('click', logout);

// Update UI based on auth state
function updateUIForAuthState() {
    const token = localStorage.getItem('token');
    if (token) {
        authSection.style.display = 'none';
        taskSection.style.display = 'block';
        fetchTasks();
    } else {
        authSection.style.display = 'block';
        taskSection.style.display = 'none';
        taskList.innerHTML = '';
        upcomingListEl.innerHTML = '<li class="text-muted">No upcoming tasks</li>';
    }
}

// Initial check
updateUIForAuthState();
});
