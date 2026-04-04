const dns = require('node:dns');
dns.setServers(['1.1.1.1', '8.8.8.8']); 
require('dotenv').config();
console.log("ENV CHECK:", process.env.MONGO_URI);
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const requestRoutes= require("./Routes/requestRoutes.js");
const userRoutes=require("./Routes/usersRoutes.js");
const authRoutes=require("./Routes/authRoutes.js");
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB connected successfully'))
    .catch(err => {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1);
    });
    const app = express();

app.use(helmet());
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true
}));
app.use(compression()); // Compress responses
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api', limiter);



app.use("/api/requsets",requestRoutes);
app.use("/api/Users/", userRoutes);
app.use("/api/auth/",authRoutes);
app.listen(3000, () => {
    console.log('server is running on port 3000 using express');
});