import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

import { environment } from '@env';
import { LocalStorageKey, LocalStorageService } from '@core/services';
import {
  UserSession,
  GenerarTokenRecuperarClaveRequest,
  GenerarTokenRecuperarClaveResponse,
  TokenActivacion,
  UsuarioRegisterRequest,
  UsuarioRegisterResponse,
  LoginRequest,
  LoginResponse,
  CambiarClaveRequest,
} from '@data/models';
import { Role } from '@data/enums';
import { AppRoute } from '@data/constants';

const URL_BASE = `${environment.apiUrl}/auth`;

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private _httpClient: HttpClient,
    private _ls: LocalStorageService,
    private _router: Router
  ) { }

  login(model: LoginRequest): Observable<any> {
    const url = `${URL_BASE}/login`;
    const headers: HttpHeaders = this._authBasic(
      model.username,
      model.password
    );

    return this._httpClient
      .post<LoginResponse>(url, null, { headers })
      .pipe(tap((data) => this._setToken(data.token)));
  }

  getRol(): number {
    const idRol = this.getUserSession() ? this.getUserSession().idRol : 0;
    return idRol;
    // return this.getUserSession().idRol;
  }

  getUserSession(): UserSession {
    const tokenEncoded = this._ls.getItem<string>(LocalStorageKey.TOKEN);
    return new JwtHelperService().decodeToken(tokenEncoded);
  }

  getToken(): string {
    return this._ls.getItem<string>(LocalStorageKey.TOKEN);
  }

  isAuthenticated() {
    const token = this._ls.getItem<string>(LocalStorageKey.TOKEN);
    return token && !new JwtHelperService().isTokenExpired(token);
  }

  logout(): void {
    this._ls.removeItem(LocalStorageKey.TOKEN);
    this._router.navigate([`/${AppRoute.AUTH}/${AppRoute.LOGIN}`]);
  }

  hasRol(rol: Role) {
    const user = this.getUserSession();
    return user.idRol === rol;
  }
  hasAnyRol(...roles: Role[]) {
    const user = this.getUserSession();
    return roles.includes(user.idRol);
  }

  register(model: UsuarioRegisterRequest) {
    return this._httpClient.post<UsuarioRegisterResponse>(URL_BASE, model);
  }

  activarToken(model: TokenActivacion) {
    const url = `${URL_BASE}/token/activar`;
    return this._httpClient.put(url, model);
  }

  generarTokenRecuperarClave(request: GenerarTokenRecuperarClaveRequest) {
    const url = `${URL_BASE}/generar-token-recuperar-clave`;
    return this._httpClient.post<GenerarTokenRecuperarClaveResponse>(
      url,
      request
    );
  }

  cambiarClave(request: CambiarClaveRequest) {
    const url = `${URL_BASE}/cambiar-clave`;
    return this._httpClient.put<void>(url, request);
  }

  private _setToken(token: string) {
    this._ls.setItem(LocalStorageKey.TOKEN, token);
  }
  private _authBasic(username: string, password: string) {
    return new HttpHeaders().append(
      'Authorization',
      'Basic ' + btoa(`${username}:${password}`)
    ); // This class is immutable
  }
}
