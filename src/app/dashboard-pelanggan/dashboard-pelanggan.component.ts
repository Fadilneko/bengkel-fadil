import { Component, OnInit } from '@angular/core';
import { SemuaService } from 'src/app/semua.service';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from 'src/app/notification.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { filter } from 'rxjs/operators';
import { PopupTambahKendaraanComponent } from '../dashboard-pelanggan/popup-tambah-kendaraan/popup-tambah-kendaraan.component';
import { PopupBookingComponent } from '../dashboard-pelanggan/popup-booking/popup-booking.component';

@Component({
  selector: 'app-dashboard-pelanggan',
  templateUrl: './dashboard-pelanggan.component.html',
  styleUrls: ['./dashboard-pelanggan.component.css']
})
export class DashboardPelangganComponent implements OnInit {

  pelanggan: any = null; 
  kendaraanList: any = []; 
  bookingList: any[] = [];
  currentSlide = 0;
  slides = [0, 1, 2];

  constructor(private semuaService: SemuaService, private dialog: MatDialog,  private notificationService: NotificationService,
    private snackBar: MatSnackBar) {}

  ngOnInit() {
    const pelangganId = localStorage.getItem('pelangganId');
    if (pelangganId) {
      this.getPelangganData(pelangganId);
      this.getKendaraanByPelangganId(pelangganId);
    }
    this.loadbooking();

    setInterval(() => {
      this.nextSlide();
    }, 4000);
    
    if (pelangganId) {
      const key = `pendingNotification_${pelangganId}`;
      const pending = localStorage.getItem(key);
      console.log("Pending notification dari localStorage:", pending);
      if (pending) {
        this.snackBar.open(pending, "Tutup", {
          duration: 3000,
          horizontalPosition: "center",
          verticalPosition: "top"
        });
        localStorage.removeItem(key);
      }
    }
  }

  // ngAfterViewInit() {
   
  //   setTimeout(() => {
  //     const pending = localStorage.getItem('pendingNotification');
  //     console.log("Pending notification dari localStorage:", pending);
  //     if (pending) {
  //       this.snackBar.open(pending, "Tutup", {
  //         duration: 3000,
  //         horizontalPosition: "center",
  //         verticalPosition: "top"
  //       });
  //       localStorage.removeItem('pendingNotification');
  //     }
  //   }, 100); 
  // }


  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  setSlide(index: number) {
    this.currentSlide = index;
  }

  loadbooking() {
    this.semuaService.getBooking().subscribe(
      (data) => {
        this.bookingList = data;
      },
      (error) => {
        console.error('Gagal mengambil data booking:', error);
      }
    );
  }

  private getPelangganData(pelangganId: string) {
    this.semuaService.getPelangganById(pelangganId).subscribe((data) => {
      console.log('Data pelanggan:', data);
      this.pelanggan = data;
    });
  }

  private getKendaraanByPelangganId(pelangganId: string) {
    this.semuaService.getKendaraanByPelanggan(pelangganId).subscribe((data) => {
      console.log('Data kendaraan:', data);
      this.kendaraanList = data; 
    });
  }

  tambahKendaraan() {
    const dialogRef = this.dialog.open(PopupTambahKendaraanComponent, {
      width: '500px',
      data: { id_pelanggan: this.pelanggan.id }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getKendaraanByPelangganId(this.pelanggan.id);
      }
    });
  }

  editKendaraan(kendaraan: any) {
    const dialogRef = this.dialog.open(PopupTambahKendaraanComponent, {
      width: '500px',
      data: { ...kendaraan, id_pelanggan: this.pelanggan.id }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getKendaraanByPelangganId(this.pelanggan.id);
      }
    });
  }

  tambahbooking() {
        const dialogRef = this.dialog.open(PopupBookingComponent, {
          width: '600px',
          data: {},
        });
    
        dialogRef.afterClosed().subscribe((result) => {
          if (result) this.loadbooking();
        });
  }

  lihatDetailBooking(bookingId: number) {
    console.log('Lihat detail booking untuk ID:', bookingId);
    
  }

}
