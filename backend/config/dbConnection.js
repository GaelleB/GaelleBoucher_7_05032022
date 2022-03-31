const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('groupomania', 'root', 'Kiline23', {
  host: 'localhost',
  dialect: 'mysql'
});

exports.authSequelize = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};


