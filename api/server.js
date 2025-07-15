const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the parent directory
app.use(express.static(path.join(__dirname, '..')));

// Import routes
const ieltsRoutes = require('./ielts-scoring-api');
app.use(ieltsRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`IELTS Scoring API server is running on port ${PORT}`);
  console.log(`Access the website at http://localhost:${PORT}`);
});