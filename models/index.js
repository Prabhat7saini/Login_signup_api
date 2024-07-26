// models/index.js
const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');

const sequelize = new Sequelize('Login_Signup_database', 'user', 'P1R2a3#4', {
  host: 'localhost',
  dialect: 'mysql' // or 'postgres', 'sqlite', etc.
});

const models = {};
const modelsPath = path.resolve(__dirname, '.');

fs.readdirSync(modelsPath).forEach(file => {
  if (file.endsWith('.model.js')) {
    const modelDefiner = require(path.join(modelsPath, file));
    const model = new modelDefiner(sequelize);
    models[model.name] = model;
  }
});

sequelize.sync()
  .then(() => {
    console.log('All models were synchronized successfully.');
  })
  .catch(err => {
    console.error('Unable to synchronize the models:', err);
  });

module.exports = {
  sequelize,
  models
};
