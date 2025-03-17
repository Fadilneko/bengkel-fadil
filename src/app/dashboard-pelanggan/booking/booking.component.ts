import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SemuaService } from 'src/app/semua.service';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {
  allBookings: any[] = []; 
  booking: any = null; 
  pelangganId: number | null = null; 

  constructor(private route: ActivatedRoute, private semuaService: SemuaService) {}

  ngOnInit() {
 
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
        this.allBookings = Array.isArray(data) ? data : [];
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
          this.booking = data;
        } else {
          this.booking = null;
          console.warn("Booking bukan milik pelanggan ini.");
        }
      } else {
        console.error("Error: kendaraan tidak ditemukan dalam booking:", data);
        this.booking = null;
      }
    });
  }

  closeDetail() {
    this.booking = '';
  }
  
}
