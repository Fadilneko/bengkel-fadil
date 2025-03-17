import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './authguard';
import { LoginGuard } from './login-guard';

const routes: Routes = [
  { path: '', loadChildren: () => import('./login/login.module').then(m => m.LoginModule),  },
  { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule),  }, 
  { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule), canActivate: [AuthGuard] },
  { path: 'pelanggan', loadChildren: () => import('./pelanggan/pelanggan.module').then(m => m.PelangganModule), canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
