import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

interface LoginResponse {
  id?: string;
  email: string;
  role: number; 
  table: string;
}


@Injectable({
  providedIn: 'root',
})
export class SemuaService {
  private apiURL = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  checkSession() {
   
    return this.http.get(`${this.apiURL}/protected`, { withCredentials: true });
  }
  

  register(user: any) {
    return this.http.post(`${this.apiURL}/register`, user).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Registration failed', error);
        return throwError(() => new Error('Registration failed'));
      })
    );
  }

  login(user: { email: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiURL}/login`, user, { withCredentials: true });
  }
  

  logout() {
    return this.http.post(`${this.apiURL}/logout`, {}, { withCredentials: true });
  }
  

  getUserById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiURL}/login/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Failed to fetch karyawan:', error);
        return throwError(() => new Error(error.message || 'Failed to fetch karyawan'));
      })
    );
  }

  getPelanggan(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiURL}/pelanggan`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Failed to fetch pelanggan:', error);
        return throwError(() => new Error(error.message || 'Failed to fetch pelanggan'));
      })
    );
  }

  getPelangganById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiURL}/pelanggan/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Failed to fetch pelanggan:', error);
        return throwError(() => new Error(error.message || 'Failed to fetch pelanggan'));
      })
    );
  }

  tambahPelanggan(pelanggan: any): Observable<any> {
    return this.http.post(`${this.apiURL}/pelanggan`, pelanggan).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Gagal menambahkan pelanggan:', error);
        return throwError(() => new Error('Gagal menambahkan pelanggan'));
      })
    );
  }
  
  editPelanggan(id: any, pelanggan: FormData): Observable<any> {
    return this.http.put(`${this.apiURL}/pelanggan/${id}`, pelanggan, {
      headers: { 
        
      }
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Gagal memperbarui pelanggan:', error);
        return throwError(() => new Error('Gagal memperbarui pelanggan'));
      })
    );
  }

  hapusPelanggan(id: number): Observable<any> {
    return this.http.delete(`${this.apiURL}/pelanggan/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Gagal hapus pelanggan:', error);
        return throwError(() => new Error('Gagal hapus pelanggan'));
      })
    );
  }

  getKaryawan(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiURL}/karyawan`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Failed to fetch karyawan:', error);
        return throwError(() => new Error(error.message || 'Failed to fetch karyawan'));
      })
    );
  }

  getKaryawanById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiURL}/karyawan/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Failed to fetch karyawan:', error);
        return throwError(() => new Error(error.message || 'Failed to fetch karyawan'));
      })
    );
  }

  uploadFoto(foto: File): Observable<any> {
    const formData = new FormData();
    formData.append('foto', foto);

    return this.http.post<any>(`${this.apiURL}/upload`, formData).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Failed to upload photo:', error);
        return throwError(() => new Error(error.message || 'Failed to upload photo'));
      })
    );
  }

  tambahKaryawan(karyawan: any): Observable<any> {
    return this.http.post(`${this.apiURL}/karyawan`, karyawan).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Gagal menambahkan karyawan:', error);
        return throwError(() => new Error('Gagal menambahkan karyawan'));
      })
    );
  }
  
  editKaryawan(id: any, karyawan: FormData): Observable<any> {
    return this.http.put(`${this.apiURL}/karyawan/${id}`, karyawan, {
      headers: { 
        
      }
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Gagal memperbarui karyawan:', error);
        return throwError(() => new Error('Gagal memperbarui karyawan'));
      })
    );
  }
  

  hapusKaryawan(id: number): Observable<any> {
    return this.http.delete(`${this.apiURL}/karyawan/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Gagal hapus karyawan:', error);
        return throwError(() => new Error('Gagal hapus karyawan'));
      })
    );
  }

  getKendaraan(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiURL}/kendaraan`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Failed to fetch kendaraan:', error);
        return throwError(() => new Error(error.message || 'Failed to fetch kendaraan'));
      })
    );
  }

  getKendaraanById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiURL}/kendaraan/${id}`);
  }
  

  tambahKendaraan(kendaraan: any): Observable<any> {
    return this.http.post(`${this.apiURL}/kendaraan`, kendaraan).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Gagal menambahkan kendaraan:', error);
        return throwError(() => new Error('Gagal menambahkan kendaraan'));
      })
    );
  }
  
  editKendaraan(id: number, kendaraan: any): Observable<any> {
    return this.http.put(`${this.apiURL}/kendaraan/${id}`, kendaraan).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Gagal menambahkan kendaraan:', error);
        return throwError(() => new Error('Gagal menambahkan kendaraan'));
      })
    );
  }

  hapusKendaraan(id: number): Observable<any> {
    return this.http.delete(`${this.apiURL}/kendaraan/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Gagal hapus kendaraan:', error);
        return throwError(() => new Error('Gagal hapus kendaraan'));
      })
    );
  }

  getSparepart(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiURL}/sparepart`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Failed to fetch sparepart:', error);
        return throwError(() => new Error(error.message || 'Failed to fetch sparepart'));
      })
    );
  }

  getSparepartById(id: number) {
    return this.http.get<any>(`${this.apiURL}/sparepart/${id}`);
}


  tambahSparepart(sparepart: any): Observable<any> {
    return this.http.post(`${this.apiURL}/sparepart`, sparepart).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Gagal menambahkan sparepart:', error);
        return throwError(() => new Error('Gagal menambahkan sparepart'));
      })
    );
  }
  
  updateSparepartStock(sparepartId: number, jumlah: number): Observable<any> {
    console.log("Mengirim request update stok:", { sparepartId, jumlah });
    return this.http.put(`${this.apiURL}/sparepart/${sparepartId}/update-stock`, { jumlah });
    

  }

  editSparepart(id: number, sparepart: any): Observable<any> {
    return this.http.put(`${this.apiURL}/sparepart/${id}`, sparepart).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Gagal menambahkan sparepart:', error);
        return throwError(() => new Error('Gagal menambahkan sparepart'));
      })
    );
  }

  hapusSparepart(id: number): Observable<any> {
    return this.http.delete(`${this.apiURL}/sparepart/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Gagal hapus sparepart:', error);
        return throwError(() => new Error('Gagal hapus sparepart'));
      })
    );
  }

  getJasaservice(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiURL}/jasa-service`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Failed to fetch jasa-service:', error);
        return throwError(() => new Error(error.message || 'Failed to fetch jasa-service'));
      })
    );
  }

  tambahJasaservice(jasaservice: any): Observable<any> {
    return this.http.post(`${this.apiURL}/jasa-service`, jasaservice).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Gagal menambahkan jasa service:', error);
        return throwError(() => new Error('Gagal menambahkan jasa service'));
      })
    );
  }
  
  editJasaservice(id: number, jasaservice: any): Observable<any> {
    return this.http.put(`${this.apiURL}/jasa-service/${id}`, jasaservice).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Gagal menambahkan jasa service:', error);
        return throwError(() => new Error('Gagal menambahkan jasa service'));
      })
    );
  }

  hapusJasaservice(id: number): Observable<any> {
    return this.http.delete(`${this.apiURL}/jasa-service/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Gagal hapus jasa-service:', error);
        return throwError(() => new Error('Gagal hapus jasa service'));
      })
    );
  }

  getBooking(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiURL}/booking`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Failed to fetch booking:', error);
        return throwError(() => new Error(error.message || 'Failed to fetch booking'));
      })
    );
  }

  getBookingById(bookingId: string) {
    return this.http.get(`${this.apiURL}/booking/${bookingId}`);
  }

  getBookingByKendaraan(kendaraanId: number): Observable<any> {
    return this.http.get(`${this.apiURL}/booking/kendaraan/${kendaraanId}`);
  }
  

  getAntrianByDate(tanggal: string): Observable<number> {
    return this.http.get<number>(`${this.apiURL}/antrian/${tanggal}`);
  }
  

  tambahBooking(booking: any): Observable<any> {
    return this.http.post(`${this.apiURL}/booking`, booking).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Gagal menambahkan booking:', error);
        return throwError(() => new Error('Gagal menambahkan booking'));
      })
    );
  }
  
  editBooking(id: number, booking: any): Observable<any> {
    return this.http.put(`${this.apiURL}/booking/${id}`, booking).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Gagal menambahkan booking:', error);
        return throwError(() => new Error('Gagal menambahkan booking'));
      })
    );
  }

  selesaikanBooking(id: number) {
    return this.http.put(`${this.apiURL}/booking/${id}`, { status: "selesai" });
  }
  

  hapusBooking(id: number): Observable<any> {
    return this.http.delete(`${this.apiURL}/booking/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Gagal hapus booking:', error);
        return throwError(() => new Error('Gagal hapus booking'));
      })
    );
  }

  getRiwayat(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiURL}/riwayat`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Failed to fetch riwayat:', error);
        return throwError(() => new Error(error.message || 'Failed to fetch riwayat'));
      })
    );
  }

  getRiwayatById(riwayatId: number, pelangganId: number) {
    return this.http.get<any>(`${this.apiURL}/riwayat/${riwayatId}?pelangganId=${pelangganId}`);
  }
  


  tambahRiwayat(riwayat: any) {
    return this.http.post(`${this.apiURL}/riwayat`, riwayat).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('❌ Gagal menambahkan riwayat:', error);
        return throwError(() => new Error(error.message));
      })
    );
  }
  
  editRiwayat(id: number, riwayat: any): Observable<any> {
    return this.http.put(`${this.apiURL}/riwayat/${id}`, riwayat).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Gagal edit riwayat:', error);
        return throwError(() => new Error('Gagal edit riwayat'));
      })
    );
  }

  hapusRiwayat(id: number): Observable<any> {
    return this.http.delete(`${this.apiURL}/riwayat/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Gagal hapus riwayat:', error);
        return throwError(() => new Error('Gagal hapus riwayat'));
      })
    );
  }

  getKendaraanByPelanggan(id_pelanggan: string) {
    return this.http.get(`${this.apiURL}/kendaraan/pelanggan/${id_pelanggan}`);
  }
  
  getKendaraanByPelangganId(id_pelanggan: string): Observable<any[]> {
    return this.http.get<any[]>(`/kendaraan/pelanggan/${id_pelanggan}`);
  }

  getLaporanBulanan(month: number, year: number, page: number, limit: number) {
    return this.http.get<any>(`${this.apiURL}/laporan-bulanan?month=${month}&year=${year}&page=${page}&limit=${limit}`);
  }
  
  
  getPendapatanTotal(month: number, year: number) {
    return this.http.get<any>(`${this.apiURL}/laporan-bulanan-summary?month=${month}&year=${year}`);
  }
  

}
