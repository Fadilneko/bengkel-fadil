import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SemuaService } from 'src/app/semua.service';

@Component({
  selector: 'app-profile-pelanggan',
  templateUrl: './profile-pelanggan.component.html',
  styleUrls: ['./profile-pelanggan.component.css']
})
export class ProfilePelangganComponent implements OnInit {

  pelanggan: any = {}; 
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
    const pelangganId = localStorage.getItem('pelangganId'); 
    if (pelangganId) {
      this.service.getPelangganById(pelangganId).subscribe(
        (response) => {
          this.pelanggan = response;
          this.previewImage = this.pelanggan.foto ? `assets/${this.pelanggan.foto}` : null;
        },
        (error) => {
          console.error('Gagal mengambil datapelanggan:', error);
        }
      );
    } else {
      console.warn('IDpelanggan tidak ditemukan di localStorage');
    }
  }

  simpan() {
    const pelangganId = localStorage.getItem('pelangganId'); 
    if (!pelangganId) {
      console.warn('IDpelanggan tidak ditemukan di localStorage');
      return;
    }
  
    const formData = new FormData();
    formData.append('ktp', this.pelanggan.ktp);
    formData.append('nama', this.pelanggan.nama);
    formData.append('alamat', this.pelanggan.alamat);
    formData.append('hp', this.pelanggan.hp);
    
    if (this.selectedFile) {
      formData.append('foto', this.selectedFile);
    }
  
    this.service.editPelanggan(pelangganId, formData).subscribe(
      () => {
        console.log('Datapelanggan berhasil diperbarui');
        this.router.navigate(['pelanggan/dashboard-pelanggan']).then(() => {
          window.location.reload(); 
        });
      },
      (error) => {
        console.error('Gagal memperbarui data:', error);
      }
    );
  }
  

  close() {
    this.router.navigate(['pelanggan/dashboard-pelanggan']); 
  }
}


