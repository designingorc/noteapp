const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json()); // Allows parsing of JSON body
app.use(cors()); // Enable CORS for all origins (adjust for production)

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

// Basic route
app.get('/', (req, res) => {
    res.send('Note App API is running!');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));