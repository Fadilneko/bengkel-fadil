import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SemuaService } from 'src/app/semua.service';

@Component({
  selector: 'app-profile-karyawan',
  templateUrl: './profile-karyawan.component.html',
  styleUrls: ['./profile-karyawan.component.css']
})
export class ProfileKaryawanComponent implements OnInit {
  karyawan: any = {}; 
  selectedFile: File | null = null;
  previewImage: string | null = null;

  constructor(
    private service: SemuaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

 
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  loadProfile() {
    const karyawanId = localStorage.getItem('karyawanId'); 
    if (karyawanId) {
      this.service.getKaryawanById(karyawanId).subscribe(
        (response) => {
          this.karyawan = response;
          this.previewImage = this.karyawan.foto ? `assets/${this.karyawan.foto}` : null;
        },
        (error) => {
          console.error('Gagal mengambil data karyawan:', error);
        }
      );
    } else {
      console.warn('ID karyawan tidak ditemukan di localStorage');
    }
  }

  simpan() {
    const karyawanId = localStorage.getItem('karyawanId'); 
    if (!karyawanId) {
      console.warn('ID karyawan tidak ditemukan di localStorage');
      return;
    }
  
    const formData = new FormData();
    formData.append('nama', this.karyawan.nama);
    formData.append('alamat', this.karyawan.alamat);
    formData.append('hp', this.karyawan.hp);
    
    if (this.selectedFile) {
      formData.append('foto', this.selectedFile);
    }
  
    this.service.editKaryawan(karyawanId, formData).subscribe(
      () => {
        console.log('Data karyawan berhasil diperbarui');
        this.router.navigate(['admin/dashboard-admin']).then(() => {
          window.location.reload(); 
        });
      },
      (error) => {
        console.error('Gagal memperbarui data:', error);
      }
    );
  }
  

  close() {
    this.router.navigate(['admin/dashboard-admin']); 
  }
}
