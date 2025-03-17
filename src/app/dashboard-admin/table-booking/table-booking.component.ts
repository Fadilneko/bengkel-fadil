import { Component, OnInit } from '@angular/core';
import { SemuaService } from 'src/app/semua.service';
import { MatDialog } from '@angular/material/dialog';
import { PopupTbbookingComponent } from '../popup-tbbooking/popup-tbbooking.component';
import { PopupKonfirmasiComponent } from '../popup-konfirmasi/popup-konfirmasi.component';
import { PopupTbriwayatComponent } from '../popup-tbriwayat/popup-tbriwayat.component';

@Component({
  selector: 'app-table-booking',
  templateUrl: './table-booking.component.html',
  styleUrls: ['./table-booking.component.css']
})
export class TableBookingComponent {
  bookingList: any[] = [];
    searchQuery: string = '';
    currentPage: number = 1;
    itemsPerPage: number = 5; 
  
    constructor(private bookingService: SemuaService, private dialog: MatDialog) {}
  
    ngOnInit() {
      this.loadbooking();
    }
  
    loadbooking() {
      this.bookingService.getBooking().subscribe(
        (data) => {
          this.bookingList = data;
        },
        (error) => {
          console.error('Gagal mengambil data booking:', error);
        }
      );
    }
  
    tambahbooking() {
      const dialogRef = this.dialog.open(PopupTbbookingComponent, {
        width: '600px',
        data: null,
      });
  
      dialogRef.afterClosed().subscribe((result) => {
        if (result) this.loadbooking();
      });
    }
  
    editbooking(booking: any) {
      const dialogRef = this.dialog.open(PopupTbbookingComponent, {
        width: '600px',
        data: booking,
      });
  
      dialogRef.afterClosed().subscribe((result) => {
        if (result) this.loadbooking();
      });
    }
  
    hapusbooking(id: number) {
      const dialogRef = this.dialog.open(PopupKonfirmasiComponent, {
        width: '300px',
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) { 
          this.bookingService.hapusBooking(id).subscribe(() => this.loadbooking());
        }
      });
    }

    aksiSelesai(bookingId: string) {
      this.bookingService.getBookingById(bookingId).subscribe((bookingData: any) => {
        console.log("✅ Data Booking yang Diterima:", bookingData);
    
        if (bookingData) {
          const newRiwayat = {
            id_booking: bookingData.id,
            id: null, 
            id_jasa: bookingData.id_jasa || null,
            id_sparepart: bookingData.id_sparepart || null,
            id_karyawan: bookingData.id_karyawan || null,
            id_pelanggan: bookingData.kendaraan?.id_pelanggan || null,
            nama_pelanggan: bookingData.kendaraan?.pelanggan?.nama || '',
            id_kendaraan: bookingData.id_kendaraan || null,
            nopol: bookingData.kendaraan?.nopol || '',
            tanggal: '',
            keluhan: bookingData.keluhan || '',
            penanganan: '',
            catatan: '',
            harga_jasa: bookingData.harga_jasa || null,
            harga_sparepart: bookingData.harga_sparepart || null,
            jumlah_sparepart: 1,
            total_harga: null,
            status: bookingData.status
          };
    
          console.log("📢 Data yang Dikirim ke Popup:", newRiwayat);
    
          const dialogRef = this.dialog.open(PopupTbriwayatComponent, {
            width: '600px',
            data: newRiwayat 
          });
    
          dialogRef.afterClosed().subscribe(result => {
            console.log("📢 Popup ditutup, hasil:", result);
            if (result) this.loadbooking();
          });
        }
      }, (error) => {
        console.error("❌ Gagal mengambil data booking:", error);
      });
    }
    
    
  
  
    filteredData() {
      let filtered = this.bookingList.filter(k =>
        k.keluhan.toLowerCase().includes(this.searchQuery.toLowerCase())
        
      );
  
      return filtered.slice((this.currentPage - 1) * this.itemsPerPage, this.currentPage * this.itemsPerPage);
    }
  
    totalPages(): number {
      return Math.ceil(this.bookingList.length / this.itemsPerPage);
    }
    
  
    startItem(): number {
      return (this.currentPage - 1) * this.itemsPerPage + 1;
    }
    
  
    endItem(): number {
      return Math.min(this.currentPage * this.itemsPerPage, this.bookingList.length);
    }
    
  
    getPages(): number[] {
      return Array.from({ length: this.totalPages() }, (_, i) => i + 1);
    }
    
  
    previousPage(): void {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    }
    
  
    nextPage(): void {
      if (this.currentPage < this.totalPages()) {
        this.currentPage++;
      }
    }
    
  
    goToPage(page: number): void {
      this.currentPage = page;
    }
    
  
    getPaginatedData(): any[] {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      return this.bookingList.slice(startIndex, startIndex + this.itemsPerPage);
    }
  }

