const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const publicPath = path.join(__dirname, 'public');


const app = express();
const port = 3001;

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('c:\\Users\\steve\\Desktop\\FamilyConnect');
  });

const db = new sqlite3.Database('database.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});




// login requests
app.post('/login', (req, res) => {
    const { username, password } = req.body;


    const loginQuery = `
        SELECT * FROM users
        WHERE username = ? AND password = ?
    `;

    db.get(loginQuery, [username, password], (err, user) => {
        if (err) {
            console.error('Error executing login query:', err.message);
            res.json({ success: false });
        } else {
            if (user) {
                //login successful
                res.json({ success: true });
            } else {
                //login failed
                res.json({ success: false });
            }
        }
    });
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(publicPath, 'dashboard.html'));
});

// Handle POST request to save a new list and its items
app.post('/saveList', (req, res) => {
    const listName = req.body.listName;
    const items = req.body.items; // An array of item names

    // Insert the list into the "lists" table
    db.run('INSERT INTO lists (list_name) VALUES (?)', [listName], function(err) {
        if (err) {
            console.error('Error inserting list:', err.message);
            res.json({ success: false });
        } else {
            const listId = this.lastID; // Get the auto-generated list_id
            const itemInsertQueries = items.map(item => ({
                sql: 'INSERT INTO items (list_id, item_name) VALUES (?, ?)',
                params: [listId, item]
            }));

            // Insert the items into the "items" table
            db.serialize(() => {
                db.run('BEGIN TRANSACTION');
                itemInsertQueries.forEach(query => {
                    db.run(query.sql, query.params, function(err) {
                        if (err) {
                            console.error('Error inserting item:', err.message);
                        }
                    });
                });
                db.run('COMMIT', function(err) {
                    if (err) {
                        console.error('Error committing transaction:', err.message);
                        res.json({ success: false });
                    } else {
                        res.json({ success: true });
                    }
                });
            });
        }
    });
});

// Handle DELETE request to delete a list and its items
app.delete('/deleteList/:listId', (req, res) => {
    const listId = req.params.listId;

    db.run('DELETE FROM items WHERE list_id = ?', [listId], function(err) {
        if (err) {
            console.error('Error deleting items:', err.message);
            res.json({ success: false });
        } else {
            db.run('DELETE FROM lists WHERE list_id = ?', [listId], function(err) {
                if (err) {
                    console.error('Error deleting list:', err.message);
                    res.json({ success: false });
                } else {
                    res.json({ success: true });
                }
            });
        }
    });
});

// Create a New To-Do List
app.post('/todolists', (req, res) => {
    const { list_name } = req.body;

    const insertQuery = `
        INSERT INTO todo_items (list_name) VALUES (?)
    `;

    db.run(insertQuery, [list_name], (err) => {
        if (err) {
            console.error('Error inserting list:', err.message);
            res.sendStatus(500);
        } else {
            res.sendStatus(200);
        }
    });
});

// Update a To-Do List
app.put('/todolists/:list_id', (req, res) => {
    const { list_id } = req.params;
    const { list_name, completed } = req.body;

    const updateQuery = `
        UPDATE todo_items
        SET list_name = ?, completed = ?
        WHERE item_id = ?
    `;

    db.run(updateQuery, [list_name, completed, list_id], (err) => {
        if (err) {
            console.error('Error updating list:', err.message);
            res.sendStatus(500);
        } else {
            res.sendStatus(200);
        }
    });
});

// Delete a To-Do List
app.delete('/todolists/:list_id', (req, res) => {
    const { list_id } = req.params;

    const deleteQuery = `
        DELETE FROM todo_items
        WHERE item_id = ?
    `;

    db.run(deleteQuery, [list_id], (err) => {
        if (err) {
            console.error('Error deleting list:', err.message);
            res.sendStatus(500);
        } else {
            res.sendStatus(200);
        }
    });
});

// Add an Item to a To-Do List
app.post('/todolists/:list_id/items', (req, res) => {
    const { list_id } = req.params;
    const { item_name } = req.body;

    const insertQuery = `
        INSERT INTO todo_items (item_name, list_id) VALUES (?, ?)
    `;

    db.run(insertQuery, [item_name, list_id], (err) => {
        if (err) {
            console.error('Error inserting item:', err.message);
            res.sendStatus(500);
        } else {
            res.sendStatus(200);
        }
    });
});

// Update an Item in a To-Do List
app.put('/todolists/:list_id/items/:item_id', (req, res) => {
    const { list_id, item_id } = req.params;
    const { item_name, completed } = req.body;

    const updateQuery = `
        UPDATE todo_items
        SET item_name = ?, completed = ?
        WHERE item_id = ? AND list_id = ?
    `;

    db.run(updateQuery, [item_name, completed, item_id, list_id], (err) => {
        if (err) {
            console.error('Error updating item:', err.message);
            res.sendStatus(500);
        } else {
            res.sendStatus(200);
        }
    });
});

// Delete an Item from a To-Do List
app.delete('/todolists/:list_id/items/:item_id', (req, res) => {
    const { list_id, item_id } = req.params;

    const deleteQuery = `
        DELETE FROM todo_items
        WHERE item_id = ? AND list_id = ?
    `;

    db.run(deleteQuery, [item_id, list_id], (err) => {
        if (err) {
            console.error('Error deleting item:', err.message);
            res.sendStatus(500);
        } else {
            res.sendStatus(200);
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
