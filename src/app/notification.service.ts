import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new ReplaySubject<string>(1);
  notification$ = this.notificationSubject.asObservable();

  notify(message: string) {
    console.log("Notifikasi dikirim:", message);
    this.notificationSubject.next(message);
  }
}
