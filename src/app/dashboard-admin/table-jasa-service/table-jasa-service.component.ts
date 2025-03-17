import { Component, OnInit } from '@angular/core';
import { SemuaService } from 'src/app/semua.service';
import { MatDialog } from '@angular/material/dialog';
import { PopupTbjasaServiceComponent } from '../popup-tbjasa-service/popup-tbjasa-service.component';
import { PopupKonfirmasiComponent } from '../popup-konfirmasi/popup-konfirmasi.component';

@Component({
  selector: 'app-table-jasa-service',
  templateUrl: './table-jasa-service.component.html',
  styleUrls: ['./table-jasa-service.component.css']
})
export class TableJasaServiceComponent implements OnInit{

  jasaserviceList: any[] = [];
        
        
          constructor(private jasaserviceService: SemuaService,private dialog: MatDialog) {}
        
          ngOnInit() {
            this.loadjasaservice();
          }
        
          loadjasaservice() {
            this.jasaserviceService.getJasaservice().subscribe(
              (data) => {
                this.jasaserviceList = data;
              },
              (error) => {
                console.error('Gagal mengambil data jasaservice:', error);
              }
            );
          }
        
          tambahjasaservice() {
            const dialogRef = this.dialog.open(PopupTbjasaServiceComponent, {
              width: '600px',
              data: null,
            });
        
            dialogRef.afterClosed().subscribe((result) => {
              if (result) this.loadjasaservice();
            });
          }
        
          editjasaservice(jasaservice: any) {
            const dialogRef = this.dialog.open(PopupTbjasaServiceComponent, {
              width: '600px',
              data: jasaservice,
            });
        
            dialogRef.afterClosed().subscribe((result) => {
              if (result) this.loadjasaservice();
            });
          }
        
          hapusjasaservice(id: number) {
            const dialogRef = this.dialog.open(PopupKonfirmasiComponent, {
              width: '300px',
            
            });
                dialogRef.afterClosed().subscribe(result => {
                  if (result) { 
              this.jasaserviceService.hapusJasaservice(id).subscribe(() => this.loadjasaservice());
            }
                })
        }

}
