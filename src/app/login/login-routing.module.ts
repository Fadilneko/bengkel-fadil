import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login.component';
import { RegisterComponent } from '../register/register.component';
import { AdminComponent } from '../admin/admin.component';
import { PelangganComponent } from '../pelanggan/pelanggan.component';
import { DashboardPelangganComponent } from '../dashboard-pelanggan/dashboard-pelanggan.component';
import { DashboardAdminComponent } from '../dashboard-admin/dashboard-admin.component';


const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'admin',
    component: AdminComponent,
    children: [
      { path: '', component: DashboardAdminComponent },
      
    ]
  },
  { 
    path: 'pelanggan',
    component: PelangganComponent,
    children: [
      { path: '', component: DashboardPelangganComponent },
      
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginRoutingModule {}
