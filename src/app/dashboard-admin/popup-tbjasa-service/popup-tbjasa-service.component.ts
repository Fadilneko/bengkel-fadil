import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SemuaService } from 'src/app/semua.service';
import { PopupKonfirmasiComponent } from '../popup-konfirmasi/popup-konfirmasi.component';

@Component({
  selector: 'app-popup-tbjasa-service',
  templateUrl: './popup-tbjasa-service.component.html',
  styleUrls: ['./popup-tbjasa-service.component.css']
})
export class PopupTbjasaServiceComponent {

  jasaservice: any = {nopol: ''};

  constructor(
    private service: SemuaService,
    public dialogRef: MatDialogRef<PopupTbjasaServiceComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data) this.jasaservice = { ...data };
  }

  simpan() {
    const dialogRef = this.dialog.open(PopupKonfirmasiComponent, {
      width: '300px',
      
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) { 
        if (this.jasaservice.id) {
          this.service.editJasaservice(this.jasaservice.id, this.jasaservice).subscribe(() => this.dialogRef.close(true));
        } else {
          this.service.tambahJasaservice(this.jasaservice).subscribe(() => this.dialogRef.close(true));
        }
      }
    });
  }

}



