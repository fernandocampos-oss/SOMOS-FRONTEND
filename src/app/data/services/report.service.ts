import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '@env';

const URL_BASE = `${environment.apiUrl}/reportes`;

@Injectable({ providedIn: 'root' })
export class ReportService {
  constructor(private _httpClient: HttpClient) {}

  getMarcaciones(): Observable<any> {
    const url = `${URL_BASE}/marcaciones`;
    return this._httpClient.get(url, { responseType: 'blob' });
  }
}
