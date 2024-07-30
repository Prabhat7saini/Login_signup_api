const express = require('express');
const app = express();
const userRoutes = require('./routes/user.routes');
const { PORT } = require('./config/environmentVariable');
const cookieParser = require('cookie-parser');


// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser());
app.get('/', (req, res) => {
    return res.json({
        success: true,
        message: "your server is up and running...."
    });
});

// Use the user routes


app.use('/api/v1/auth', userRoutes);

    app.listen(PORT || 3000, () => {
        console.log(`running ${PORT || 3000}`);
    });
