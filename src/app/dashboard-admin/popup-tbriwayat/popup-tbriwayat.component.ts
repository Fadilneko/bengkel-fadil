import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { SemuaService } from 'src/app/semua.service';
import { EventEmitter, Output } from '@angular/core';
import { PopupKonfirmasiComponent } from '../popup-konfirmasi/popup-konfirmasi.component';
import { NotificationService } from 'src/app/notification.service';


@Component({
  selector: 'app-popup-tbriwayat',
  templateUrl: './popup-tbriwayat.component.html',
  styleUrls: ['./popup-tbriwayat.component.css']
})
export class PopupTbriwayatComponent implements OnInit {

  riwayat: any = {
    id_jasa: 0, id_sparepart: 0, id_karyawan: 0, id_pelanggan: 0, id_kendaraan: 0, jumlah_sparepart: 1,
    harga_jasa: 0, harga_sparepart: 0, total_harga: 0
  };
  jasaList: any[] = [];
  sparepartList: any[] = [];
  karyawanList: any[] = [];
  pelangganList: any[] = [];
  kendaraanList: any[] = [];
  bookingList: any[] = [];
  isEdit: boolean = false;
  sparepartsForm: any[] = [];

  @Output() dataUpdated = new EventEmitter<void>();

  constructor(
    private service: SemuaService,
    public dialogRef: MatDialogRef<PopupTbriwayatComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notificationService: NotificationService,
    private dialog: MatDialog,
    
  ) {
    console.log("📢 Data Booking yang Dikirim ke Popup:", this.data);
    this.isEdit = !!data?.id;

    this.riwayat = {
      id: null,
      id_jasa: null,
      id_karyawan: null,
      id_pelanggan: data.kendaraan?.id_pelanggan || '',
      nama_pelanggan: data.kendaraan?.pelanggan?.nama || '',
      id_kendaraan: data.id_kendaraan,
      nopol: data.kendaraan?.nopol || '',
      tanggal: data.tanggal_penanganan || '',
      keluhan: data.keluhan || '',
      penanganan: '',
      catatan: '',
      harga_jasa: null,
      total_harga: null,
      status: 'Selesai' 
    };

    if (!data || !data.id) {
      this.sparepartsForm = [{
        id_sparepart: null,
        jumlah_sparepart: 1,
        harga_sparepart: 0
      }];
    } else {
      this.sparepartsForm = data.spareparts || [{
        id_sparepart: data.id_sparepart,
        jumlah_sparepart: data.jumlah_sparepart,
        harga_sparepart: data.harga_sparepart
      }];
    }

    if (data) {

      this.isEdit = true;
      console.log("📥 Data diterima untuk edit:", data);
  
      
      this.riwayat = { ...data };
  
      console.log('Riwayat Data:', this.riwayat);
  
     
      this.riwayat.id_jasa = Number(this.riwayat.id_jasa);
      this.riwayat.id_sparepart = Number(this.riwayat.id_sparepart);
      this.riwayat.id_karyawan = Number(this.riwayat.id_karyawan);
      this.riwayat.id_pelanggan = Number(this.riwayat.id_pelanggan);
      this.riwayat.id_kendaraan = Number(this.riwayat.id_kendaraan);
    }
  }
  
  ngOnInit() {
    this.loadData(); 
  
    if (this.isEdit) {
      console.log("Sebelum loadSelectedData, id_karyawan:", this.riwayat.id_karyawan);
      this.loadSelectedData();
      console.log("Sesudah loadSelectedData, id_karyawan:", this.riwayat.id_karyawan);
    }
  }
  
  
  
  loadData() {
    this.service.getJasaservice().subscribe((res: any) => {
      this.jasaList = res;
      console.log('Data jasa service:', this.jasaList); 
    });
    this.service.getSparepart().subscribe((res: any) => {
      this.sparepartList = res;
      console.log('Data sparepart:', this.sparepartList); 
    });
    this.service.getKaryawan().subscribe((res: any) => this.karyawanList = res);
    this.service.getPelanggan().subscribe((res: any) => this.pelangganList = res);
    this.service.getBooking().subscribe((res: any) => {
      this.bookingList = res;
      console.log("📋 Data Booking:", this.bookingList);
    
   
      const selesaiBookings = this.bookingList.filter((b: any) => b.status === 'selesai');
      console.log("📋 Booking dengan status selesai:", selesaiBookings);
    
 
      const selesaiKendaraanIds = selesaiBookings.map((b: any) => b.id_kendaraan);
      console.log("🔍 ID Kendaraan yang Selesai:", selesaiKendaraanIds);
    
      this.service.getKendaraan().subscribe((kendaraanRes: any) => {
        console.log("🚗 Daftar Kendaraan yang Didapat:", kendaraanRes);
    
 
        const kendaraanSelesai = kendaraanRes
          .filter((k: { id: number; nopol: string }) => selesaiKendaraanIds.includes(k.id))
          .map((k: any) => {
           
            const bookingData = this.bookingList.find((b: any) => b.id_kendaraan === k.id);
            return {
              ...k,
              status: bookingData ? bookingData.status : 'Tidak Diketahui', 
            };
          });
    
        console.log("🚗 Kendaraan dengan Status Booking:", kendaraanSelesai);
    
     
        this.kendaraanList = kendaraanSelesai;
      });
    });
    
    
    
  }

  loadSelectedData() {
    if (this.isEdit && this.riwayat.karyawan?.id) {
      this.service.getKaryawan().subscribe((res: any) => {
        this.karyawanList = res;
    
        setTimeout(() => {
          const selectedKaryawan = this.karyawanList.find(k => k.id == this.riwayat.karyawan.id);
          if (selectedKaryawan) {
            this.riwayat.id_karyawan = selectedKaryawan.id;
          }
        }, 100);
      });
    }

    if (this.isEdit && this.riwayat.kendaraan?.id) {
      this.service.getKendaraan().subscribe((res: any) => {
        this.kendaraanList = res;
    
        setTimeout(() => {
          const selectedkendaraan = this.kendaraanList.find(k => k.id == this.riwayat.kendaraan.id);
          if (selectedkendaraan) {
            this.riwayat.id_kendaraan = selectedkendaraan.id;
            this.riwayat.id_pelanggan = selectedkendaraan.id_pelanggan;
            this.riwayat.nama_pelanggan = selectedkendaraan.pelanggan?.nama || 'Tidak Diketahui';

            this.onKendaraanChange(selectedkendaraan.id);
          }
        }, 100);
      });
    }

    if (this.isEdit && this.riwayat.jasa?.id) {
      this.service.getJasaservice().subscribe((res: any) => {
        this.jasaList = res;
    
        setTimeout(() => {
          const selectedjasa = this.jasaList.find(k => k.id == this.riwayat.jasa.id);
          if (selectedjasa) {
            this.riwayat.id_jasa = selectedjasa.id;
            this.riwayat.harga_jasa = selectedjasa.harga;
          }
        }, 100);
      });
    }
  
    
    if (this.isEdit && this.riwayat.sparepart?.id) {
      this.service.getSparepart().subscribe((res: any) => {
        this.sparepartList = res;
    
        setTimeout(() => {
          const selectedsparepart = this.sparepartList.find(k => k.id == this.riwayat.sparepart.id);
          if (selectedsparepart) {
            this.riwayat.id_sparepart = selectedsparepart.id;
            this.riwayat.harga_sparepart = selectedsparepart.harga;
          }
        }, 100);
      });
    }
    }
    
  
  
  onKendaraanChange(kendaraanId: number) { 
    if (!kendaraanId) return;
  
    console.log("🔄 Kendaraan ID dipilih:", kendaraanId);
  
    this.service.getBookingByKendaraan(kendaraanId).subscribe((res: any) => {
      console.log("📋 Data Booking yang ditemukan:", res);
  
      if (res) {
        this.riwayat.id_pelanggan = res.id_pelanggan;
        this.riwayat.nama_pelanggan = res.kendaraan?.pelanggan?.nama || 'Tidak Ada';
        this.riwayat.keluhan = res.keluhan;
        this.riwayat.status = res.status || 'Tunggu'; 
  
        console.log("🛠️ Data riwayat setelah update:", this.riwayat);
      } else {
        console.log("❌ Tidak ada data booking yang ditemukan.");
      }
    });
  }
  
  

  getNoPolisi(): string {
    console.log("🔍 Mencari kendaraan dengan ID:", this.riwayat.id_kendaraan);
    console.log("🚗 Daftar Kendaraan:", this.kendaraanList);
  
    const kendaraan = this.kendaraanList.find(k => String(k.id) === String(this.riwayat.id_kendaraan));

    
    if (!this.kendaraanList.length) {
      console.log("⚠️ Kendaraan list masih kosong!");
      return "Tidak Ditemukan";
    }
     else {
      console.log("❌ Kendaraan tidak ditemukan di kendaraanList!");
    }
  
    return kendaraan ? kendaraan.nopol : 'Tidak Ditemukan';
  }
  
  
  
  getNamaPelanggan(): string {
    const pelanggan = this.pelangganList.find(p => p.id === this.riwayat.id_pelanggan);
    return pelanggan ? pelanggan.nama : 'Tidak Ditemukan';
  }

  loadKendaraan() {
    if (this.riwayat.id_pelanggan) {
      this.service.getKendaraanByPelanggan(this.riwayat.id_pelanggan).subscribe((res: any) => {
        this.kendaraanList = res;
      });
    }
  }

  onJasaChange() {
    console.log('Jasa ID yang dipilih:', this.riwayat.id_jasa);
    console.log('Daftar Jasa:', this.jasaList);
    
    const selectedJasa = this.jasaList.find(j => String(j.id) === String(this.riwayat.id_jasa));
  
    console.log('Jasa yang ditemukan:', selectedJasa);
  
    this.riwayat.harga_jasa = selectedJasa ? selectedJasa.harga : 0;
    console.log("🛠️ Jasa yang dipilih:", selectedJasa);

    this.updateTotalHarga();
  }
  
  addSparepartRow() {
    this.sparepartsForm.push({
      id_sparepart: null,
      jumlah_sparepart: 1,
      harga_sparepart: 0
    });
  }


  removeSparepartRow(index: number) {
    if (this.sparepartsForm.length > 1) {
      this.sparepartsForm.splice(index, 1);
      this.updateTotalHarga();
    }
  }

  onSparepartChange(index: number) {
    const selectedId = this.sparepartsForm[index].id_sparepart;
    const selectedSparepart = this.sparepartList.find(s => s.id == selectedId);
    if (selectedSparepart) {
      this.sparepartsForm[index].harga_sparepart = selectedSparepart.harga_jual;
    } else {
      this.sparepartsForm[index].harga_sparepart = 0;
    }
    this.updateTotalHarga();
  }
  

  updateTotalHarga() {
    let sparepartTotal = 0;
    this.sparepartsForm.forEach(item => {
      sparepartTotal += (item.harga_sparepart || 0) * (item.jumlah_sparepart || 1);
    });
    this.riwayat.total_harga = (this.riwayat.harga_jasa || 0) + sparepartTotal;
  }

  kurangiStokSparepart(sparepartId: number, jumlah: number) {
    console.log("📌 ID Sparepart:", sparepartId);
    console.log("📌 Jumlah dikurangi:", jumlah);

    if (!sparepartId || jumlah <= 0) {
        console.log("❌ Sparepart ID atau jumlah tidak valid.");
        return;
    }

    console.log("🔄 Mengurangi stok sparepart:", sparepartId, "Jumlah:", jumlah);

    this.service.updateSparepartStock(sparepartId, jumlah).subscribe(
        res => {
            console.log("✅ Stok sparepart berhasil dikurangi:", res);
            this.loadData(); 
        },
        err => console.error("❌ Gagal mengurangi stok sparepart:", err)
    );
}


simpan() {
  const dialogRef = this.dialog.open(PopupKonfirmasiComponent, { width: '300px' });

  for (const item of this.sparepartsForm) {
    if (!item.id_sparepart || Number(item.id_sparepart) === 0) {
      alert("🚨 Silahkan pilih sparepart yang valid!");
      return;
    }
  }

  dialogRef.afterClosed().subscribe(result => {
      if (result) {
          console.log('📤 Data yang akan dikirim:', this.riwayat);

          const riwayatData = {
              tanggal: this.riwayat.tanggal,
              keluhan: this.riwayat.keluhan,
              penanganan: this.riwayat.penanganan,
              catatan: this.riwayat.catatan,
              id_karyawan: Number(this.riwayat.id_karyawan),
              id_kendaraan: Number(this.riwayat.id_kendaraan),
              id_jasa: Number(this.riwayat.id_jasa),
              spareparts: this.sparepartsForm,
              total_harga: Number(this.riwayat.total_harga),
              status: this.riwayat.status
          };

         
          if (this.isEdit && this.riwayat.id) {
            console.log("🔄 Mengedit riwayat dengan ID:", this.riwayat.id);
            this.service.editRiwayat(this.riwayat.id, riwayatData).subscribe(
              res => {
                console.log("✅ Riwayat berhasil diperbarui:", res);
                this.dialogRef.close(true);
              },
              err => console.error('❌ Gagal mengedit riwayat:', err)
            );
          } else {
            this.service.tambahRiwayat(riwayatData).subscribe(
              res => {
                console.log("✅ Riwayat berhasil ditambahkan:", res);
                this.dataUpdated.emit();
                this.dialogRef.close(true);
    
                console.log("📢 ID Booking yang akan dihapus:", this.riwayat.id_booking);
              // const message = "Service anda sudah selesai. Silakan cek Daftar Service Anda.";
              // this.notificationService.notify(message);
              // localStorage.setItem('pendingNotification', message);
                this.hapusBooking(this.riwayat.id_booking);
              },
              error => {
                console.error("❌ Gagal menyimpan riwayat:", error);
              }
            );
          }
        }
      });
  }


hapusBooking(bookingId: number) {
  this.service.hapusBooking(bookingId).subscribe(response => {
    console.log("🗑️ Data booking berhasil dihapus:", response);
    this.dialogRef.close(true); 
  }, error => {
    console.error("❌ Gagal menghapus booking:", error);
  });

}


compareFn = (option1: any, option2: any) => {
  return option1 && option2 ? option1 === option2 : option1 === option2;
};

  
}
