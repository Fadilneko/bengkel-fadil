import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// angular material
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { PelangganRoutingModule } from './pelanggan-routing.module';
import { PelangganComponent } from './pelanggan.component';
import { DashboardPelangganComponent } from '../dashboard-pelanggan/dashboard-pelanggan.component';
import { HeaderPelangganComponent } from '../dashboard-pelanggan/header-pelanggan/header-pelanggan.component';
import { ProfilePelangganComponent } from '../dashboard-pelanggan/profile-pelanggan/profile-pelanggan.component';
import { BookingComponent } from '../dashboard-pelanggan/booking/booking.component';




@NgModule({
  declarations: [
    PelangganComponent,
    DashboardPelangganComponent,
    HeaderPelangganComponent,
    ProfilePelangganComponent,
    BookingComponent,
  ],
  imports: [
    CommonModule,
    PelangganRoutingModule,
    FormsModule,

    // angular material
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    MatDialogModule
  ]
})
export class PelangganModule { }
