import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-popup-konfirmasi',
  templateUrl: './popup-konfirmasi.component.html',
  styleUrls: ['./popup-konfirmasi.component.css']
})
export class PopupKonfirmasiComponent {

  constructor(public dialogRef: MatDialogRef<PopupKonfirmasiComponent>) {}

  konfirmasi() {
    this.dialogRef.close(true);
  }

  batal() {
    this.dialogRef.close(false);
  }

}
