const express = require('express');
const sequelize = require('./config/database'); 
const app = express();
const db = require('./models');
const userRoutes = require('./routes/user.routes');
// const mailSender = require('./utils/mailSender'); // Assuming this is correct

// Middleware to parse JSON bodies
app.use(express.json());

app.get('/', (req, res) => {
    return res.json({
        success: true,
        message: "your server is up and running...."
    });
});

// Use the user routes


app.use('/api/v1/auth', userRoutes);
// app.js or index.js

// sequelize.sync({ force: false }).then(() => {
//   console.log('Database synced');
// }).catch(err => {
//   console.error('Unable to sync database:', err);
// });

// db.sequelize.sync().then(() => {
    app.listen(3000, () => {
        console.log(`running`);
    });
// });

// console.log("insidemail", sendmailfortop);
