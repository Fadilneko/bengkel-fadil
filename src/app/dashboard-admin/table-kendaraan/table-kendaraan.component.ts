import { Component, OnInit } from '@angular/core';
import { SemuaService } from 'src/app/semua.service';
import { MatDialog } from '@angular/material/dialog';
import { PopupTbkendaraanComponent } from '../popup-tbkendaraan/popup-tbkendaraan.component';
import { PopupKonfirmasiComponent } from '../popup-konfirmasi/popup-konfirmasi.component';

@Component({
  selector: 'app-table-kendaraan',
  templateUrl: './table-kendaraan.component.html',
  styleUrls: ['./table-kendaraan.component.css']
})
export class TableKendaraanComponent implements OnInit {

  kendaraanList: any[] = [];
  searchQuery: string = '';
  selectedDate: string = ''; 
  selectedMonth: string = ''; 

  currentPage: number = 1;
  itemsPerPage: number = 5; 

  constructor(private kendaraanService: SemuaService, private dialog: MatDialog) {}

  ngOnInit() {
    this.loadkendaraan();
  }

  loadkendaraan() {
    this.kendaraanService.getKendaraan().subscribe(
      (data) => {
        this.kendaraanList = data;
      },
      (error) => {
        console.error('Gagal mengambil data kendaraan:', error);
      }
    );
  }

  tambahkendaraan() {
    const dialogRef = this.dialog.open(PopupTbkendaraanComponent, {
      width: '600px',
      data: null,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.loadkendaraan();
    });
  }

  editkendaraan(kendaraan: any) {
    const dialogRef = this.dialog.open(PopupTbkendaraanComponent, {
      width: '600px',
      data: kendaraan,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.loadkendaraan();
    });
  }

  hapuskendaraan(id: number) {
    const dialogRef = this.dialog.open(PopupKonfirmasiComponent, {
      width: '300px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) { 
        this.kendaraanService.hapusKendaraan(id).subscribe(() => this.loadkendaraan());
      }
    });
  }


  filteredData() {
    let filtered = this.kendaraanList.filter(k =>
      k.nopol.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      k.merek.toLowerCase().includes(this.searchQuery.toLowerCase())
    );

    

    return filtered.slice((this.currentPage - 1) * this.itemsPerPage, this.currentPage * this.itemsPerPage);
  }

  totalPages(): number {
    return Math.ceil(this.kendaraanList.length / this.itemsPerPage);
  }
  

  startItem(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }
  

  endItem(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.kendaraanList.length);
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
    return this.kendaraanList.slice(startIndex, startIndex + this.itemsPerPage);
  }
}
