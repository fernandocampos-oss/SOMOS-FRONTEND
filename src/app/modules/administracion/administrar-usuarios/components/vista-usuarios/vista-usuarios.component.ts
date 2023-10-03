import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NotificationService } from '@core/services';
import { RedPersonal, RequestDatosUsuarios, UsuarioInformacionResponseDto } from '@data/models/administracion/administracion';
import { AdministracionService } from '@data/services/administracion.service';

@Component({
  selector: 'app-vista-usuarios',
  templateUrl: './vista-usuarios.component.html',
  styleUrls: ['./vista-usuarios.component.scss']
})
export class VistaUsuariosComponent implements OnInit{

  deshabilitarDescarga = false;
  showTable = false;
  frmCtrlRedes = new FormControl('');
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<UsuarioInformacionResponseDto>;
  displayedColumns: string[] = ['item','dni','codPlanilla','nombre','fechaCrea','regimen','cargo','red','unidad','sexo'];

  redesAsignadas: RedPersonal[] = [];
  
  constructor(private _adminServ    : AdministracionService,
              private _notification : NotificationService,) { }

  ngOnInit(): void {
    this.actualizarTabla();
    this.frmCtrlRedes.valueChanges.subscribe((data)=>{
      this.deshabilitarDescarga = false;
      this.actualizarTabla();
    })
  }

  actualizarTabla(){
    this._adminServ.getUsuariosRedes(this.getRequest(10)).subscribe((data)=>{
      if(data.usuarios.length != 0){
        this.redesAsignadas = data.redes;
        this.dataSource = new MatTableDataSource(data.usuarios);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        
        if(this.redesAsignadas.length == 1 && !this.showTable){
          console.log(1)
          this.frmCtrlRedes.setValue(this.redesAsignadas[0].codRed);
          this.frmCtrlRedes.disable()
        }
      }
      else{
        this._notification.warning('No se encuentran usuarios inscritos en esta red');
      }
      this.showTable = true;
    })
  }

  exportarReporte(){
    this._adminServ.getUsuariosRedes(this.getRequest(0)).subscribe((data)=>{
      console.log(data.usuarios)
      this.deshabilitarDescarga = true;
    })
  }

  getRequest(cantidad: number): RequestDatosUsuarios{
    return {
      codRed: this.frmCtrlRedes.value,
      cantidad: cantidad
    }
  }
}
