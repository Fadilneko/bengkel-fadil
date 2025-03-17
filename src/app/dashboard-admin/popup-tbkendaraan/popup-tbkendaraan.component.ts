import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SemuaService } from 'src/app/semua.service';
import { PopupKonfirmasiComponent } from '../popup-konfirmasi/popup-konfirmasi.component';


@Component({
  selector: 'app-popup-tbkendaraan',
  templateUrl: './popup-tbkendaraan.component.html',
  styleUrls: ['./popup-tbkendaraan.component.css']
})
export class PopupTbkendaraanComponent {

  kendaraan: any = {nopol: ''};

  constructor(
    private service: SemuaService,
    public dialogRef: MatDialogRef<PopupTbkendaraanComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data) this.kendaraan = { ...data };
  }

  simpan() {
    const dialogRef = this.dialog.open(PopupKonfirmasiComponent, {
      width: '300px',
      
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) { 
        if (this.kendaraan.id) {
          this.service.editKendaraan(this.kendaraan.id, this.kendaraan).subscribe(() => this.dialogRef.close(true));
        } else {
          this.service.tambahKendaraan(this.kendaraan).subscribe(() => this.dialogRef.close(true));
        }
      }
    });
  }

}
