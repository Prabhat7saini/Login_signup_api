// config/database.js
const { Sequelize } = require('sequelize');
const {PORT} =require('./environmentVariable')

const sequelize = new Sequelize('Login_Signup_database', 'user', 'P1R2a3#4', {
  host: 'localhost',
  // port: PORT, // Change this to the port your database server is running on
  dialect: 'mysql', // or 'postgres', etc.
});


module.exports = sequelize;

