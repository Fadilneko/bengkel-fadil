import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SemuaService } from 'src/app/semua.service';
import { PopupKonfirmasiComponent } from '../popup-konfirmasi/popup-konfirmasi.component';

@Component({
  selector: 'app-popup-tbsparepart',
  templateUrl: './popup-tbsparepart.component.html',
  styleUrls: ['./popup-tbsparepart.component.css']
})
export class PopupTbsparepartComponent {

  sparepart: any = {kode: '' };
  selectedFile: File | null = null; 

  constructor(
    private service: SemuaService,
    public dialogRef: MatDialogRef<PopupTbsparepartComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data) this.sparepart = { ...data };
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  simpan() {
    const dialogRef = this.dialog.open(PopupKonfirmasiComponent, { width: '300px' });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this.selectedFile) {
          
          this.service.uploadFoto(this.selectedFile).subscribe(response => {
            console.log('Upload berhasil:', response);
            this.sparepart.foto = response.filename; 
            this.simpanDataSparepart();
          }, error => {
            console.error('Gagal upload foto:', error);
          });
        } else {
         
          this.simpanDataSparepart();
        }
      }
    });
  }

  private simpanDataSparepart() {
    if (this.sparepart.id) {
      this.service.editSparepart(this.sparepart.id, this.sparepart).subscribe(() => this.dialogRef.close(true));
    } else {
      this.service.tambahSparepart(this.sparepart).subscribe(() => this.dialogRef.close(true));
    }
  }
  }



