import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// angular material
import {MatCardModule} from '@angular/material/card';
import { MatToolbarModule} from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';




import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { HeaderAdminComponent } from '../dashboard-admin/header-admin/header-admin.component';
import { SidebarAdminComponent } from '../dashboard-admin/sidebar-admin/sidebar-admin.component';
import { DashboardAdminComponent } from '../dashboard-admin/dashboard-admin.component';
import { TablePelangganComponent } from '../dashboard-admin/table-pelanggan/table-pelanggan.component';
import { PopupKonfirmasiComponent } from '../dashboard-admin/popup-konfirmasi/popup-konfirmasi.component';
import { TableKaryawanComponent } from '../dashboard-admin/table-karyawan/table-karyawan.component';
import { TableKendaraanComponent } from '../dashboard-admin/table-kendaraan/table-kendaraan.component';
import { TableSparepartComponent } from '../dashboard-admin/table-sparepart/table-sparepart.component';
import { TableJasaServiceComponent } from '../dashboard-admin/table-jasa-service/table-jasa-service.component';
import { ProfileKaryawanComponent } from '../dashboard-admin/profile-karyawan/profile-karyawan.component';
import { TableBookingComponent } from '../dashboard-admin/table-booking/table-booking.component';
import { TableRiwayatComponent } from '../dashboard-admin/table-riwayat/table-riwayat.component';



@NgModule({
  declarations: [
    AdminComponent,
    DashboardAdminComponent,
    HeaderAdminComponent,
    SidebarAdminComponent,
    TablePelangganComponent,
    PopupKonfirmasiComponent,
    TableKaryawanComponent,
    TableKendaraanComponent,
    TableSparepartComponent,
    TableJasaServiceComponent,
    TableBookingComponent,
    ProfileKaryawanComponent,
    TableRiwayatComponent,
     

  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,

    // angular material
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    MatDialogModule
  ]
})
export class AdminModule { }
