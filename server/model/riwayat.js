const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Riwayat = sequelize.define('riwayat', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  tanggal: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  keluhan: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  penanganan: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  catatan: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  id_karyawan: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  id_kendaraan: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_jasa: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  total_harga: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  subtotal: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
}, {
  timestamps: true,
  tableName: 'riwayat'
});

module.exports = Riwayat;
