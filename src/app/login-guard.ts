import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { SemuaService } from './semua.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(private service: SemuaService, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> {
  
    return this.service.checkSession().pipe(
      map(res => {
       
        return this.router.createUrlTree(['/admin']);
      }),
      catchError(err => {
       
        return of(true);
      })
    );
  }
}
