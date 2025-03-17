import { Component, OnInit } from '@angular/core';
import { SemuaService } from 'src/app/semua.service';

@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css']
})
export class DashboardAdminComponent implements OnInit {

  // Grid counts
  pelangganCount: number = 0;
  karyawanCount: number = 0;
  kendaraanCount: number = 0;

  

  // Laporan Bulanan & Pendapatan
  totalPendapatan: number = 0;
  laporanBulanan: any[] = [];

  // Parameter laporan
  selectedMonth: number = new Date().getMonth() + 1;
  selectedYear: number = new Date().getFullYear();

  filterDate: string = '';

  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  math = Math;

  constructor(private service: SemuaService) {}

  ngOnInit(): void {
    this.loadCounts();
    if (!this.filterDate) {
      const now = new Date();
      this.selectedMonth = now.getMonth() + 1;
      this.selectedYear = now.getFullYear();
    }
    this.loadLaporanBulanan();
    this.loadPendapatan();
  }

  loadCounts(): void {
    this.service.getPelanggan().subscribe((data: any[]) => { this.pelangganCount = data.length; });
    this.service.getKaryawan().subscribe((data: any[]) => { this.karyawanCount = data.length; });
    this.service.getKendaraan().subscribe((data: any[]) => { this.kendaraanCount = data.length; });
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
    this.service.getPendapatanTotal(this.selectedMonth, this.selectedYear).subscribe((data: any) => {
      this.totalPendapatan = data.total_keuntungan;
      console.log('Total Pendapatan:', this.totalPendapatan);
    });
  }

   
  calculateTotalHargaBeli(riwayat: any): number {
    let totalBeli = 0;
    if (riwayat.spareparts && riwayat.spareparts.length) {
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
    if (riwayat.spareparts && riwayat.spareparts.length) {
      riwayat.spareparts.forEach((sp: any) => {
        const jumlah = sp.riwayat_sparepart?.jumlah_sparepart || 0;
        const hargaJual = sp.riwayat_sparepart?.harga_jual || 0;
        totalJual += hargaJual * jumlah;
      });
    }
    return totalJual;
  }

  onFilterDateChange(): void {
    if (this.filterDate) {
      let d = new Date(this.filterDate);
      this.selectedMonth = d.getMonth() + 1;
      this.selectedYear = d.getFullYear();
    } else {
      let d = new Date();
      this.selectedMonth = d.getMonth() + 1;
      this.selectedYear = d.getFullYear();
    }
    this.currentPage = 1;
    this.loadLaporanBulanan();
    this.loadPendapatan();
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.loadLaporanBulanan();
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  resetFilter(): void {
    this.filterDate = '';
    
   
    const now = new Date();
    this.selectedMonth = now.getMonth() + 1;
    this.selectedYear = now.getFullYear();
    
  
    this.currentPage = 1;
    
  
    this.loadLaporanBulanan();
    this.loadPendapatan();
  }
  
}
