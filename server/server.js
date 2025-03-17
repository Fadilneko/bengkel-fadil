const express = require('express');
const Sequelize = require('sequelize');
const cors = require('cors');
const session = require('express-session');
const bcrypt = require('bcrypt');
const db = require('./model');
const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '-1');
  next();
});


const corsOptions = {
  origin: 'http://localhost:4200', 
  credentials: true,
};

app.use(cors(corsOptions));

app.use(session({
  secret: 'your-secret-key', 
  resave: false,             
  saveUninitialized: false, 
  cookie: { 
    secure: false,           
    maxAge: 1000 * 60 * 60  
  }
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
 
    cb(null, path.join(__dirname, '../src/assets')); 
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName); 
  }
});

app.use('/assets', express.static(path.join(__dirname, '../src/assets')));


const upload = multer({ storage: storage });

app.use((req, res, next) => {
  console.log('Response Headers:', res.getHeaders());
  next();
});


function isAuthenticated(req, res, next) {
  console.log("Session userId:", req.session.userId);
  if (req.session && req.session.userId) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized: Please log in first' });
}

app.get('/protected', isAuthenticated, (req, res) => {
  res.json({ message: 'This is a protected route', userId: req.session.userId });
});



app.post('/upload', upload.single('foto'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  res.json({ filename: req.file.filename, path: `assets/${req.file.filename}` }); 
});



// Register User & Pelanggan
app.post('/register', async (req, res) => {
  const { email, password, role, nama } = req.body;

  try {

    const hashedPassword = await bcrypt.hash(password, 10);


    const newUser = await db.User.create({
      email,
      password: hashedPassword,
      role: role ?? 0, 
    });

    const newPelanggan = await db.Pelanggan.create({
      user_id: newUser.id, 
      email,
      password: hashedPassword,
      nama,
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: newUser,
      pelanggan: newPelanggan,
    });
  } catch (err) {
    res.status(400).json({ error: 'Error registering user', details: err });
  }
});

// Login User / Karyawan
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
 
    let pelanggan = await db.Pelanggan.findOne({
      where: { email: email.trim() },
      include: [{
        model: db.User,
        attributes: ['role'],
        as: 'user',
      }],
    });

    if (pelanggan && await bcrypt.compare(password, pelanggan.password)) {
    
      req.session.userId = pelanggan.id;
      return res.json({ 
        id: pelanggan.id,
        email: pelanggan.email,
        role: pelanggan.user?.role ?? 'N/A',
        table: 'pelanggan'
      });
    }

  
    let karyawan = await db.Karyawan.findOne({ where: { email: email.trim() } });
    if (karyawan && await bcrypt.compare(password, karyawan.password)) {
      req.session.userId = karyawan.id;
      return res.json({ 
        id: karyawan.id,
        email: karyawan.email, 
        role: karyawan.role, 
        table: 'karyawan' 
      });
    }

    res.status(401).json({ message: 'Invalid credentials' });
  } catch (error) {
    console.error("💥 Server error:", error);
    res.status(500).json({ message: 'Server error', error });
  }
});

app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).json({ message: 'Logout failed', error: err });
    }
    res.clearCookie('connect.sid');
    console.log("Logout successful for session:", req.session);
    res.json({ message: 'Logout successful' });
  });
});



// Get All Pelanggan
app.get('/pelanggan', async (req, res) => {
  try {
    const pelanggan = await db.Pelanggan.findAll();
    res.json(pelanggan);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching pelanggan', details: err });
  }
});

app.get('/pelanggan/:id', async (req, res) => {
  try {
    const pelanggan = await db.Pelanggan.findByPk(req.params.id, {
      attributes: ['id','ktp', 'nama', 'foto', 'alamat', 'hp'] 
    });

    if (!pelanggan) {
      return res.status(404).json({ error: 'pelanggan not found' });
    }

    res.json(pelanggan);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching pelanggan', details: err });
  }
});


// create pelanggan
app.post('/pelanggan', async (req, res) => {
  try {
    const pelanggan = await db.Pelanggan.create(req.body);
    res.status(201).json({ message: 'Pelanggan added successfully', pelanggan });
  } catch (error) {
    console.error('Error adding pelanggan:', error);
    res.status(400).json({ error: 'Failed to add pelanggan', details: error.message });
  }
});



// Update pelanggan
app.put('/pelanggan/:id', upload.single('foto'), async (req, res) => {
  try {
    const pelanggan = await db.Pelanggan.findByPk(req.params.id);
    if (!pelanggan) {
      return res.status(404).json({ error: 'pelanggan not found' });
    }

    
    const { nama,ktp, alamat, hp, foto: fotoBody } = req.body;
    
    const foto = req.file ? req.file.filename : (fotoBody || pelanggan.foto); 


    await pelanggan.update({ ktp, nama, alamat, hp, foto });

    res.json({ message: 'pelanggan updated successfully', pelanggan });
  } catch (error) {
    console.error('Error updating pelanggan:', error);
    res.status(400).json({ error: 'Failed to update pelanggan', details: error.message });
  }
});

// Hapus pelanggan
app.delete('/pelanggan/:id', async (req, res) => {
  try {
    const pelanggan = await db.Pelanggan.findByPk(req.params.id);
    if (!pelanggan) {
      return res.status(404).json({ error: 'Pelanggan not found' });
    }

    await pelanggan.destroy();
    res.json({ message: 'Pelanggan deleted successfully' });
  } catch (error) {
    console.error('Error deleting pelanggan:', error);
    res.status(400).json({ error: 'Failed to delete pelanggan', details: error.message });
  }
});

// Get All karyawan
app.get('/karyawan', async (req, res) => {
  try {
    const karyawan = await db.Karyawan.findAll();
    res.json(karyawan);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching karyawan', details: err });
  }
});

app.get('/karyawan/:id', async (req, res) => {
  try {
    const karyawan = await db.Karyawan.findByPk(req.params.id, {
      attributes: ['id', 'nama', 'role', 'foto', 'alamat', 'hp'] 
    });

    if (!karyawan) {
      return res.status(404).json({ error: 'Karyawan not found' });
    }

    res.json(karyawan);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching karyawan', details: err });
  }
});


// create Karyawan
app.post('/karyawan', async (req, res) => {
  try {
    const { nama, email, password, role, foto } = req.body;


    const hashedPassword = await bcrypt.hash(password, 10);

    const karyawan = await db.Karyawan.create({
      nama,
      email, 
      password: hashedPassword, 
      role,
      foto
    });

    res.status(201).json({ message: 'Karyawan added successfully', karyawan });
  } catch (error) {
    console.error('Error adding karyawan:', error);
    res.status(400).json({ error: 'Failed to add karyawan', details: error.message });
  }
});


// Update karyawan
app.put('/karyawan/:id', upload.single('foto'), async (req, res) => {
  try {
    const karyawan = await db.Karyawan.findByPk(req.params.id);
    if (!karyawan) {
      return res.status(404).json({ error: 'Karyawan not found' });
    }

    
    const { nama, alamat, hp, foto: fotoBody } = req.body;
    
    const foto = req.file ? req.file.filename : (fotoBody || karyawan.foto);


    await karyawan.update({ nama, alamat, hp, foto });

    res.json({ message: 'Karyawan updated successfully', karyawan });
  } catch (error) {
    console.error('Error updating karyawan:', error);
    res.status(400).json({ error: 'Failed to update karyawan', details: error.message });
  }
});

// Hapus karyawan
app.delete('/karyawan/:id', async (req, res) => {
  try {
    const karyawan = await db.Karyawan.findByPk(req.params.id);
    if (!karyawan) {
      return res.status(404).json({ error: 'karyawan not found' });
    }

    await karyawan.destroy();
    res.json({ message: 'karyawan deleted successfully' });
  } catch (error) {
    console.error('Error deleting karyawan:', error);
    res.status(400).json({ error: 'Failed to delete karyawan', details: error.message });
  }
});

// Get All kendaraan
app.get('/kendaraan', async (req, res) => {
  try {
    const kendaraan = await db.Kendaraan.findAll();
    res.json(kendaraan);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching kendaraan', details: err });
  }
});

app.get('/kendaraan/:id', async (req, res) => {
  try {
    const kendaraan = await db.Kendaraan.findByPk(req.params.id, {
      include: [
        {
          model: db.Pelanggan,  
          as: 'pelanggan',     
          attributes: ['id', 'nama', 'ktp']  
        }
      ]
    });

    if (!kendaraan) return res.status(404).json({ error: 'Data kendaraan tidak ditemukan' });

    res.json(kendaraan);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil data kendaraan', details: error.message });
  }
});

// create kendaraan
app.post('/kendaraan', async (req, res) => {
  const { id_pelanggan, nopol, merek, tipe, transmisi, kapasitas_cc, tahun } = req.body;

  console.log('Data yang diterima dari frontend:');
  console.log('id_pelanggan:', id_pelanggan);
  console.log('nopol:', nopol);
  console.log('merek:', merek);
  console.log('transmisi:', transmisi);
  console.log('kapasitas_cc:', kapasitas_cc);
  console.log('tahun:', tahun);


  if (!id_pelanggan) {
    return res.status(400).json({ message: 'ID pelanggan diperlukan.' });
  }

  try {
    const kendaraan = await db.Kendaraan.create({
      id_pelanggan,
      nopol,
      merek,
      tipe,
      transmisi,
      kapasitas_cc,
      tahun,
    });

    res.status(201).json(kendaraan);
  } catch (error) {
    console.error('Error menambahkan kendaraan:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
});


// Update kendaraan
app.put('/kendaraan/:id', async (req, res) => {
  try {
    const kendaraan = await db.Kendaraan.findByPk(req.params.id);
    if (!kendaraan) {
      return res.status(404).json({ error: 'kendaraan not found' });
    }

    await kendaraan.update(req.body);
    res.json({ message: 'kendaraan updated successfully', kendaraan });
  } catch (error) {
    console.error('Error updating kendaraan:', error);
    res.status(400).json({ error: 'Failed to update kendaraan', details: error.message });
  }
});

// Hapus kendaraan
app.delete('/kendaraan/:id', async (req, res) => {
  try {
    const kendaraan = await db.Kendaraan.findByPk(req.params.id);
    if (!kendaraan) {
      return res.status(404).json({ error: 'kendaraan not found' });
    }

    await kendaraan.destroy();
    res.json({ message: 'kendaraan deleted successfully' });
  } catch (error) {
    console.error('Error deleting kendaraan:', error);
    res.status(400).json({ error: 'Failed to delete kendaraan', details: error.message });
  }

});

// Ambil kendaraan berdasarkan id_pelanggan

const { Op } = require('sequelize');

app.get('/kendaraan/pelanggan/:id_pelanggan', async (req, res) => {
  try {
    const { id_pelanggan } = req.params;

    
    let kendaraan = await db.Kendaraan.findAll({
      where: { id_pelanggan }
    });

    
    const kendaraanDibooking = await db.Booking.findAll({
      where: { 
        status: { [Op.not]: 'selesai' } 
      },
      attributes: ['id_kendaraan', 'id']
    });

    const kendaraanDibookingMap = kendaraanDibooking.reduce((acc, curr) => {
      acc[curr.id_kendaraan] = curr.id;
      return acc;
    }, {});
    
   
    const kendaraanWithStatus = kendaraan.map(k => ({
      ...k.toJSON(),
      dalamBooking: kendaraanDibookingMap[k.id] ? true : false,
      bookingId: kendaraanDibookingMap[k.id] || null
    }));

    res.json(kendaraanWithStatus);
  } catch (error) {
    console.error('Error fetching kendaraan by pelanggan ID:', error);
    res.status(500).json({ error: 'Error fetching kendaraan', details: error.message });
  }
});


// Get All sparepart

app.get('/sparepart', async (req, res) => {
  try {
    const sparepart = await db.Sparepart.findAll();
    res.json(sparepart);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching sparepart', details: err });
  }
});

app.get('/sparepart/:id', async (req, res) => {
  try {
      const sparepart = await db.Sparepart.findByPk(req.params.id);
      
      if (!sparepart) {
          return res.status(404).json({ message: "Sparepart tidak ditemukan" });
      }

      res.json(sparepart);
  } catch (error) {
      res.status(500).json({ message: "Terjadi kesalahan", error });
  }
});


// create sparepart
app.post('/sparepart', async (req, res) => {
  try {
    const sparepart = await db.Sparepart.create(req.body);
    res.status(201).json({ message: 'sparepart added successfully', sparepart });
  } catch (error) {
    console.error('Error adding sparepart:', error);
    res.status(400).json({ error: 'Failed to add sparepart', details: error.message });
  }
});

app.put('/sparepart/:id/update-stock', async (req, res) => {
  const { jumlah } = req.body;
  const sparepartId = req.params.id;

  console.log("📥 Request update stok diterima:", { sparepartId, jumlah });

  if (!jumlah || isNaN(jumlah) || jumlah <= 0) {
      return res.status(400).json({ message: "Jumlah tidak valid" });
  }

  const transaction = await db.sequelize.transaction();

  try {
      const sparepart = await db.Sparepart.findByPk(sparepartId, { transaction });

      if (!sparepart) {
          console.log("❌ Sparepart tidak ditemukan:", sparepartId);
          await transaction.rollback();
          return res.status(404).json({ message: "Sparepart tidak ditemukan" });
      }

      if (sparepart.jumlah < jumlah) {
          console.log("⚠️ Stok tidak cukup untuk:", sparepartId);
          await transaction.rollback();
          return res.status(400).json({ message: "Stok tidak cukup" });
      }

      console.log("🔎 Sebelum update:", sparepart.jumlah);

      const [updatedRows] = await db.Sparepart.update(
          { jumlah: sparepart.jumlah - jumlah },
          { where: { id: sparepartId, jumlah: sparepart.jumlah }, transaction }
      );

      if (updatedRows === 0) {
          console.log("⚠️ Stok sudah diperbarui sebelumnya, tidak ada perubahan.");
          await transaction.rollback();
          return res.status(400).json({ message: "Stok tidak diperbarui, mungkin sudah diproses sebelumnya." });
      }

      console.log("✅ Setelah update:", sparepart.jumlah - jumlah);

      await transaction.commit();

      const updatedSparepart = await db.Sparepart.findByPk(sparepartId);

      res.json({ message: "Stok sparepart berhasil diperbarui", sparepart: updatedSparepart });
  } catch (error) {
      console.error("❌ Error saat update stok:", error);
      await transaction.rollback();
      res.status(500).json({ message: "Terjadi kesalahan", error });
  }
});




// Update sparepart
app.put('/sparepart/:id', async (req, res) => {
  try {
    const sparepart = await db.Sparepart.findByPk(req.params.id);
    if (!sparepart) {
      return res.status(404).json({ error: 'sparepart not found' });
    }

    await sparepart.update(req.body);
    res.json({ message: 'sparepart updated successfully', sparepart });
  } catch (error) {
    console.error('Error updating sparepart:', error);
    res.status(400).json({ error: 'Failed to update sparepart', details: error.message });
  }
});

// Hapus sparepart
app.delete('/sparepart/:id', async (req, res) => {
  try {
    const sparepart = await db.Sparepart.findByPk(req.params.id);
    if (!sparepart) {
      return res.status(404).json({ error: 'sparepart not found' });
    }

    await sparepart.destroy();
    res.json({ message: 'sparepart deleted successfully' });
  } catch (error) {
    console.error('Error deleting sparepart:', error);
    res.status(400).json({ error: 'Failed to delete sparepart', details: error.message });
  }
});

// Get All jasa service

app.get('/jasa-service', async (req, res) => {
  try {
    const jasaservice = await db.Jasaservice.findAll();
    res.json(jasaservice);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching jasa service', details: err });
  }
});

// create jasa  service
app.post('/jasa-service', async (req, res) => {
  try {
    const jasaservice = await db.Jasaservice.create(req.body);
    res.status(201).json({ message: 'jasa service added successfully', jasaservice });
  } catch (error) {
    console.error('Error adding jasa service:', error);
    res.status(400).json({ error: 'Failed to add jasa service', details: error.message });
  }
});

// Update jasa service
app.put('/jasa-service/:id', async (req, res) => {
  try {
    const jasaservice = await db.Jasaservice.findByPk(req.params.id);
    if (!jasaservice) {
      return res.status(404).json({ error: 'jasaservice not found' });
    }

    await jasaservice.update(req.body);
    res.json({ message: 'jasa service updated successfully', jasaservice });
  } catch (error) {
    console.error('Error updating jasa service:', error);
    res.status(400).json({ error: 'Failed to update jasa service', details: error.message });
  }
});

// Hapus jasa service
app.delete('/jasa-service/:id', async (req, res) => {
  try {
    const jasaservice = await db.Jasaservice.findByPk(req.params.id);
    if (!jasaservice) {
      return res.status(404).json({ error: 'jasa service not found' });
    }

    await jasaservice.destroy();
    res.json({ message: 'jasa service deleted successfully' });
  } catch (error) {
    console.error('Error deleting jasa service:', error);
    res.status(400).json({ error: 'Failed to delete jasa service', details: error.message });
  }
});

// Get all data booking

app.get('/booking', async (req, res) => {
  try {
    const bookings = await db.Booking.findAll({
      include: [
        {
          model: db.Kendaraan,
          as: 'kendaraan',
          include: [
            {
              model: db.Pelanggan,
              as: 'pelanggan',
              attributes: ['nama'], 
            },
          ],
          attributes: ['id', 'nopol', 'merek', 'id_pelanggan'], 
        },
      ],
      attributes: ['id', 'tanggal_booking', 'tanggal_penanganan','id_kendaraan', 'keluhan', 'no_antrian', 'waktu', 'status'], 
    });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching bookings', details: err.message });
  }
});

app.get('/booking/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await db.Booking.findOne({
      where: { id }, 
      include: [
        {
          model: db.Kendaraan,
          as: 'kendaraan', 
          include: [
            {
              model: db.Pelanggan,
              as: 'pelanggan',
              attributes: ['nama'], 
            },
          ],
          attributes: ['id', 'nopol', 'id_pelanggan'],
        },
      ],
      attributes: ['id', 'tanggal_booking', 'tanggal_penanganan', 'id_kendaraan', 'keluhan', 'no_antrian', 'waktu', 'status'], 
    });

    if (!booking) {
      return res.status(404).json({ error: 'Data booking tidak ditemukan' });
    }

    res.json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ error: 'Gagal mengambil data booking', details: error.message });
  }
});



app.get('/booking/kendaraan/:id_kendaraan', async (req, res) => {
  try {
      const booking = await db.Booking.findOne({
          where: { id_kendaraan: req.params.id_kendaraan },
          include: [
              { 
                  model: db.Kendaraan, 
                  as: 'kendaraan', 
                  include: [
                      { model: db.Pelanggan, as: 'pelanggan' } 
                  ] 
              }
          ]
      });

      if (!booking) {
          return res.status(404).json({ message: 'Data booking tidak ditemukan' });
      }

      res.json(booking);
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
});

const moment = require('moment');

app.get('/antrian/:tanggal', async (req, res) => {
  try {
    const { tanggal } = req.params;
    console.log('Tanggal diterima dari request:', tanggal);

   
    const formattedDate = moment(tanggal, 'YYYY-MM-DD', true).isValid()
      ? moment(tanggal).format('YYYY-MM-DD')
      : null;

    if (!formattedDate) {
      return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD.' });
    }

    console.log('Tanggal setelah format:', formattedDate);

  
    const count = await db.Booking.count({
      where: {
        tanggal_booking: {
          [db.Sequelize.Op.between]: [`${formattedDate} 00:00:00`, `${formattedDate} 23:59:59`],
        },
      },
    });

    console.log('Jumlah antrian pada tanggal', formattedDate, ':', count);

    res.status(200).json(count);
  } catch (error) {
    console.error('Error fetching queue count:', error);
    res.status(500).json({ error: 'Failed to fetch queue count' });
  }
});

// create booking
app.post('/booking', async (req, res) => {
  console.log('Data booking diterima:', req.body);

  try {
    let {
      id_kendaraan,
      tanggal_booking,
      tanggal_penanganan,
      waktu,
      keluhan,
      status
    } = req.body;

    if (!id_kendaraan || !tanggal_booking || !keluhan) {
      return res.status(400).json({ error: 'Semua field wajib diisi' });
    }

 
    const formattedDate = moment(tanggal_booking).tz('Asia/Jakarta').format('YYYY-MM-DD');


    if (status === "tunggu") {
      waktu = null;
    } else if (!waktu || !moment(waktu, "HH:mm", true).isValid()) {
      return res.status(400).json({ error: "Format waktu tidak valid!" });
    }


    const startOfDayUTC = moment(tanggal_booking).tz('Asia/Jakarta').startOf('day').utc().format('YYYY-MM-DD HH:mm:ss');
    const endOfDayUTC = moment(tanggal_booking).tz('Asia/Jakarta').endOf('day').utc().format('YYYY-MM-DD HH:mm:ss');

    console.log('Rentang waktu UTC:', startOfDayUTC, 'sampai', endOfDayUTC);

    if (waktu) {
      const existingBooking = await db.Booking.findOne({
        where: {
          tanggal_booking: {
            [db.Sequelize.Op.between]: [startOfDayUTC, endOfDayUTC],
          },
          waktu,
        },
      });

      if (existingBooking) {
        return res.status(400).json({ error: `Booking sudah ada pada ${waktu} tanggal ${formattedDate}` });
      }
    }

    
    const count = await db.Booking.count({
      where: {
        tanggal_booking: {
          [db.Sequelize.Op.between]: [startOfDayUTC, endOfDayUTC],
        },
      },
    });

    console.log('Jumlah booking ditemukan untuk tanggal', formattedDate, ':', count);

    const no_antrian = count + 1;

 
    const newBooking = await db.Booking.create({
      id_kendaraan,
      tanggal_booking: moment(tanggal_booking).tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss'),
      tanggal_penanganan,
      waktu,
      keluhan,
      no_antrian,
      status,
    });

    res.status(201).json({ message: 'Booking berhasil dibuat', booking: newBooking });

  } catch (error) {
    console.error('Gagal membuat booking:', error);
    res.status(500).json({ error: 'Terjadi kesalahan pada server', details: error.message });
  }
});

//  Edit Booking

app.put('/booking/:id', async (req, res) => {
  try {
    console.log('Data diterima untuk update:', req.body);

    const { id_kendaraan, tanggal_booking, tanggal_penanganan, keluhan, no_antrian, waktu, status } = req.body;

    const booking = await db.Booking.findByPk(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking tidak ditemukan' });
    }

    let updateData = {
      id_kendaraan: id_kendaraan || booking.id_kendaraan,
      tanggal_booking: tanggal_booking || booking.tanggal_booking,
      tanggal_penanganan: tanggal_penanganan || booking.tanggal_penanganan,
      keluhan: keluhan || booking.keluhan,
      no_antrian: no_antrian || booking.no_antrian,
      waktu: waktu || booking.waktu,
      status: status || booking.status
    };

    if (status !== "setuju") {
      updateData.waktu = null; 
    }

    await booking.update(updateData);

    res.json({ message: 'Booking updated successfully', booking });
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ error: 'Failed to update booking', details: error.message });
  }
});



// hapus data booking
app.delete('/booking/:id', async (req, res) => {
  try {
    const booking = await db.Booking.findByPk(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'jasa service not found' });
    }

    await booking.destroy();
    res.json({ message: 'booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(400).json({ error: 'Failed to delete booking', details: error.message });
  }
});

// get riwayat
app.get('/riwayat', async (req, res) => {
  try {
    const riwayat = await db.Riwayat.findAll({
      include: [
        {
          model: db.Kendaraan,
          as: 'kendaraan',
          include: [
            {
              model: db.Pelanggan,
              as: 'pelanggan',
              attributes: ['id','nama', 'ktp'], 
            },
          ],
          attributes: ['id','id_pelanggan','nopol', 'merek'], 
        },
        {
          model: db.Jasaservice,
          as: 'jasa',
          attributes: ['id','jenis', 'harga'], 
        },
        {
        
          model: db.Sparepart,
          as: 'spareparts',
         
          through: {
            attributes: ['harga_jual','harga_beli','jumlah_sparepart']
          },
          attributes: ['id','nama','jumlah','harga_jual','harga_beli'], 
        },
        {
          model: db.Karyawan,
          as: 'karyawan',
          attributes: ['id','nama'], 
        },
      ],
      attributes: ['id', 'tanggal', 'keluhan', 'penanganan', 'catatan', 'total_harga','subtotal', 'status'], 
    });

    res.json(riwayat);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching riwayat', details: err.message });
  }
});


// get riwayat darii id

app.get('/riwayat/:id', async (req, res) => {
  try {
    const { id } = req.params; 
    const pelangganId = req.query.pelangganId;

    console.log('🔹 Request Diterima - ID Riwayat:', id);
    console.log('🔹 pelangganId:', pelangganId);


    if (!pelangganId) {
      return res.status(400).json({ error: 'pelangganId diperlukan' });
    }

    const riwayat = await db.Riwayat.findOne({
      where: { id }, 
      include: [
        {
          model: db.Kendaraan,
          as: 'kendaraan',
          where: { id_pelanggan: pelangganId }, 
          include: [
            {
              model: db.Pelanggan,
              as: 'pelanggan',
              attributes: ['id', 'nama', 'ktp'], 
            },
          ],
          attributes: ['id', 'nopol'], 
        },
        {
          model: db.Jasaservice,
          as: 'jasa',
          attributes: ['id', 'jenis', 'harga'], 
        },
        {
          model: db.Sparepart,
          as: 'sparepart',
          attributes: ['id', 'nama', 'jumlah', 'harga_jual'], 
        },
        {
          model: db.Karyawan,
          as: 'karyawan',
          attributes: ['id', 'nama'], 
        },
      ],
      attributes: ['id', 'tanggal', 'keluhan', 'penanganan', 'catatan', 'total_harga', 'status'], 
    });

    console.log('🔹 Data Riwayat dari DB:', JSON.stringify(riwayat, null, 2));

    if (!riwayat) {
      return res.status(404).json({ error: 'Riwayat tidak ditemukan atau bukan milik pelanggan ini' });
    }

    res.json(riwayat);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching riwayat', details: err.message });
  }
});


// create riwayat

app.post('/riwayat', async (req, res) => {
  const {
    tanggal, keluhan, penanganan, catatan,
    id_karyawan, id_kendaraan, id_jasa,
    total_harga, status, spareparts 
  } = req.body;

  if (!spareparts || spareparts.length === 0) {
    return res.status(400).json({ message: "Minimal satu sparepart harus dipilih!" });
  }

  const transaction = await db.sequelize.transaction();

  try {
 
    const jasa = await db.Jasaservice.findByPk(id_jasa, { transaction });
    if (!jasa) {
      await transaction.rollback();
      return res.status(404).json({ message: "Jasa tidak ditemukan" });
    }

   
    let sparepartsSum = 0;
    
    const sparepartsDetails = [];

    for (let item of spareparts) {
      const sparepart = await db.Sparepart.findByPk(item.id_sparepart, { transaction });
      if (!sparepart || sparepart.jumlah < item.jumlah_sparepart) {
        await transaction.rollback();
        return res.status(400).json({ message: `Stok sparepart ID ${item.id_sparepart} tidak cukup!` });
      }
      sparepartsSum += (sparepart.harga_jual - sparepart.harga_beli) * item.jumlah_sparepart;
      sparepartsDetails.push({ item, sparepart });
    }

    
    const subtotal = jasa.harga + sparepartsSum;

  
    const riwayat = await db.Riwayat.create({
      tanggal,
      keluhan,
      penanganan,
      catatan,
      id_karyawan,
      id_kendaraan,
      id_jasa,
      total_harga,
      status,
      subtotal  
    }, { transaction });

    
    for (let detail of sparepartsDetails) {
      const { item, sparepart } = detail;
    
      sparepart.jumlah -= item.jumlah_sparepart;
      await sparepart.save({ transaction });

 
      await db.RiwayatSparepart.create({
        riwayat_id: riwayat.id,
        sparepart_id: item.id_sparepart,
        jumlah_sparepart: item.jumlah_sparepart,
        harga_jual: sparepart.harga_jual,
        harga_beli: sparepart.harga_beli
      }, { transaction });
    }

    await transaction.commit();

    res.json({ message: "Riwayat berhasil disimpan!", riwayat });
  } catch (error) {
    await transaction.rollback();
    console.error("Error saat menyimpan riwayat:", error);
    res.status(500).json({ message: "Terjadi kesalahan", error: error.message });
  }
});





// edit riwayat

app.put('/riwayat/:id', async (req, res) => {
  try {
    const riwayat = await db.Riwayat.findByPk(req.params.id);
    if (!riwayat) return res.status(404).json({ error: 'Riwayat tidak ditemukan' });

    let totalHarga = riwayat.total_harga;

    if (req.body.jasa_id || req.body.sparepart_id) {
      const jasa = req.body.jasa_id ? await db.Jasaservice.findByPk(req.body.jasa_id) : null;
      const sparepart = req.body.sparepart_id ? await db.Sparepart.findByPk(req.body.sparepart_id) : null;

      const hargaJasa = jasa ? jasa.harga : riwayat.jasa_harga;
      const hargaSparepart = sparepart ? sparepart.harga : riwayat.sparepart_harga;
      const jumlahSparepart = req.body.jumlah_sparepart || riwayat.jumlah_sparepart || 1;

      totalHarga = hargaJasa + (hargaSparepart * jumlahSparepart);
    }

    await riwayat.update({ ...req.body, total_harga: totalHarga });

    res.json(riwayat);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengedit riwayat', details: error.message });
  }
});


// hapus data riwayat
app.delete('/riwayat/:id', async (req, res) => {
  try {
    const riwayat = await db.Riwayat.findByPk(req.params.id);
    if (!riwayat) {
      return res.status(404).json({ error: 'jasa service not found' });
    }

    await riwayat.destroy();
    res.json({ message: 'riwayat deleted successfully' });
  } catch (error) {
    console.error('Error deleting riwayat:', error);
    res.status(400).json({ error: 'Failed to delete riwayat', details: error.message });
  }
});




app.get('/laporan-bulanan', async (req, res) => {
  const { month, year, page, limit } = req.query;
  if (!month || !year) {
    return res.status(400).json({ message: "Parameter month dan year wajib!" });
  }

  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 10;
  const offset = (pageNum - 1) * limitNum;

  
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);

  try {
    const result = await db.Riwayat.findAndCountAll({
      where: {
        tanggal: {
          [Op.between]: [startDate, endDate]
        }
      },
      include: [
        {
          model: db.Kendaraan,
          as: 'kendaraan',
          include: [{
            model: db.Pelanggan,
            as: 'pelanggan',
            attributes: ['id', 'nama', 'ktp']
          }],
          attributes: ['id', 'id_pelanggan', 'nopol', 'merek']
        },
        {
          model: db.Karyawan,
          as: 'karyawan',
          attributes: ['id', 'nama']
        },
        {
          model: db.Jasaservice,
          as: 'jasa',
          attributes: ['id', 'jenis', 'harga']
        },
        {
          model: db.Sparepart,
          as: 'spareparts',
          through: {
            attributes: ['jumlah_sparepart', 'harga_jual', 'harga_beli']
          },
          attributes: ['id', 'nama']
        }
      ],
      attributes: ['id', 'tanggal', 'subtotal'],
      distinct: true,
      limit: limitNum,
      offset: offset,
      order: [['id', 'ASC']]
    });

    res.json({
      total: result.count,
      page: pageNum,
      pages: Math.ceil(result.count / limitNum),
      data: result.rows
    });
  } catch (err) {
    console.error("Error fetching laporan bulanan:", err);
    res.status(500).json({ message: "Error fetching laporan bulanan", details: err.message });
  }
});





app.get('/laporan-bulanan-summary', async (req, res) => {
  const { month, year } = req.query;
  if (!month || !year) {
    return res.status(400).json({ message: "Parameter month dan year wajib!" });
  }

  const startDate = new Date(year, month - 1, 1);
  
  try {
    const summary = await db.LaporanBulanan.findOne({
      where: {
        tanggal: startDate
      },
      attributes: ['total_keuntungan']
    });
    if (summary) {
      res.json({ total_keuntungan: summary.total_keuntungan });
    } else {
      res.json({ total_keuntungan: 0 });
    }
  } catch (err) {
    console.error("Error fetching laporan_bulanan summary:", err);
    res.status(500).json({ message: "Error fetching summary", details: err.message });
  }
});



app.listen(3000, () => console.log('Server running on http://localhost:4200'));
