import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SemuaService } from 'src/app/semua.service';
import { PopupKonfirmasiComponent } from '../popup-konfirmasi/popup-konfirmasi.component';

@Component({
  selector: 'app-popup-tbkaryawan',
  templateUrl: './popup-tbkaryawan.component.html',
  styleUrls: ['./popup-tbkaryawan.component.css']
})
export class PopupTbkaryawanComponent {
  karyawan: any = { nama: '', email: '', foto: '' };
  selectedFile: File | null = null; 

  constructor(
    private service: SemuaService,
    public dialogRef: MatDialogRef<PopupTbkaryawanComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data) this.karyawan = { ...data };
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
            this.karyawan.foto = response.filename; 
            this.simpanDataKaryawan();
          }, error => {
            console.error('Gagal upload foto:', error);
          });
        } else {
         
          this.simpanDataKaryawan();
        }
      }
    });
  }

  private simpanDataKaryawan() {
    if (this.karyawan.id) {
      
      this.service.editKaryawan(this.karyawan.id, this.karyawan).subscribe(() => this.dialogRef.close(true));
    } else {
      this.service.tambahKaryawan(this.karyawan).subscribe(() => this.dialogRef.close(true));
    }
  }
}
