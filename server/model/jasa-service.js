const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Jasaservice = sequelize.define('jasa_servis', {

  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  jenis: {
    type: DataTypes.STRING,
    allowNull:false,
  },
  harga: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },

}, {
  timestamps: true,
  tableName: 'jasa_servis'
 
});

module.exports = Jasaservice;
