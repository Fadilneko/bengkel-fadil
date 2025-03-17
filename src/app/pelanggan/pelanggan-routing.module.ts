import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PelangganComponent } from './pelanggan.component';
import { DashboardPelangganComponent } from '../dashboard-pelanggan/dashboard-pelanggan.component';
import { ProfilePelangganComponent } from '../dashboard-pelanggan/profile-pelanggan/profile-pelanggan.component';
import { BookingComponent } from '../dashboard-pelanggan/booking/booking.component';
import { RiwayatComponent } from '../dashboard-pelanggan/riwayat/riwayat.component';
import { AuthGuard } from '../authguard';


const routes: Routes = [
  {
      path: '',
      component: PelangganComponent, canActivate: [AuthGuard],
      canActivateChild: [AuthGuard],
      children: [
    
        {path:'dashboard-pelanggan', component:DashboardPelangganComponent,   data: { animation: 'DashboardPage' }},
        {path:'profile', component:ProfilePelangganComponent, },
        {path:'booking/:id', component: BookingComponent,  },
        {path:'booking', component: BookingComponent,  data: { animation: 'BookingPage' } },
        {path:'riwayat', component: RiwayatComponent,  },
      
        
      ],
      
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PelangganRoutingModule { }
