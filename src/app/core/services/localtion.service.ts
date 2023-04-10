import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Coordenadas {
  lat: number;
  lng: number;
}

@Injectable({ providedIn: 'root' })
export class LocationService {
  permissionSubject$ = new Subject<PermissionState>();
  permission$ = this.permissionSubject$.asObservable();

  constructor() {
    this._listenerPermission();
  }

  private _listenerPermission() {
    navigator.permissions.query({ name: 'geolocation' }).then((result) => {
      if (result.state === 'prompt') {
        // open request permission
        navigator.geolocation.getCurrentPosition(() => {});
      }
      this.permissionSubject$.next(result.state);
      result.onchange = () => {
        this.permissionSubject$.next(result.state);
      };
    });
  }
  getLocation() {
    return new Promise<Coordenadas>((resolve, _) => {
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        resolve({ lat: coords.latitude, lng: coords.longitude });
      });
    });
  }
}
