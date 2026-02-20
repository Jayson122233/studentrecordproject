const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const connection = require('./db');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.json());

// ✅ API routes FIRST, before static files
app.post('/api/students', (req, res) => {
  const { idstudents, FirstName, LastName, Course, Age, Address } = req.body;
  const sql = 'INSERT INTO students (idstudents, FirstName, LastName, Course, Age, Address) VALUES (?, ?, ?, ?, ?, ?)';
  connection.query(sql, [idstudents, FirstName, LastName, Course, Age, Address], (err) => {
    if (err) return res.status(500).send(err.message);
    res.send('Student added successfully!');
  });
});

app.get('/api/students', (req, res) => {
  connection.query('SELECT * FROM students', (err, results) => {
    if (err) return res.status(500).send(err.message);
    res.json(results);
  });
});

app.get('/api/students/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  console.log('Looking for ID:', id);
  if (isNaN(id)) return res.status(400).send('Invalid ID');

  const sql = 'SELECT * FROM students WHERE idstudents = ?';
  connection.query(sql, [id], (err, results) => {
    if (err) return res.status(500).send(err.message);
    console.log('Results:', results);
    if (results.length === 0) return res.status(404).send('Student not found');
    res.json(results[0]);
  });
});

app.put('/api/students/:id', (req, res) => {
  const { FirstName, LastName, Course, Age, Address } = req.body;
  const sql = 'UPDATE students SET FirstName=?, LastName=?, Course=?, Age=?, Address=? WHERE idstudents=?';
  connection.query(sql, [FirstName, LastName, Course, Age, Address, req.params.id], (err) => {
    if (err) return res.status(500).send(err.message);
    res.send('Student updated successfully!');
  });
});

app.delete('/api/students/:id', (req, res) => {
  connection.query('DELETE FROM students WHERE idstudents=?', [req.params.id], (err) => {
    if (err) return res.status(500).send(err.message);
    res.send('Student deleted successfully!');
  });
});


app.use(express.static(path.join(__dirname, '../frontend')));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});