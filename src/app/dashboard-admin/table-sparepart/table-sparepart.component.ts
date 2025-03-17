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

      filteredData() {
        let filtered = this.sparepartList.filter(k =>
          k.nama.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          k.kode.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
    
        return filtered.slice((this.currentPage - 1) * this.itemsPerPage, this.currentPage * this.itemsPerPage);
      }
    
      totalPages(): number {
        return Math.ceil(this.sparepartList.length / this.itemsPerPage);
      }
      
    
      startItem(): number {
        return (this.currentPage - 1) * this.itemsPerPage + 1;
      }
      
    
      endItem(): number {
        return Math.min(this.currentPage * this.itemsPerPage, this.sparepartList.length);
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
        return this.sparepartList.slice(startIndex, startIndex + this.itemsPerPage);
      }

}
