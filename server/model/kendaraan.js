const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Pelanggan = require('./pelanggan');

const Kendaraan = sequelize.define('kendaraan', {

  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  id_pelanggan: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Pelanggan, 
      key: 'id'       
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL' 
  },
  nopol: {
    type: DataTypes.STRING,
    allowNull:true,
  },
  merek: {
    type: DataTypes.STRING,
    allowNull:true,
  },
  tipe: {
    type: DataTypes.STRING,
    allowNull:true,
  },
  transmisi: {
    type: DataTypes.INTEGER,
    allowNull : true,
  },
  kapasitas_cc: {
    type: DataTypes.INTEGER,
    allowNull : true,
  },
  tahun: {
    type: DataTypes.INTEGER,
    allowNull : true,
  },

}, {
  timestamps: true,
  tableName: 'kendaraan'
 
});

Kendaraan.belongsTo(Pelanggan, { foreignKey: 'id_pelanggan' });
Pelanggan.hasMany(Kendaraan, { foreignKey: 'id_pelanggan' });

module.exports = Kendaraan;
