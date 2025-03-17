const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Riwayat = require('./riwayat');
const Sparepart = require('./sparepart');

const RiwayatSparepart = sequelize.define('riwayat_sparepart', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  riwayat_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Riwayat,
      key: 'id'
    },
    allowNull: false
  },
  sparepart_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Sparepart,
      key: 'id'
    },
    allowNull: false
  },
  jumlah_sparepart: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  harga_jual: { 
    type: DataTypes.FLOAT,
    allowNull: false
  },
  harga_beli: { 
    type: DataTypes.FLOAT,
    allowNull: false
  }
}, {
  timestamps: true,
  tableName: 'riwayat_sparepart'
});

module.exports = RiwayatSparepart;
