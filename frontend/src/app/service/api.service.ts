import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'   // ✔ makes service globally available
})
export class ApiService {
  // configure backend base url here or via env replacement when deploying
  private API = (window as any).__env?.API_BASE || 'http://localhost:3000/api/currency';

  constructor(private http: HttpClient) { console.log("API",this.API)}
 
  symbols(): Observable<any> {
    return this.http.get(`${this.API}/symbols`);
  }

  convert(base: string, target: string, amount: number, date?: string) {
    let params = new HttpParams()
      .set('base', base)
      .set('target', target)
      .set('amount', String(amount));
    if (date) params = params.set('date', date);
    return this.http.get(`${this.API}/convert`, { params });
  }
}
