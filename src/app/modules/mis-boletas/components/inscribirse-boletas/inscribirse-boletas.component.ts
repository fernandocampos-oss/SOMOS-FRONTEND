import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppRoute } from '@data/constants';
import { AuthService, UsuarioService } from '@data/services';
import { BoletaService } from '@data/services/boleta.service';

@Component({
  selector: 'app-inscribirse-boletas',
  templateUrl: './inscribirse-boletas.component.html',
  styleUrls: ['./inscribirse-boletas.component.scss']
})
export class InscribirseBoletasComponent implements OnInit {

  habilitado = false;
  numDoc = '';

  constructor(
    private router         : Router,
    private dialogRef      : MatDialogRef<InscribirseBoletasComponent>,
    private _authService   : AuthService,
    private _userService   : UsuarioService,
    private _boletaService : BoletaService) { }

  ngOnInit(): void {
    this._userService.get(this._authService.getUserSession().id).subscribe((data)=>{
      this.numDoc = data.numeroDocumento;
    })
  }
  inscribirseBoletas(){
    this._boletaService.addInscritosBoleta(this.numDoc);
    this.dialogRef.close();
    this.router.navigate([AppRoute.MIS_BOLETAS]);
  }
}
