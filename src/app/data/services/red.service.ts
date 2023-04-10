import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env';
import { Red } from '@data/models/red/red.model';

const URL_BASE = `${environment.apiUrl}/red`;

@Injectable({
  providedIn: 'root',
})
export class RedService {
  constructor(private _httpClient: HttpClient) {}

  getAll() {
    return this._httpClient.get<Red[]>(URL_BASE);
  }
}