import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SemuaService } from 'src/app/semua.service';
import { MatDialog } from '@angular/material/dialog';
import { DetailRiwayatComponent } from '../detail-riwayat/detail-riwayat.component';

@Component({
  selector: 'app-riwayat',
  templateUrl: './riwayat.component.html',
  styleUrls: ['./riwayat.component.css']
})
export class RiwayatComponent implements OnInit {

  allriwayat: any[] = []; 
  pelangganId: number | null = null;
  filterDate: string = ''; 

  constructor(
    private route: ActivatedRoute, 
    private semuaService: SemuaService, 
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    const storedPelangganId = localStorage.getItem('pelangganId');
    this.pelangganId = storedPelangganId ? parseInt(storedPelangganId, 10) : null;


    this.filterDate = new Date().toISOString().split('T')[0];

    if (this.pelangganId) {
      this.getallriwayat();
    }
  }

  getallriwayat() {
    this.semuaService.getRiwayat().subscribe(
      data => {
        console.log("Data dari API:", data);
        if (Array.isArray(data)) {
        
          this.allriwayat = data.filter(b => b.kendaraan && b.kendaraan.id_pelanggan === this.pelangganId);
        } else {
          this.allriwayat = [];
        }
        console.log("Filtered Riwayat:", this.allriwayat); 
      },
      error => {
        console.error("Gagal mengambil data riwayat:", error);
      }
    );
  }
  
  get filteredRiwayat(): any[] {
 
    return this.allriwayat.filter(b => {
      const riwayatDate = new Date(b.tanggal).toISOString().split('T')[0];
      return riwayatDate === this.filterDate;
    });
  }


  resetFilterDate() {
    this.filterDate = new Date().toISOString().split('T')[0];
  }

  openDetail(riwayat: any) {
    this.dialog.open(DetailRiwayatComponent, {
      data: riwayat,
      width: '500px'
    });
  }
}
