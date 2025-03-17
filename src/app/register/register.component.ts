import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SemuaService } from '../semua.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  email = '';
  password = '';
  role = 0; 
  nama ='';
  message = '';
  isLoading = false;

  constructor(private SemuaService: SemuaService, private router: Router) {}

  onRegister() {
    const user = { email: this.email, password: this.password, role: this.role, nama:this.nama };

    this.SemuaService.register(user).subscribe(
      
      response => {
        console.log('Registration successful', response);
        this.message = 'Registrasi berhasil! Silakan login.';
        this.router.navigate(['/login']);
        console.log('Data sent to backend:', user);
      },
      error => {
        console.error('Registration error', error);
        this.message = 'Registrasi gagal. Coba lagi.';
      },
      () => {
        this.isLoading = false;
      }
    );
  }
}

