import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

// angular material
import {MatCardModule} from '@angular/material/card';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


import { RegisterComponent } from './register/register.component';


import { PopupTbpelangganComponent } from './dashboard-admin/popup-tbpelanggan/popup-tbpelanggan.component';
import { PopupTbkaryawanComponent } from './dashboard-admin/popup-tbkaryawan/popup-tbkaryawan.component';
import { TableKendaraanComponent } from './dashboard-admin/table-kendaraan/table-kendaraan.component';
import { PopupTbkendaraanComponent } from './dashboard-admin/popup-tbkendaraan/popup-tbkendaraan.component';
import { TableSparepartComponent } from './dashboard-admin/table-sparepart/table-sparepart.component';
import { PopupTbsparepartComponent } from './dashboard-admin/popup-tbsparepart/popup-tbsparepart.component';
import { TableJasaServiceComponent } from './dashboard-admin/table-jasa-service/table-jasa-service.component';
import { PopupTbjasaServiceComponent } from './dashboard-admin/popup-tbjasa-service/popup-tbjasa-service.component';
import { ProfileKaryawanComponent } from './dashboard-admin/profile-karyawan/profile-karyawan.component';
import { PopupTbbookingComponent } from './dashboard-admin/popup-tbbooking/popup-tbbooking.component';
import { DashboardPelangganComponent } from './dashboard-pelanggan/dashboard-pelanggan.component';
import { HeaderPelangganComponent } from './dashboard-pelanggan/header-pelanggan/header-pelanggan.component';
import { ProfilePelangganComponent } from './dashboard-pelanggan/profile-pelanggan/profile-pelanggan.component';
import { PopupTambahKendaraanComponent } from './dashboard-pelanggan/popup-tambah-kendaraan/popup-tambah-kendaraan.component';
import { TableRiwayatComponent } from './dashboard-admin/table-riwayat/table-riwayat.component';
import { PopupTbriwayatComponent } from './dashboard-admin/popup-tbriwayat/popup-tbriwayat.component';
import { PopupBookingComponent } from './dashboard-pelanggan/popup-booking/popup-booking.component';
import { BookingComponent } from './dashboard-pelanggan/booking/booking.component';
import { RiwayatComponent } from './dashboard-pelanggan/riwayat/riwayat.component';
import { DetailRiwayatComponent } from './dashboard-pelanggan/detail-riwayat/detail-riwayat.component';
import { DetailBookingComponent } from './dashboard-pelanggan/detail-booking/detail-booking.component';







@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    PopupTbpelangganComponent,
    PopupTbkaryawanComponent,
    PopupTbkendaraanComponent,
    PopupTbsparepartComponent,
    PopupTbjasaServiceComponent,
    PopupTbbookingComponent,
    PopupTambahKendaraanComponent,
    PopupTbriwayatComponent,
    PopupBookingComponent,
    RiwayatComponent,
    DetailRiwayatComponent,
    DetailBookingComponent,

  
 
    
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,


    // angular material
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    MatSnackBarModule,


   
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
