// config/database.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('Login_Signup_database', 'user', 'P1R2a3#4', {
  host: 'localhost',
  dialect: 'mysql', // or 'postgres', 'sqlite', 'mariadb', 'mssql'
});

module.exports = sequelize;
