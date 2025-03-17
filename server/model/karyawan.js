const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Karyawan = sequelize.define('karyawan', {

  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true, 
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nama: {
    type: DataTypes.STRING,
    allowNull:false,
  },
  alamat: {
    type: DataTypes.STRING,
    allowNull : true,
  },
  hp: {
    type: DataTypes.INTEGER,
    allowNull : true,
  },
  role: {
    type: DataTypes.INTEGER,
    allowNull : true,
    defaultValue: 0,
  },
  foto: {
    type: DataTypes.STRING,
    allowNull : true,
  },

}, {
  tableName: 'karyawan'
 
});

module.exports = Karyawan;
