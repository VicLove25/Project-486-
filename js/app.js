document.addEventListener('DOMContentLoaded', () => {
    const authSection = document.getElementById('auth-section');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');

    const taskSection = document.getElementById('task-section');
    const taskForm = document.getElementById('new-task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const logoutBtn = document.getElementById('logout-btn');
    const userInfo = document.getElementById('user-info');

    const errorMessage = document.getElementById('error-message');

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 4000);
    }
    
    function getAuthHeaders() {
        const token = localStorage.getItem('token');
        if (!token) return null;
        
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    }

    async function fetchTasks() {
        const headers = getAuthHeaders();
        if (!headers) return;

        try {
            const response = await fetch('/api/tasks', { headers });

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                   logout();
                }
                throw new Error('Could not fetch tasks.');
            }

            const tasks = await response.json();
            renderTasks(tasks);
        } catch (error) {
            showError(error.message);
        }
    }

    taskForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const description = taskInput.value.trim();
        if (!description) return;

        const headers = getAuthHeaders();

        try {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({ description })
            });

            if (!response.ok) throw new Error('Failed to add task.');
            
            taskInput.value = '';
            fetchTasks();
        } catch (error) {
            showError(error.message);
        }
    });

    taskList.addEventListener('click', async (e) => {
        const headers = getAuthHeaders();
        const target = e.target;
        const li = target.closest('li');
        if (!li) return;

        const id = li.dataset.id;

        if (target.classList.contains('delete-btn')) {
            try {
                const response = await fetch(`/api/tasks/${id}`, {
                    method: 'DELETE',
                    headers: headers
                });
                if (!response.ok) throw new Error('Failed to delete task.');
                fetchTasks();
            } catch (error) {
                showError(error.message);
            }
        }

        if (target.classList.contains('toggle-btn')) {
            const isCompleted = !li.querySelector('span').classList.contains('completed');
            try {
                const response = await fetch(`/api/tasks/${id}`, {
                    method: 'PUT',
                    headers: headers,
                    body: JSON.stringify({ isCompleted })
                });
                if (!response.ok) throw new Error('Failed to update task.');
                fetchTasks();
            } catch (error) {
                showError(error.message);
            }
        }
    });

    function renderTasks(tasks) {
        taskList.innerHTML = '';
        if (tasks.length === 0) {
            taskList.innerHTML = '<li class="list-group-item text-muted">No tasks yet. Add one above!</li>';
            return;
        }

        tasks.forEach(task => {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            li.dataset.id = task._id;
            li.innerHTML = `
                <span class="${task.isCompleted ? 'completed' : ''}">${task.description}</span>
                <div>
                    <button class="btn btn-sm btn-outline-success toggle-btn">${task.isCompleted ? 'Undo' : 'Complete'}</button>
                    <button class="btn btn-sm btn-outline-danger delete-btn">Delete</button>
                </div>
            `;
            taskList.appendChild(li);
        });
    }

    registerBtn.addEventListener('click', async () => {
        const username = usernameInput.value;
        const password = passwordInput.value;

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error);
            alert('Registration successful! Please log in.');
        } catch (error) {
            showError(error.message);
        }
    });

    loginBtn.addEventListener('click', async () => {
        const username = usernameInput.value;
        const password = passwordInput.value;
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error);
            
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', data.user.username);
            
            updateUIForAuthState();
        } catch (error) {
            showError(error.message);
        }
    });

    function logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        updateUIForAuthState();
    }
    logoutBtn.addEventListener('click', logout);

    function updateUIForAuthState() {
        const token = localStorage.getItem('token');
        if (token) {
            authSection.style.display = 'none';
            taskSection.style.display = 'block';
            userInfo.textContent = `Logged in as: ${localStorage.getItem('username')}`;
            fetchTasks();
        } else {
            authSection.style.display = 'block';
            taskSection.style.display = 'none';
            taskList.innerHTML = '';
        }
    }

    // Initial check when the page loads
    updateUIForAuthState();
});
