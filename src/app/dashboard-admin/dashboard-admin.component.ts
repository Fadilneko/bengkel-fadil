import { Component, OnInit } from '@angular/core';
import { SemuaService } from 'src/app/semua.service';

@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css']
})
export class DashboardAdminComponent implements OnInit {

  pelangganCount: number = 0;
  karyawanCount: number = 0;
  kendaraanCount: number = 0;

  totalPendapatan: number = 0;
  laporanBulanan: any[] = [];


  selectedMonth: number = new Date().getMonth() + 1;
  selectedYear: number = new Date().getFullYear();


  filterDate: string = new Date().toISOString().substring(0, 7);

  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;

  constructor(private service: SemuaService) {}

  ngOnInit(): void {
    this.loadCounts();
    this.loadLaporanBulanan();
    this.loadPendapatan();
  }

  loadCounts(): void {
    this.service.getPelanggan().subscribe((data: any[]) => { 
      this.pelangganCount = data.length; 
    });
    this.service.getKaryawan().subscribe((data: any[]) => { 
      this.karyawanCount = data.length; 
    });
    this.service.getKendaraan().subscribe((data: any[]) => { 
      this.kendaraanCount = data.length; 
    });
  }

  loadLaporanBulanan(): void {
    this.service.getLaporanBulanan(this.selectedMonth, this.selectedYear, this.currentPage, this.itemsPerPage)
      .subscribe((response: any) => {
         this.laporanBulanan = response.data;
         this.totalItems = response.total;
         console.log('Laporan Bulanan:', this.laporanBulanan);
      });
  }

  loadPendapatan(): void {
    this.service.getPendapatanTotal(this.selectedMonth, this.selectedYear)
      .subscribe((data: any) => {
        this.totalPendapatan = data.total_keuntungan;
        console.log('Total Pendapatan:', this.totalPendapatan);
      });
  }


  calculateTotalHargaBeli(riwayat: any): number {
    let totalBeli = 0;
    if (riwayat.spareparts && riwayat.spareparts.length > 0) {
      riwayat.spareparts.forEach((sp: any) => {
        const jumlah = sp.riwayat_sparepart?.jumlah_sparepart || 0;
        const hargaBeli = sp.riwayat_sparepart?.harga_beli || 0;
        totalBeli += hargaBeli * jumlah;
      });
    }
    return totalBeli;
  }

 
  calculateTotalHargaJual(riwayat: any): number {
    let totalJual = 0;
    if (riwayat.spareparts && riwayat.spareparts.length > 0) {
      riwayat.spareparts.forEach((sp: any) => {
        const jumlah = sp.riwayat_sparepart?.jumlah_sparepart || 0;
        const hargaJual = sp.riwayat_sparepart?.harga_jual || 0;
        totalJual += hargaJual * jumlah;
      });
    }
    return totalJual;
  }

 
  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  
  getPages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  onFilterDateChange(): void {
    if (this.filterDate) {
   
      const [year, month] = this.filterDate.split('-').map(val => +val);
      this.selectedYear = year;
      this.selectedMonth = month;
    } else {
      const now = new Date();
      this.selectedMonth = now.getMonth() + 1;
      this.selectedYear = now.getFullYear();
    }
    this.currentPage = 1;
    this.loadLaporanBulanan();
    this.loadPendapatan();
  }

  resetFilter(): void {
    
    this.filterDate = new Date().toISOString().substring(0, 7);
    const now = new Date();
    this.selectedMonth = now.getMonth() + 1;
    this.selectedYear = now.getFullYear();
    this.currentPage = 1;
    this.loadLaporanBulanan();
    this.loadPendapatan();
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.loadLaporanBulanan();
  }
}
