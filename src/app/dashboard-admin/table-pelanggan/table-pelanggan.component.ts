import { Component, OnInit } from '@angular/core';
import { SemuaService } from 'src/app/semua.service';
import { MatDialog } from '@angular/material/dialog';
import { PopupTbpelangganComponent } from '../popup-tbpelanggan/popup-tbpelanggan.component';
import { PopupKonfirmasiComponent } from '../popup-konfirmasi/popup-konfirmasi.component';

@Component({
  selector: 'app-table-pelanggan',
  templateUrl: './table-pelanggan.component.html',
})
export class TablePelangganComponent implements OnInit {

  pelangganList: any[] = [];
  searchQuery: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5; 


  constructor(private pelangganService: SemuaService,private dialog: MatDialog) {}

  ngOnInit() {
    this.loadPelanggan();
  }

  loadPelanggan() {
    this.pelangganService.getPelanggan().subscribe(
      (data) => {
        this.pelangganList = data;
      },
      (error) => {
        console.error('Gagal mengambil data pelanggan:', error);
      }
    );
  }

  tambahPelanggan() {
    const dialogRef = this.dialog.open(PopupTbpelangganComponent, {
      width: '600px',
      data: null,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.loadPelanggan();
    });
  }

  editPelanggan(pelanggan: any) {
    const dialogRef = this.dialog.open(PopupTbpelangganComponent, {
      width: '600px',
      data: pelanggan,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.loadPelanggan();
    });
  }

  hapusPelanggan(id: number) {
    const dialogRef = this.dialog.open(PopupKonfirmasiComponent, {
      width: '300px',
    
    });
        dialogRef.afterClosed().subscribe(result => {
          if (result) { 
      this.pelangganService.hapusPelanggan(id).subscribe(() => this.loadPelanggan());
    }
        })
}

get filteredList(): any[] {
  let filtered = this.pelangganList;


  if (this.searchQuery) {
    filtered = filtered.filter(item =>
      item.nama.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
  

  // if (this.filterStartDate) {
  //   filtered = filtered.filter(booking => {
  //     const bookingDate = new Date(booking.tanggal_booking);
  //     return bookingDate >= new Date(this.filterStartDate);
  //   });
  // }
  
 
  
  return filtered;
}


filteredData() {
  const filtered = this.filteredList;
  return filtered.slice(
    (this.currentPage - 1) * this.itemsPerPage,
    this.currentPage * this.itemsPerPage
  );
}

totalPages(): number {
  return Math.ceil(this.filteredList.length / this.itemsPerPage);
}
  
startItem(): number {
  return this.filteredList.length ? (this.currentPage - 1) * this.itemsPerPage + 1 : 0;
}
  
endItem(): number {
  return Math.min(this.currentPage * this.itemsPerPage, this.filteredList.length);
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

}