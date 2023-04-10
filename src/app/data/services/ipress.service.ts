import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env';
import { Ipress } from '@data/models/ipress/ipress.model';

const URL_BASE = `${environment.apiUrl}/ipress`;

@Injectable({
  providedIn: 'root',
})
export class IpressService {
  constructor(private _httpClient: HttpClient) {}

  getAll() {
    return this._httpClient.get<Ipress[]>(URL_BASE);
  }

  getByIdRed(id: number) {
    const url = `${URL_BASE}/${id}/byred`;
    return this._httpClient.get<Ipress[]>(url);
  }
}
