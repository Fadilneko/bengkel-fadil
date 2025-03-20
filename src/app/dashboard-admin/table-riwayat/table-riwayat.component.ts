import { Component, OnInit } from '@angular/core';
import { SemuaService } from 'src/app/semua.service';
import { MatDialog } from '@angular/material/dialog';
import { PopupTbriwayatComponent } from '../popup-tbriwayat/popup-tbriwayat.component';
import { PopupKonfirmasiComponent } from '../popup-konfirmasi/popup-konfirmasi.component';

interface CustomerFilterOption {
  id: number;
  name: string;
  count: number;
}

@Component({
  selector: 'app-table-riwayat',
  templateUrl: './table-riwayat.component.html',
  styleUrls: ['./table-riwayat.component.css']
})
export class TableRiwayatComponent implements OnInit {

  riwayatList: any[] = [];
  searchQuery: string = '';

  selectedDate: string = '';
  selectedMonth: string = '';


  selectedCustomerId: string = '';
  customerFilterOptions: CustomerFilterOption[] = [];

  totalPagesFiltered: number = 0;
  filteredCount: number = 0;
  currentPage: number = 1;
  itemsPerPage: number = 5; 

  constructor(private riwayatService: SemuaService, private dialog: MatDialog) {}

  ngOnInit() {
    this.selectedMonth = new Date().toISOString().split('T')[0].substring(0, 7);
    this.loadriwayat();
  }

  loadriwayat() {
    this.riwayatService.getRiwayat().subscribe(
      (data) => {
        this.riwayatList = data;
        console.log("📌 Data Riwayat dari API:", this.riwayatList);
        this.generateCustomerFilterOptions();
        this.applyFilters();
      },
      (error) => {
        console.error('Gagal mengambil data riwayat:', error);
      }
    );
  }

  generateCustomerFilterOptions() {
    const customerMap: { [id: number]: { name: string, count: number } } = {};
    this.riwayatList.forEach(riwayat => {
      const pelanggan = riwayat.kendaraan?.pelanggan;
      if (pelanggan && pelanggan.id) {
        if (customerMap[pelanggan.id]) {
          customerMap[pelanggan.id].count++;
        } else {
          customerMap[pelanggan.id] = { name: pelanggan.nama, count: 1 };
        }
      }
    });
    this.customerFilterOptions = Object.keys(customerMap)
      .map(id => ({
        id: +id,
        name: customerMap[+id].name,
        count: customerMap[+id].count
      }))
      .sort((a, b) => b.count - a.count);
  }

 
  filterServiceTerbanyak() {
    if (this.customerFilterOptions && this.customerFilterOptions.length) {
      const topOption = this.customerFilterOptions[0];
      this.selectedCustomerId = topOption.id.toString();
     
      this.selectedDate = '';
      this.selectedMonth = '';
      this.applyFilters();
    }
  }

  tambahriwayat() {
    const dialogRef = this.dialog.open(PopupTbriwayatComponent, {
      width: '600px',
      data: {},
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.loadriwayat();
    });
  }

  editriwayat(riwayat: any) {
    const dialogRef = this.dialog.open(PopupTbriwayatComponent, {
      width: '600px',
      data: riwayat,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.loadriwayat();
    });
  }

  hapusriwayat(id: number) {
    const dialogRef = this.dialog.open(PopupKonfirmasiComponent, {
      width: '300px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) { 
        this.riwayatService.hapusRiwayat(id).subscribe(() => this.loadriwayat());
      }
    });
  }


  updateStatus(riwayat: any) {
    this.riwayatService.updateStatusRiwayat(riwayat.id, riwayat.status).subscribe(
      res => {
        console.log('✅ Status berhasil diperbarui:', res);
        this.loadriwayat();
      },
      error => {
        console.error('❌ Gagal mengupdate status riwayat:', error);
      }
    );
  }
  

  filteredData(): any[] {
    let filtered = this.riwayatList;

    if (this.searchQuery) {
      filtered = filtered.filter(k =>
        k.keluhan.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

    if (this.selectedDate) {
      filtered = filtered.filter(k => {
        const riwayatDate = new Date(k.tanggal).toISOString().split('T')[0];
        return riwayatDate === this.selectedDate;
      });
    }

    if (this.selectedMonth) {
      filtered = filtered.filter(k => k.tanggal.startsWith(this.selectedMonth));
    }

    if (this.selectedCustomerId) {
      filtered = filtered.filter(k => k.kendaraan?.pelanggan?.id === +this.selectedCustomerId);
    }

    this.filteredCount = filtered.length;
    this.totalPagesFiltered = Math.ceil(this.filteredCount / this.itemsPerPage);

    return filtered.slice(
      (this.currentPage - 1) * this.itemsPerPage,
      this.currentPage * this.itemsPerPage
    );
  }

  applyFilters() {
    this.currentPage = 1;
    this.filteredData();
  }

  resetFilter() {
    this.searchQuery = '';
    this.selectedDate = '';
    this.selectedMonth = new Date().toISOString().split('T')[0].substring(0, 7)
    this.selectedCustomerId = '';
    this.applyFilters();
  }

  totalPages(): number {
    return this.totalPagesFiltered || 1;
  }

  startItem(): number {
    return this.filteredCount === 0 ? 0 : (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  endItem(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.filteredCount);
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

  printInvoice(riwayat: any) {
    console.log('Mencetak invoice untuk:', riwayat);

    let sparepartsRows = '';
    let subtotalSparepart = 0;
    if (riwayat.spareparts && riwayat.spareparts.length) {
      riwayat.spareparts.forEach((sp: any) => {
        const jumlah = sp.riwayat_sparepart?.jumlah_sparepart || 0;
        const hargaJual = sp.riwayat_sparepart?.harga_jual || 0;
        const totalSp = hargaJual * jumlah;
        subtotalSparepart += totalSp;
        sparepartsRows += `
          <tr>
            <td>${sp.nama}</td>
            <td style="text-align:right;">${hargaJual.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</td>
            <td style="text-align:center;">${jumlah}</td>
            <td style="text-align:right;">${totalSp.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</td>
          </tr>
        `;
      });
    }
    const servicePrice = riwayat.jasa?.harga || 0;
    const totalPembayaran = servicePrice + subtotalSparepart;
    const printContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .container { width: 100%; max-width: 800px; margin: auto; padding: 20px; }
            .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; text-align: right; }
            .header h2 { margin: 0; }
            .info-section { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px; }
            .info { font-size: 14px; }
            .info p { margin: 4px 0; }
            .garis { border-bottom: 2px solid black; margin: 10px 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            table, th, td { border: 1px solid black; }
            th, td { padding: 8px; font-size: 14px; }
            th { background-color: #f0f0f0; }
            .total { text-align: right; font-weight: bold; font-size: 16px; margin-top: 10px; }
          </style>
        </head>
        <body onload="window.print(); window.onafterprint = function() { window.close(); }">
          <div class="container">
            <div class="header">
              <h2>Invoice</h2>
              <p><strong>Tanggal Selesai:</strong><br> ${new Date(riwayat.tanggal).toLocaleDateString('id-ID')}</p>
            </div>
            <div class="garis"></div>
            <div class="info-section">
              <div class="info">
                <h3>Informasi Pelanggan</h3>
                <p>Nama: ${riwayat.kendaraan?.pelanggan?.nama || '-'}</p>
                <p>KTP: ${riwayat.kendaraan?.pelanggan?.ktp || '-'}</p>
              </div>
              <div class="info">
                <h3>Informasi Teknisi</h3>
                <p>Nama: ${riwayat.karyawan?.nama || '-'}</p>
              </div>
            </div>
            <h3>Detail Transaksi</h3>
            <p>No. Polisi: ${riwayat.kendaraan?.nopol || '-'}</p>
            <p>Merek: ${riwayat.kendaraan?.merek || '-'}</p>
            <p>Keluhan: ${riwayat.keluhan || '-'}</p>
            <p>Penanganan: ${riwayat.penanganan || '-'}</p>
            <p>Catatan: ${riwayat.catatan || '-'}</p>
            <p>Jenis Service: ${riwayat.jasa?.jenis || '-'}</p>
            <div class="garis"></div>
            <h3>Detail Sparepart</h3>
            <table>
              <tr>
                <th>Nama Sparepart</th>
                <th>Harga Jual</th>
                <th>Jumlah</th>
                <th>Total</th>
              </tr>
              ${sparepartsRows || '<tr><td colspan="4" style="text-align:center;">Tidak ada sparepart</td></tr>'}
            </table>
            <p class="total">Harga Service: ${servicePrice.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</p>
            <p class="total">Total Sparepart: ${subtotalSparepart.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</p>
            <div class="garis"></div>
            <p class="total">Total Pembayaran: ${totalPembayaran.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</p>
          </div>
        </body>
      </html>
    `;
    const printWindow = window.open('invoice', '_blank');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(printContent);
      printWindow.document.close();
    }
  }
}
