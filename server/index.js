const express = require('express');
const cors = require('cors');
require('dotenv').config();
const notesRoutes = require('./routes/notes');
const pool = require('./config/db'); // Import to ensure connection on startup

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // For parsing application/json

// Routes
app.use('/api/notes', notesRoutes);

// Test DB connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('Database connected successfully at:', res.rows[0].now);
  }
});

app.get('/', (req, res) => {
  res.send('Note App Backend API');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
