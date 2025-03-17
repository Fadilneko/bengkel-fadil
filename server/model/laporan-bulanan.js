// models/LaporanBulanan.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const LaporanBulanan = sequelize.define('laporan_bulanan', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  tanggal: {
    type: DataTypes.DATE,
    allowNull: false
  },
  total_keuntungan: {
    type: DataTypes.DECIMAL(15,2),
    allowNull: false,
    defaultValue: 0
  }
}, {
  timestamps: false,
  tableName: 'laporan_bulanan'
});

module.exports = LaporanBulanan;
