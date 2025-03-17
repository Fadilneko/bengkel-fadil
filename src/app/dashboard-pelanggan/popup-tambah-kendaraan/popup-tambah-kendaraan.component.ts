import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SemuaService } from 'src/app/semua.service';

@Component({
  selector: 'app-popup-tambah-kendaraan',
  templateUrl: './popup-tambah-kendaraan.component.html',
  styleUrls: ['./popup-tambah-kendaraan.component.css']
})
export class PopupTambahKendaraanComponent {

  motor: any = {
    id_pelanggan: this.data.id_pelanggan || null,
    id: this.data.id || null, 
    nopol: this.data.nopol || '',
    merek: this.data.merek || '',
    tipe: this.data.tipe || '',
    transmisi: this.data.transmisi || null,
    kapasitas_cc: this.data.kapasitas_cc || null,
    tahun: this.data.tahun || null,
  };

  isEditMode: boolean = !!this.data.id; 

  constructor(
    private dialogRef: MatDialogRef<PopupTambahKendaraanComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: SemuaService
  ) {
    console.log('Data yang diterima:', data);
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSave() {
    if (this.isEditMode) {
   
      this.service.editKendaraan(this.motor.id, this.motor).subscribe(
        () => {
          console.log('Kendaraan berhasil diupdate');
          this.dialogRef.close(true);
        },
        (error) => {
          console.error('Error updating kendaraan:', error);
        }
      );
    } else {
    
      this.service.tambahKendaraan(this.motor).subscribe(
        () => {
          console.log('Kendaraan berhasil ditambahkan');
          this.dialogRef.close(true);
        },
        (error) => {
          console.error('Error creating kendaraan:', error);
        }
      );
    }
  }
}
