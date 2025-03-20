import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SemuaService } from 'src/app/semua.service';
import { MatDialog } from '@angular/material/dialog';
import { DetailBookingComponent } from '../detail-booking/detail-booking.component';
import { PopupBookingComponent } from '../popup-booking/popup-booking.component';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {
  allBookings: any[] = []; 
  pelangganId: number | null = null; 
  filterDate: string = '';

  constructor(
    private route: ActivatedRoute, 
    private semuaService: SemuaService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
   
    this.filterDate = new Date().toISOString().split('T')[0];

    const storedPelangganId = localStorage.getItem('pelangganId');
    this.pelangganId = storedPelangganId ? parseInt(storedPelangganId, 10) : null;
    this.getAllBookings();
  
    const bookingId = this.route.snapshot.paramMap.get('id');
    if (bookingId) {
      this.getBookingDetail(bookingId);
    }
  }

  getAllBookings() {
    this.semuaService.getBooking().subscribe(
      data => {
        if (Array.isArray(data)) {
        
          this.allBookings = data.filter(b => b.kendaraan?.id_pelanggan === this.pelangganId);
        } else {
          this.allBookings = [];
        }
      },
      error => {
        console.error("Gagal mengambil data booking:", error);
      }
    );
  }
  
  getBookingDetail(bookingId: string) {
    this.semuaService.getBookingById(bookingId).subscribe((data: any) => {  
      console.log("Data booking:", data);
      if (data && data.kendaraan && typeof data.kendaraan === 'object') {
        if (data.kendaraan.id_pelanggan === this.pelangganId) {
          this.dialog.open(DetailBookingComponent, {
            width: '600px',
            data: data
          });
        } else {
          console.warn("Booking bukan milik pelanggan ini.");
        }
      } else {
        console.error("Error: kendaraan tidak ditemukan dalam booking:", data);
      }
    });
  }

  get filteredBookings(): any[] {

    return this.allBookings.filter(b => {
      const bookingDate = new Date(b.tanggal_booking).toISOString().split('T')[0];
      return bookingDate === this.filterDate;
    });
  }

  editBooking(booking: any) {
    const dialogRef = this.dialog.open(PopupBookingComponent, {
      width: '600px',
      data: booking,
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAllBookings(); 
      }
    });
  }
  
 
  resetFilterDate() {
    this.filterDate = new Date().toISOString().split('T')[0];
  }
}
