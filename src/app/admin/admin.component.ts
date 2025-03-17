import { Component, OnInit } from '@angular/core';
import { SemuaService } from '../semua.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  karyawan: any = null; 

  constructor(private semuaService: SemuaService) {}

  ngOnInit() {
    const karyawanId = localStorage.getItem('karyawanId');
    if (karyawanId) {
      this.semuaService.getKaryawanById(karyawanId).subscribe((data) => {
        console.log('Data karyawan:', data);
        this.karyawan = data;
      });
    }
  }
 
}
