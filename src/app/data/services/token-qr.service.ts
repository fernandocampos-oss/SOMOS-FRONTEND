import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@env';
import { TokenQr } from '@data/models/token-qr/token-qr.model';

const URL_BASE = `${environment.apiUrl}/token-qr`;

@Injectable({ providedIn: 'root' })
export class TokenQrService {
  constructor(private _httpClient: HttpClient) {}

  generarToken() {
    const url = `${URL_BASE}`;
    return this._httpClient.post<TokenQr>(url, {});
  }
}
