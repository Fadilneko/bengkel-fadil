import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-detail-riwayat',
  templateUrl: './detail-riwayat.component.html',
  styleUrls: ['./detail-riwayat.component.css']
})
export class DetailRiwayatComponent {

  constructor(
    public dialogRef: MatDialogRef<DetailRiwayatComponent>,
    @Inject(MAT_DIALOG_DATA) public riwayat: any
  ) {}

  closeDialog() {
    this.dialogRef.close();
  }

  getTotalPembayaran(): number {
    const hargaService = this.riwayat.jasa?.harga || 0;
    const subtotalSparepart = this.getSubtotalSparepart();
    return hargaService + subtotalSparepart;
  }
  

  getSubtotalSparepart(): number {
    if (!this.riwayat.spareparts || !this.riwayat.spareparts.length) {
      return 0;
    }
    return this.riwayat.spareparts.reduce((sum: number, sp: any) => {
      const hargaJual = sp.riwayat_sparepart?.harga_jual || 0;
      const jumlah = sp.riwayat_sparepart?.jumlah_sparepart || 0;
      return sum + hargaJual * jumlah;
    }, 0);
  }
  
  
  
}