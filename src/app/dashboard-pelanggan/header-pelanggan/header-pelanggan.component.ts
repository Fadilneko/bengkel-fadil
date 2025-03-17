import { Component, OnInit, ChangeDetectorRef, HostListener } from '@angular/core';
import { SemuaService } from '../../semua.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-header-pelanggan',
  templateUrl: './header-pelanggan.component.html',
  styleUrls: ['./header-pelanggan.component.css']
})
export class HeaderPelangganComponent implements OnInit {

  pelanggan: any = null;  
  dropdownOpen = false;

  constructor(private semuaService: SemuaService, private router: Router, private cdr: ChangeDetectorRef) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.closeDropdown();
      }
    });
  }

  ngOnInit() {
    const pelangganId = localStorage.getItem('pelangganId');
    console.log(localStorage.getItem('pelangganId'));
    
    if (pelangganId) {
      this.semuaService.getPelangganById(pelangganId).subscribe((data) => {
        console.log('Data pelanggan:', data);
        this.pelanggan = data;
        this.cdr.detectChanges();
      });
    }
  }

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown() {
    this.dropdownOpen = false;
  }

  logout() {
    this.semuaService.logout().subscribe(() => {
      localStorage.removeItem('pelangganId');
      this.router.navigate(['/login'], { replaceUrl: true });

    });
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.relative')) {
      this.closeDropdown();
    }
  }
}
