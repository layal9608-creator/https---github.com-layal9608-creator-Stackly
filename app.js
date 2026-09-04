const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/user');

const app = express();
const PORT = 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/stackly';

mongoose.connect(MONGO_URI)
.then(() => {
console.log('MongoDB connected');
return seedUsers();
})
.catch((err) => console.error('MongoDB unavailable:', err.message));

async function seedUsers() {
const count = await User.countDocuments();
if (count === 0) {
await User.insertMany([
    { name: 'John', email: 'john@test.com', age: 25 },
    { name: 'David', email: 'david@test.com', age: 28 },
])
console.log('Users Inserted');
}
}

app.get('/', (req, res) => {
res.send('Welcome to Stackly');
});

app.get('/users', async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ error: 'Database unavailable' });
  }

  try {
    const users = await User.find({}, '-_id -__v');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

