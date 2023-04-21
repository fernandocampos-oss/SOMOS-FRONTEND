import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService, MarcacionService, UsuarioService } from '@data/services';
import { ColumnDef} from '@shared/table/table.component';
import { UntilDestroy } from '@ngneat/until-destroy';
import { UserSession } from '@data/models';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortable } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { BreakpointObserver, BreakpointState, Breakpoints} from '@angular/cdk/layout';

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
  
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  form: FormGroup;
  user: UserSession;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['terminalmarca','fecha','hora', 'descripcion','lectora','sede'];
  today = new Date();
  form4Mobile = false;
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
  data = [];
  dato = {
    desde: '',
    hasta: '',
    codigo: '',
  }
  columns: ColumnDef[] = [
    {
      label: 'Terminal Marcacion',
      name: 'terminalmarca',
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
      label: 'Lectora',
      name: 'descripcion',
    },
    {
      label: 'Registro',
      name: 'lectora',
    },
    {
      label: 'Sede',
      name: 'sede',
    },
  ];
  public showContainer: boolean;

  constructor(private _marcacionService: MarcacionService,
              private _fb: FormBuilder,
              private _authService: AuthService,
              private _userService: UsuarioService,
              private _router: Router,
              private route: ActivatedRoute,
              public breakpointObserver: BreakpointObserver,
              private responsive  : BreakpointObserver,) {}

  ngOnInit(): void {
    this.responsive.observe([
      Breakpoints.HandsetLandscape,
      Breakpoints.XSmall,   
      Breakpoints.Small,   
      Breakpoints.TabletLandscape,
      ])
      .subscribe(result => {
        this.form4Mobile = false; 
        if (result.matches) {
          this.form4Mobile = true;
        }
  });
    this.createForm();
    this.form.controls.frmMesElegido.setValue(this.today.getMonth()+1);
    this.form.controls.frmAnioElegido.setValue(this.today.getFullYear());
    this.user = this._authService.getUserSession();
    this._userService.get(this.user.id).subscribe( data =>{
      this.dato.codigo = data.codigoPlanilla;
      this.Actualizar();
      this.sort.sort(({ id: 'fecha', start: 'desc'}) as MatSortable);
      });
  }
  createForm(){
    this.form = this._fb.group({
      frmMesElegido: [null],
      frmAnioElegido: [null],
    });
  }
  
  Actualizar(){
    if(this.form.value.frmMesElegido == 12){
      this.dato.desde = `01/${this.form.value.frmMesElegido}/${this.form.value.frmAnioElegido}`;
      this.dato.hasta = `01/01/${this.form.value.frmAnioElegido+1}`;
    }
    else{
      this.dato.desde = `01/${this.form.value.frmMesElegido}/${this.form.value.frmAnioElegido}`;
      this.dato.hasta = `01/${this.form.value.frmMesElegido+1}/${this.form.value.frmAnioElegido}`;
    }
    this._marcacionService
    .searchMarcaciones(this.dato)
    .subscribe((data)=>{
      if (data.length > 0) {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      } else {
        this.dataSource=null;
      }
    });
  }
  back(){
    this._router.navigate([''], { relativeTo: this.route });
  }
}
