const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

// Routes
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Profile Routes
app.use('/api/profiles', require('./routes/profileRoutes'));
// Event Routes
app.use('/api/events', require('./routes/eventRoutes'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
