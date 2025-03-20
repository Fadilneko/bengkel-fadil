const sequelize = require('../config/db');
const Sequelize = require('sequelize');
const User = require('../model/login'); 
const Pelanggan = require('../model/pelanggan');
const Karyawan = require('../model/karyawan');
const Kendaraan = require('../model/kendaraan');
const Sparepart = require('../model/sparepart');
const Jasaservice = require('../model/jasa-service');
const Booking = require('../model/booking');
const Riwayat = require('../model/riwayat');
const RiwayatSparepart = require('./riwayat-sparepart');
const LaporanBulanan = require('../model/laporan-bulanan')

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.User = User;
db.Pelanggan = Pelanggan;
db.Karyawan = Karyawan;
db.Kendaraan = Kendaraan;
db.Sparepart = Sparepart;
db.Jasaservice = Jasaservice;
db.Booking = Booking;
db.Riwayat = Riwayat;
db.RiwayatSparepart = RiwayatSparepart;
db.LaporanBulanan = LaporanBulanan


db.Pelanggan.belongsTo(db.User, { foreignKey: 'user_id', as: 'user' });
db.User.hasOne(db.Pelanggan, { foreignKey: 'user_id', as: 'pelanggan' });

Kendaraan.belongsTo(Pelanggan, { foreignKey: 'id_pelanggan', as: 'pelanggan' });
Pelanggan.hasMany(Kendaraan, { foreignKey: 'id_pelanggan' });

db.Booking.belongsTo(db.Kendaraan, { foreignKey: 'id_kendaraan', as: 'kendaraan' });
db.Kendaraan.hasMany(db.Booking, { foreignKey: 'id_kendaraan' });

Riwayat.belongsTo(Karyawan, { foreignKey: 'id_karyawan', as: 'karyawan' });
Riwayat.belongsTo(Kendaraan, { foreignKey: 'id_kendaraan', as: 'kendaraan' });
Riwayat.belongsTo(Jasaservice, { foreignKey: 'id_jasa', as: 'jasa' });

Karyawan.hasMany(Riwayat, { foreignKey: 'id_karyawan', as: 'riwayat' });
Kendaraan.hasMany(Riwayat, { foreignKey: 'id_kendaraan', as: 'riwayat' });
Jasaservice.hasMany(Riwayat, { foreignKey: 'id_jasa', as: 'riwayat' });


Riwayat.belongsToMany(Sparepart, { through: RiwayatSparepart, as: 'spareparts', foreignKey: 'riwayat_id' });
Sparepart.belongsToMany(Riwayat, { through: RiwayatSparepart, as: 'riwayats', foreignKey: 'sparepart_id' });



db.sequelize.sync()
  .then(() => {
    console.log('Database & tables created!');
  });

module.exports = db;
