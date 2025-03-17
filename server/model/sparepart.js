const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Sparepart = sequelize.define('sparepart', {

  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  kode: {
    type: DataTypes.STRING,
    allowNull:false,
  },
  nama: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  jumlah: {
    type: DataTypes.STRING,
    allowNull:false,
  },
  harga_jual: {
    type: DataTypes.INTEGER,
    allowNull:false,
  },
  harga_beli: {
    type: DataTypes.INTEGER,
    allowNull:false,
  },
  foto: {
    type: DataTypes.STRING,
    allowNull : true,
  },
  kategori: {
    type: DataTypes.INTEGER,
    allowNull : true,
  },

}, {
  timestamps: true,
  tableName: 'sparepart'
 
});

module.exports = Sparepart;
