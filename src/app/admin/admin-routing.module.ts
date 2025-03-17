import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { RouterModule, Routes } from '@angular/router';
import { DashboardAdminComponent } from '../dashboard-admin/dashboard-admin.component';
import { TablePelangganComponent } from '../dashboard-admin/table-pelanggan/table-pelanggan.component';
import { TableKaryawanComponent } from '../dashboard-admin/table-karyawan/table-karyawan.component';
import { TableKendaraanComponent } from '../dashboard-admin/table-kendaraan/table-kendaraan.component';
import { TableSparepartComponent } from '../dashboard-admin/table-sparepart/table-sparepart.component';
import { TableJasaServiceComponent } from '../dashboard-admin/table-jasa-service/table-jasa-service.component';
import { ProfileKaryawanComponent } from '../dashboard-admin/profile-karyawan/profile-karyawan.component';
import { TableBookingComponent } from '../dashboard-admin/table-booking/table-booking.component';
import { TableRiwayatComponent } from '../dashboard-admin/table-riwayat/table-riwayat.component';
import { AuthGuard } from '../authguard';

const routes: Routes = [

  {
    path: '',
    component: AdminComponent,  canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
  
      { path: 'dashboard-admin', component: DashboardAdminComponent,  },
      {path:'table-pelanggan', component:TablePelangganComponent, },
      {path:'table-karyawan', component:TableKaryawanComponent,},
      {path:'table-kendaraan', component:TableKendaraanComponent, },
      {path:'table-sparepart', component:TableSparepartComponent, },
      {path:'table-jasa-service', component:TableJasaServiceComponent, },
      {path:'profile', component:ProfileKaryawanComponent, },
      {path:'table-booking', component:TableBookingComponent, },
      {path:'table-riwayat', component:TableRiwayatComponent, },
  
    ],
    
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
