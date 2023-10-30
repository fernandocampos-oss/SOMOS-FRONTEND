import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdministracionService } from '@data/services/administracion.service';
import { RedesDatos } from '@data/models/administracion/administracion';
import { UntilDestroy } from '@ngneat/until-destroy';
import { TitleCasePipe } from '@angular/common';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { VistaUsuariosComponent } from './components/vista-usuarios/vista-usuarios.component';

@Component({
  selector: 'app-administrar-usuarios',
  templateUrl: './administrar-usuarios.component.html',
  styleUrls: ['./administrar-usuarios.component.scss']
})
export class AdministrarUsuariosComponent implements OnInit {
  // @ViewChild(MatSort) sort: MatSort;
  // @ViewChild(MatPaginator) paginator: MatPaginator;
  // redes: {value: string, descr: string}[];
  // usuariosRed: UsuarioxRed[];

  // usuarios: UsuarioInformacionResponseDto[];
  // redesAsignadas: RedPersonal[];
  
  redElegida: string;
  bkpTotal: number;
  bkpUserAdmin: number;
  bkpUserAsist: number;
  dataSeleccionada: boolean = false;
  datosRedes: RedesDatos;
  cargaLista = false;

  // dataSource: MatTableDataSource<any>;
  // displayedColumns: string[] = ['documento','nombreCompleto','fechaRegistro', 'codRed'];
  single = [];
  
  colorScheme = {
    domain: ['#5AA454', '#C7B42C', '#AAAAAA']
  };

  constructor(private _router       : Router,
              private _adminServ    : AdministracionService,
              private dialogRef     : MatDialog,
              private route         : ActivatedRoute,
              private titlecasePipe : TitleCasePipe) { }

  ngOnInit(): void {
    // this._adminServ.getUsuariosRedes().pipe(untilDestroyed(this)).subscribe((data)=>{
    //   this.usuarios = data.usuarios;
    //   this.redesAsignadas = data.redes;
    //   console.log(document.getElementById("examinar"));
    //   console.log(data);
    // }); 

    this._adminServ.getDatosRedes().subscribe((data)=>{
      this.datosRedes = data;
      this.bkpTotal= data.cuentaTotalUsuarios;
      this.bkpUserAdmin= data.cuentaAdministrativos;
      this.bkpUserAsist= data.cuentaAsistenciales;
      let newArray = data.datosRedes.map(item=>{
        return{
          name: this.titlecasePipe.transform(item.descripcion),
          value: item.cantidad,
          extra:{
            numAsist: item.personalAsistencial,
            numAdmin: item.personalAdministrativo
          },
        };
      })
      this.single = [...newArray];
      // console.log(newArray)
      this.cargaLista = true;
    });
    // if(this.authService.getRol() == 4){
    //   this.cargarTabla('-');
    // }
    // else{
    //   this.cargarTabla('0100');
    //   this.notAdmin = true
    // }
    // this.redes = this._marcacionService.getRedes();
  }
  // ngAfterViewInit() {
  //   this.dataSource.paginator = this.paginator;
  //   this.dataSource.sort = this.sort;
  // }

  back(){
    this._router.navigate([''], { relativeTo: this.route });
  }
  print(obj){
    // console.log(obj.value);
    // this.cargarTabla(obj.value);
  }

  onSelect(data): void {
    console.log(data)
    console.log(this.datosRedes)
    if (this.redElegida !== data.name) {
      this.dataSeleccionada = true;
      this.redElegida = data.name;
      this.datosRedes.cuentaTotalUsuarios = data.value;
      this.datosRedes.cuentaAsistenciales = data.extra.numAsist;
      this.datosRedes.cuentaAdministrativos = data.extra.numAdmin;
    }
    else{
      this.dataSeleccionada = false;
      this.redElegida = undefined;
      this.datosRedes.cuentaTotalUsuarios = this.bkpTotal;
      this.datosRedes.cuentaAsistenciales = this.bkpUserAsist;
      this.datosRedes.cuentaAdministrativos = this.bkpUserAdmin;
    }
  }

  showReporte(){
    const dialogRef: MatDialogRef<VistaUsuariosComponent> = this.dialogRef.open(VistaUsuariosComponent, {
      disableClose: false,
      autoFocus: false,
      width: '80%'
    });
  }

  cargarTabla(red: string){
    // this.dataSource = new MatTableDataSource(this._marcacionService.getUserRed(red));
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }
  // restringirFiltros(event){
  //   this.restringir = event.checked;
  //   console.log(this.frmSede, this.frmAreaPers.value, this.frmGrupoPers.value, this.frmTiempoServ.value);
  //   if (this.restringir == true){

  //   }
  // }
}
