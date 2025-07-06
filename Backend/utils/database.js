// utils/database.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.MYSQL_ADDON_DB, 
  process.env.MYSQL_ADDON_USER, 
  process.env.MYSQL_ADDON_PASSWORD, 
  {
    host: process.env.MYSQL_ADDON_HOST,
    port: process.env.MYSQL_ADDON_PORT,
    dialect: 'mysql',
    logging: false,
  }
);

// Authenticate and auto-sync models
sequelize.authenticate()
  .then(() => {
    console.log('Connected to MySQL database!');

    // Automatically sync all defined models
    // return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log('Database schema synced successfully!');
  })
  .catch(err => {
    console.error('Unable to connect or sync the database:', err);
  });

module.exports = { sequelize };
