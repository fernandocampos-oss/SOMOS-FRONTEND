import { Component, OnInit } from '@angular/core';
import { AuthService, MarcacionService, UsuarioService } from '@data/services';
import { ColumnDef} from '@shared/table/table.component';
import { UntilDestroy } from '@ngneat/until-destroy';
import { MarcacionesRequest, UserSession } from '@data/models';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// interface Mes{
//   descripcion: string;
//   inicio:string;
//   fin:string;
// }

interface Mes{
  num: number;
  descripcion: string;
}

interface Año{
  anio: number;
}

@UntilDestroy()
@Component({
  selector: 'app-mis-marcaciones',
  templateUrl: './mis-marcaciones.component.html',
  styleUrls: ['./mis-marcaciones.component.scss'],
})
export class MisMarcacionesComponent implements OnInit {
  form: FormGroup;
  user: UserSession;
  lastDayOfMonth: Date;
  today = new Date();
  mesElegido: number;
  anioElegido: number;
  meses: Mes[] = [
    {num: 1,descripcion: 'Enero'},
    {num: 2,descripcion: 'Febrero'},
    {num: 3,descripcion: 'Marzo'},
    {num: 4,descripcion: 'Abril'},
    {num: 5,descripcion: 'Mayo'},
    {num: 6,descripcion: 'Junio'},
    {num: 7,descripcion: 'Julio'},
    {num: 8,descripcion: 'Agosto'},
    {num: 9,descripcion: 'Setiembre'},
    {num: 10,descripcion: 'Octubre'},
    {num: 11,descripcion: 'Noviembre'},
    {num: 12,descripcion: 'Diciembre'},
  ];
  anios: Año[] = [
    {anio: 2022},
    {anio: 2023},
  ];
  // meses: Mes[] = [
  //   {descripcion:'Enero 2023', inicio:`01/01/${this.today.getFullYear()}`,fin:`31/01/${this.today.getFullYear()}`},
  //   {descripcion:'Febrero 2023', inicio:`01/02/${this.today.getFullYear()}`,fin:`28/02/${this.today.getFullYear()}`},
  //   {descripcion:'Marzo 2023', inicio:`01/03/${this.today.getFullYear()}`,fin:`31/03/${this.today.getFullYear()}`},
  //   {descripcion:'Abril 2023', inicio:`01/04/${this.today.getFullYear()}`,fin:`30/04/${this.today.getFullYear()}`},
  // ];
  fechas: FormGroup;
  data = [];
  dato = {
    desde: '',
    hasta: '',
    codigo: '',
  }
  codplanilla: string;
  columns: ColumnDef[] = [
    {
      label: 'Sede',
      name: 'sede',
    },
    {
      label: 'Lectora',
      name: 'lectora',
    },
    {
      label: 'Fecha',
      name: 'fecha',
    },
    {
      label: 'Hora',
      name: 'hora',
    },
    {
      label: 'Terminal Marcacion',
      name: 'terminalmarca',
    },
  ];

  constructor(private _marcacionService: MarcacionService,
              private _fb: FormBuilder,
              private _authService: AuthService,
              private _userService: UsuarioService,
              private _router: Router,
              private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.user = this._authService.getUserSession();
    this._userService.get(this.user.id).subscribe( data =>{
      this.dato.codigo = data.codigoPlanilla;
      });
    this.createForm();
  }

  createForm(){
    this.form = this._fb.group({
      frmMesElegido: [null],
      frmAnioElegido: [null],
    });
  }
  
  Actualizar(){
    this.dato.desde = `01/${this.form.value.frmMesElegido}/${this.form.value.frmAnioElegido}`;
    this.dato.hasta = `${this.getUltimoDiaMes()}/${this.form.value.frmMesElegido}/${this.form.value.frmAnioElegido}`;
    this.user = this._authService.getUserSession();
    this._userService.get(this.user.id).subscribe( data =>{
      this.dato.codigo = data.codigoPlanilla;
      })

    this._marcacionService
    .searchMarcaciones(this.dato)
    .subscribe((data)=>{
      this.data = data;   
    });
  }
  getUltimoDiaMes(){
    this.lastDayOfMonth =new Date(this.form.value.frmAnioElegido,this.form.value.frmMesElegido, 0);
    return this.lastDayOfMonth.getUTCDate();
  }
  back(){
    this._router.navigate([''], { relativeTo: this.route });
  }
}
