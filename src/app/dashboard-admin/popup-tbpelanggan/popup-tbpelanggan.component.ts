import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SemuaService } from 'src/app/semua.service';
import { PopupKonfirmasiComponent } from '../popup-konfirmasi/popup-konfirmasi.component';

@Component({
  selector: 'app-popup-tbpelanggan',
  templateUrl: './popup-tbpelanggan.component.html',
  styleUrls: ['./popup-tbpelanggan.component.css']
})
export class PopupTbpelangganComponent {

  pelanggan: any = { nama: '', email: '', foto: '' };
  selectedFile: File | null = null;

  constructor(
    private service: SemuaService,
    public dialogRef: MatDialogRef<PopupTbpelangganComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data) this.pelanggan = { ...data };
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  simpan() {
    const dialogRef = this.dialog.open(PopupKonfirmasiComponent, {
      width: '300px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
       
        if (this.selectedFile) {
          this.service.uploadFoto(this.selectedFile).subscribe(response => {
            console.log('Upload berhasil:', response);
           
            this.pelanggan.foto = response.filename;
            this.simpanDataPelanggan();
          }, error => {
            console.error('Gagal upload foto:', error);
          });
        } else {
          
          this.simpanDataPelanggan();
        }
      }
    });
  }

  private simpanDataPelanggan() {
    if (this.pelanggan.id) {
      this.service.editPelanggan(this.pelanggan.id, this.pelanggan)
        .subscribe(() => this.dialogRef.close(true));
    } else {
      this.service.tambahPelanggan(this.pelanggan)
        .subscribe(() => this.dialogRef.close(true));
    }
  }
}
