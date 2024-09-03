const express = require('express');
const app = express();
require('dotenv').config();
const connectDB = require('./config/db');
const roleRoutes = require('./routes/index');

connectDB();

app.use(express.json());
// app.use('/', async (req, res) => { res.send("hello")});
app.use('/api', roleRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
