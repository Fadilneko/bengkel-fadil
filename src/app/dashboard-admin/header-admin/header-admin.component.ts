import { Component, OnInit, ChangeDetectorRef, ElementRef, HostListener } from '@angular/core';
import { SemuaService } from '../../semua.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-header-admin',
  templateUrl: './header-admin.component.html',
  styleUrls: ['./header-admin.component.css'],
})
export class HeaderAdminComponent implements OnInit {
  karyawan: any = null;
  user: any = null;
  role: number | null = null;

 
  dropdownOpen = false;
  mobileDropdownOpen = false;

  sidebarOpen: boolean = false;

  constructor(
    private semuaService: SemuaService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private elementRef: ElementRef
  ) {}

  ngOnInit() {
    const karyawanId = localStorage.getItem('karyawanId');
    if (karyawanId) {
      this.semuaService.getKaryawanById(karyawanId).subscribe((data) => {
        this.karyawan = data;
        this.role = data.role;
        this.cdr.detectChanges();
      });
    }
 
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.dropdownOpen = false;
        this.mobileDropdownOpen = false;
      }
    });
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  toggleMobileDropdown() {
    this.mobileDropdownOpen = !this.mobileDropdownOpen;
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  logout() {
    this.semuaService.logout().subscribe(() => {
      localStorage.removeItem('karyawanId');
      this.router.navigate(['/login'], { replaceUrl: true });

    });
  }


  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
   
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.dropdownOpen = false;
      this.mobileDropdownOpen = false;
    }
  }
}
