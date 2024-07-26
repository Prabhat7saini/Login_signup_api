
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust the path as needed

const User = sequelize.define('User', {
  
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email:{
    type: DataTypes.STRING,
    allowNull: false,
  },
  password:{
    type:DataTypes.STRING,
    allowNull:false
  },
  age: {
    type: DataTypes.INTEGER,
    // allowNull: false,
  },
}, {
  // Additional model options if needed
});

module.exports = User;
