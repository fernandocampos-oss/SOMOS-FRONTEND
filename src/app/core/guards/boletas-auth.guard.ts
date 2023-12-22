import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { BoletaService } from '@data/services/boleta.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BoletasAuthGuard implements CanActivate {
  constructor(private _boletaService: BoletaService, private _router: Router) {}

  canActivate(): boolean {
    this._router.navigate([`/`]);
    return false;
    this._boletaService.getIfInscritosBoleta().subscribe((data)=>{
      return data;
    });
  }
}
