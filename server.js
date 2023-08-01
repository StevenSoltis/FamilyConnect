const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const publicPath = path.join(__dirname, 'public');


const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('c:\Users\steve\Desktop\FamilyConnect'); 
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

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
