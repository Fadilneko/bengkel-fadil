const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('bengkel', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    timezone: '+07:00',
    logging: console.log
});

module.exports = sequelize;
