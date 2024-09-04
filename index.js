const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

let todos = [];

// Fungsi untuk mencari todo berdasarkan id
const findTodoById = (id) => todos.find(todo => todo.id === id);

// Fungsi untuk membuat todo baru
const createTodo = (description, date) => {
    const newTodo = {
        id: Date.now().toString(),
        description,
        date,
        is_checked: false
    };
    todos.push(newTodo);
    return newTodo;
};

// Fungsi untuk mengupdate todo berdasarkan id
const updateTodo = (id, description, date) => {
    const todo = findTodoById(id);
    if (!todo) {
        return null;
    }

    todo.description = description;
    todo.date = date;

    return todo;
};

// Fungsi untuk menghapus todo berdasarkan id
const deleteTodo = (id) => {
    const todoIndex = todos.findIndex(todo => todo.id === id);
    if (todoIndex === -1) {
        return false;
    }

    todos.splice(todoIndex, 1);
    return true;
};

// Fungsi untuk mengubah status is_checked todo
const toggleTodoStatus = (id) => {
    const todo = findTodoById(id);
    if (!todo) {
        return null;
    }

    todo.is_checked = !todo.is_checked;
    return todo;
};

// Validasi input POST
const validatePostInput = (req, res, next) => {
    const { description, date } = req.body;
    if (!description || !date) {
        return res.status(400).json({ error: 'Description dan date harus diisi.' });
    }
    next();
};

// Validasi input PUT
const validatePutInput = (req, res, next) => {
    const { description, date } = req.body;
    if (!description || !date) {
        return res.status(400).json({ error: 'Hanya boleh mengubah description dan date.' });
    }
    next();
};

// GET /todos: Menampilkan semua todo
app.get('/todos', (req, res) => {
    res.json(todos);
});

// POST /todos: Membuat todo baru
app.post('/todos', validatePostInput, (req, res) => {
    const { description, date } = req.body;
    const newTodo = createTodo(description, date);
    res.status(201).json(newTodo);
});

// PUT /todos/:id: Mengupdate todo berdasarkan id
app.put('/todos/:id', validatePutInput, (req, res) => {
    const { id } = req.params;
    const { description, date } = req.body;

    const updatedTodo = updateTodo(id, description, date);
    if (!updatedTodo) {
        return res.status(404).json({ error: 'Todo tidak ditemukan.' });
    }

    res.json(updatedTodo);
});

// DELETE /todos/:id: Menghapus todo berdasarkan id
app.delete('/todos/:id', (req, res) => {
    const { id } = req.params;

    const success = deleteTodo(id);
    if (!success) {
        return res.status(404).json({ error: 'Todo tidak ditemukan.' });
    }

    res.status(204).send();
});

// PATCH /todos/:id/toggle: Mengubah status is_checked todo
app.patch('/todos/:id/toggle', (req, res) => {
    const { id } = req.params;

    const toggledTodo = toggleTodoStatus(id);
    if (!toggledTodo) {
        return res.status(404).json({ error: 'Todo tidak ditemukan.' });
    }

    res.json(toggledTodo);
});

app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
