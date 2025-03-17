import { Component } from '@angular/core';
import { SemuaService } from '../semua.service';
import { Router } from '@angular/router';

interface LoginResponse {
  email: string;
  role: number; 
  token: string;
  table:string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  email = '';
  password = '';
  message = '';

  constructor(private authService: SemuaService, private router: Router) {}

  onLogin() {
    if (!this.email || !this.password) {
      this.message = 'Email dan password harus diisi!';
      return;
    }
  
    this.message = '';
    const user = { email: this.email, password: this.password };
  
    this.authService.login(user).subscribe(
      (response: any) => {  

        console.log('Login successful', response); 
  
       
        if (response.table === 'karyawan' && response.id) {
          localStorage.setItem('karyawanId', response.id);
        } else if (response.table === 'pelanggan' && response.id) {
          localStorage.setItem('pelangganId', response.id);
        } else {
          console.log('Full response:', response);
          console.log('Stored ID:', localStorage.getItem('karyawanId') || localStorage.getItem('pelangganId'));


        }

        const role = response.role;
        const table = response.table;
  
        if (table === 'pelanggan' && role === 0) {
          this.router.navigate(['/pelanggan']);
        } else if (table === 'user' && role === 1) {
          this.router.navigate(['/admin']);
        } else if (table === 'karyawan' && role === 1) {
          this.router.navigate(['/admin']);
        } else if (table === 'karyawan' && role === 0) {
          this.router.navigate(['/admin']);
        } else {
          this.message = 'Role tidak dikenali.';
        }
      },
      error => {
        console.error('Login error', error);
        this.message = 'Gagal login. Silakan cek email dan password Anda.';
      },
    );
  }
  

  Register() {
    this.router.navigate(['/register']);
  }
}
