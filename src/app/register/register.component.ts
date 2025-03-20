import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SemuaService } from '../semua.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  email = '';
  password = '';
  role = 0; 
  nama = '';
  message = '';
  isLoading = false;

  constructor(
    private SemuaService: SemuaService, 
    private router: Router,
    private snackBar: MatSnackBar
  ) {}


  onRegister() {
    this.isLoading = true;
    // Pertama, periksa apakah email sudah terdaftar
    this.SemuaService.checkEmailAvailability(this.email).subscribe(
      (exists: boolean) => {
        if (exists) {
          // Jika email sudah terdaftar, tampilkan alert dan reset input email
          alert("Email sudah terdaftar. Gunakan email lain.");
          this.email = "";
          this.isLoading = false;
          return;
        } else {
          // Jika email belum terdaftar, lanjutkan proses registrasi
          const user = { email: this.email, password: this.password, role: this.role, nama: this.nama };
          this.SemuaService.register(user).subscribe(
            response => {
              console.log('Registration successful', response);
              this.snackBar.open('Registrasi berhasil! Silakan login.', 'Tutup', {
                duration: 3000,
                horizontalPosition: 'center',
                verticalPosition: 'top'
              });
              this.router.navigate(['/login']);
            },
            error => {
              console.error('Registration error', error);
              this.snackBar.open('Registrasi gagal. Coba lagi.', 'Tutup', {
                duration: 3000,
                horizontalPosition: 'center',
                verticalPosition: 'top'
              });
            },
            () => {
              this.isLoading = false;
            }
          );
        }
      },
      error => {
        console.error("Error checking email availability", error);
        alert("Terjadi kesalahan saat memeriksa email. Coba lagi.");
        this.isLoading = false;
      }
    );
  }
  
}
