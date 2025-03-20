import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SemuaService } from 'src/app/semua.service';
import { PopupKonfirmasiComponent } from 'src/app/dashboard-admin/popup-konfirmasi/popup-konfirmasi.component';

@Component({
  selector: 'app-popup-booking',
  templateUrl: './popup-booking.component.html',
  styleUrls: ['./popup-booking.component.css']
})
export class PopupBookingComponent {

  booking: any = { nopol: '', waktu: '', tanggal_booking: '', status: 'tunggu' };
  pelangganList: any[] = [];
  kendaraanList: any[] = [];
  errorMessage: string = '';
  minDate: string = '';

  constructor(
    private service: SemuaService,
    public dialogRef: MatDialogRef<PopupBookingComponent>,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log("📝 Data yang diterima dari dialog:", data);
    if (data) this.booking = { ...data };
  }

  ngOnInit() {
    this.loadPelanggan();
    this.loadPelangganLogin();
  
    this.minDate = new Date().toISOString().split('T')[0];
    
    this.booking.tanggal_booking = this.minDate;
  
    if (this.booking.id) {
      console.log('📌 Data booking saat Edit:', this.booking);
     
      if (this.booking.id_kendaraan) {
        console.log('🚗 Menggunakan booking.id_kendaraan:', this.booking.id_kendaraan);
      } else if (this.booking.kendaraan && this.booking.kendaraan.id) {
        console.log('🚗 Mendapatkan id dari booking.kendaraan:', this.booking.kendaraan);
        this.booking.id_kendaraan = this.booking.kendaraan.id;
      } else {
        console.warn("🚨 ID Kendaraan tidak ditemukan dalam booking!");
        this.booking.id_kendaraan = '';
      }
    }
  }
  
  
  
  
  

  loadPelanggan() {
    this.service.getPelanggan().subscribe((res: any) => {
      this.pelangganList = res;
    });
  }

  loadPelangganLogin() {
    const pelangganId = localStorage.getItem('pelangganId');
    if (pelangganId) {
      this.booking.pelanggan_id = pelangganId;
      this.service.getPelangganById(pelangganId).subscribe((data: any) => {
        if (data) {
          this.booking.nama_pelanggan = data.nama;
          console.log("👤 Pelanggan ditemukan:", data);
          this.loadKendaraanByPelanggan(pelangganId);
        } else {
          this.booking.nama_pelanggan = 'Tidak Ditemukan';
        }
      }, error => {
        console.error('❌ Gagal mengambil data pelanggan:', error);
        this.booking.nama_pelanggan = 'Tidak Ditemukan';
      });
    }
  }

  loadKendaraanByPelanggan(pelangganId: string) {
    if (!pelangganId) {
      console.warn("⚠️ Tidak ada pelanggan ID, kendaraan tidak di-load.");
      return;
    }
    console.log("🚗 Memuat kendaraan untuk pelanggan ID:", pelangganId);
    this.service.getKendaraanByPelanggan(pelangganId).subscribe({
      next: (res: any) => {
        if (Array.isArray(res)) {
          this.kendaraanList = res.filter((kendaraan: any) => !kendaraan.dalamBooking);
          console.log("✅ Kendaraan yang tersedia:", this.kendaraanList);
        } else {
          console.error("⚠️ Response bukan array:", res);
          this.kendaraanList = [];
        }
       
        if (!this.booking.id_kendaraan) {
          this.booking.id_kendaraan = this.kendaraanList.length > 0 ? this.kendaraanList[0].id : null;
        }

      },
      error: (err) => {
        console.error("❌ Error mengambil kendaraan:", err);
        alert("Gagal mengambil data kendaraan. Silakan coba lagi.");
        this.kendaraanList = [];
      }
    });
  }

  getNamaPelanggan(): string {
    if (this.booking.kendaraan && this.booking.kendaraan.pelanggan) {
      return this.booking.kendaraan.pelanggan.nama;
    }
    return 'Tidak Ditemukan';
  }

  onTanggalBookingChange() {
    const tanggal = this.booking.tanggal_booking;
    if (tanggal) {
      const now = new Date();
      const selectedDate = new Date(tanggal);
      

      if (selectedDate.toDateString() === now.toDateString()) {
        const currentHour = now.getHours();
        if (currentHour < 7 || currentHour >= 16) {
          alert("Booking hanya bisa dilakukan antara pukul 07:00 - 16:00. Silakan pilih tanggal lain.");
    
          return;
        }
      }
    
  
      this.service.getAntrianByDate(tanggal).subscribe(
        (count: number) => {
          console.log("Jumlah antrian untuk tanggal ini:", count);
          this.booking.no_antrian = count + 1;
          this.booking.status = "tunggu";
          this.booking.waktu = "";
          console.log("Booking awal (slot dialokasikan, waktu belum diisi):", this.booking);
        },
        (error) => {
          console.error("Gagal mendapatkan jumlah antrian:", error);
          alert("Gagal mendapatkan jumlah antrian. Coba lagi.");
        }
      );
    }
  }
  

  onStatusChange() {
    if (this.booking.status === "setuju") {
      const tanggal = this.booking.tanggal_booking;
      const currentDate = new Date();
      const selectedDate = new Date(tanggal);
      const isToday = currentDate.toDateString() === selectedDate.toDateString();

      let startHour = 7;
      let endHour = 16;

      if (isToday) {
        const currentHour = currentDate.getHours();
        if (currentHour < startHour || currentHour >= endHour) {
          alert("Booking sudah penuh di luar jam booking (07:00 - 16:00).");
          this.booking.status = "tunggu";
          return;
        }
   
        const startTime = `${String(currentHour).padStart(2, "0")}:${String(currentDate.getMinutes()).padStart(2, "0")}`;
        const endTime = `${String(Math.min(currentHour + 1, endHour)).padStart(2, "0")}:${String(currentDate.getMinutes()).padStart(2, "0")}`;
        this.booking.waktu = `${startTime} - ${endTime}`;
      } else {
        const hourSlot = this.booking.no_antrian - 1;
        const startTime = `${String(startHour + hourSlot).padStart(2, "0")}:00`;
        const endTime = `${String(startHour + hourSlot + 1).padStart(2, "0")}:00`;
        if (parseInt(startTime) >= endHour) {
          alert("Jam booking sudah penuh untuk tanggal ini.");
          this.booking.status = "tunggu";
          return;
        }
        this.booking.waktu = `${startTime} - ${endTime}`;
      }
      console.log("Waktu diisi setelah status setuju:", this.booking.waktu);
    }
  }

  simpan() {
    let dataToSend = { ...this.booking };
  
    if (!this.booking.id_kendaraan || this.booking.id_kendaraan === '') {
      alert("🚨 ID Kendaraan tidak ditemukan! Pilih kendaraan terlebih dahulu.");
      return;
    }
  
    delete dataToSend.kendaraan;
    delete dataToSend.pelanggan;
  
    console.log('Data booking yang dikirim ke backend:', dataToSend);
  
    if (!dataToSend.tanggal_booking) {
      alert('Tanggal booking harus diisi!');
      return;
    }
  
   
    if (!dataToSend.status) {
      dataToSend.status = "tunggu";
    }
  
   
    if (dataToSend.status === "tunggu") {
      dataToSend.waktu = null;
    }
  
    const dialogRef = this.dialog.open(PopupKonfirmasiComponent, { width: '300px' });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (dataToSend.id) {
          this.service.editBooking(dataToSend.id, dataToSend).subscribe(
            (res) => {
              console.log('✅ Booking berhasil diperbarui:', res);
              this.dialogRef.close(true);
            },
            (error) => {
              console.error('❌ Gagal memperbarui booking:', error);
           
            }
          );
        } else {
          this.service.tambahBooking(dataToSend).subscribe(
            (res) => {
              console.log('✅ Booking berhasil ditambahkan:', res);
              this.snackBar.open("Booking berhasil ditambahkan, lihat di jadwal Booking", "Tutup", {
                duration: 3000,
                horizontalPosition: "center",
                verticalPosition: "top"
              });
              this.dialogRef.close(true);
            },
            (error) => {
              console.error('❌ Gagal menambahkan booking:', error);
             
            }
          );
        }
      }
    });
  }
  
  
}
