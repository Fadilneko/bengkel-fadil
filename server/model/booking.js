const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Booking = sequelize.define('booking', {

    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    tanggal_booking: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    tanggal_penanganan: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    keluhan: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    no_antrian: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    id_kendaraan: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    waktu: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    
}, {
  timestamps: true,
  tableName: 'booking'
 
});

module.exports = Booking;
