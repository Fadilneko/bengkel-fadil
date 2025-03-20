import { Component, OnInit } from '@angular/core';
import { SemuaService } from 'src/app/semua.service';
import { MatDialog } from '@angular/material/dialog';
import { PopupTbsparepartComponent } from '../popup-tbsparepart/popup-tbsparepart.component';
import { PopupKonfirmasiComponent } from '../popup-konfirmasi/popup-konfirmasi.component';

@Component({
  selector: 'app-table-sparepart',
  templateUrl: './table-sparepart.component.html',
  styleUrls: ['./table-sparepart.component.css']
})
export class TableSparepartComponent implements OnInit{

   sparepartList: any[] = [];
   searchQuery: string = '';
   currentPage: number = 1;
   itemsPerPage: number = 5; 
      
      
        constructor(private sparepartService: SemuaService,private dialog: MatDialog) {}
      
        ngOnInit() {
          this.loadsparepart();
        }
      
        loadsparepart() {
          this.sparepartService.getSparepart().subscribe(
            (data) => {
              this.sparepartList = data;
            },
            (error) => {
              console.error('Gagal mengambil data sparepart:', error);
            }
          );
        }
      
        tambahsparepart() {
          const dialogRef = this.dialog.open(PopupTbsparepartComponent, {
            width: '600px',
            data: null,
          });
      
          dialogRef.afterClosed().subscribe((result) => {
            if (result) this.loadsparepart();
          });
        }
      
        editsparepart(sparepart: any) {
          const dialogRef = this.dialog.open(PopupTbsparepartComponent, {
            width: '600px',
            data: sparepart,
          });
      
          dialogRef.afterClosed().subscribe((result) => {
            if (result) this.loadsparepart();
          });
        }
      
        hapussparepart(id: number) {
          const dialogRef = this.dialog.open(PopupKonfirmasiComponent, {
            width: '300px',
          
          });
              dialogRef.afterClosed().subscribe(result => {
                if (result) { 
            this.sparepartService.hapusSparepart(id).subscribe(() => this.loadsparepart());
          }
              })
      }

      get filteredList(): any[] {
        let filtered = this.sparepartList;
      
      
        if (this.searchQuery) {
          filtered = filtered.filter(item =>
            item.nama.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
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
