const express = require('express');
const connectDB = require('./config/db');
const app = express();
require('dotenv').config();
const cors = require('cors');
const authRoutes = require('./routes/authRoute');
const chatRoutes = require('./routes/chatRoute');
const massageRoutes = require('./routes/massageRoute');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'))

connectDB();

app.get('/', (req, res) => { 
    res.send('Api is running');
});


app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", massageRoutes);

const port = process.env.PORT ||3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});