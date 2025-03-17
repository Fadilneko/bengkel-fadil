import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { SemuaService } from './semua.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(private service: SemuaService, private router: Router) {}

  canActivate(): Observable<boolean> {
 
    return this.service.checkSession().pipe(
      map(res => {
     
        return true;
      }),
      catchError(err => {
     
        this.router.navigate(['/login']);
        return of(false);
      })
    );
  }
  canActivateChild(): Observable<boolean> {
    return this.canActivate();
  }
}
