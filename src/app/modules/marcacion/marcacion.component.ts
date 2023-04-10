import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';

import { ZXingScannerComponent } from '@zxing/ngx-scanner';
import { BarcodeFormat } from '@zxing/library';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';

import { TipoMarcacion } from '@data/enums/tipo-marcacion.enum';
import { MarcacionRegister } from '@data/models';
import { MarcacionService } from '@data/services/marcacion.service';
import {
  LocationService,
  Coordenadas,
  NotificationService,
} from '@core/services';
import { map, finalize } from 'rxjs/operators';
import { AppConfig } from '@core/configs';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';

@UntilDestroy()
@Component({
  selector: 'app-marcacion',
  templateUrl: './marcacion.component.html',
  styleUrls: ['./marcacion.component.scss'],
})
export class MarcacionComponent implements OnInit {
  cameras: MediaDeviceInfo[] = [];
  cameraCtrl = new FormControl();
  allowedFormats = [BarcodeFormat.QR_CODE];
  isMarked = false;
  tipoMarcacionEntrada = TipoMarcacion.ENTRADA;
  tipoMarcacionSalida = TipoMarcacion.SALIDA;
  tipoMarcacionSelected: TipoMarcacion;
  delayBetweenScanSuccess = AppConfig.DELAY_BETWEEN_SCAN_SUCCESS_IN_MILLISECONDS;
  isDenied: boolean;
  isSelectEntrada: boolean;
  isSelectSalida: boolean;

  @ViewChild('scanner', { static: false })
  scanner: ZXingScannerComponent;

  constructor(
    private _marcacionService: MarcacionService,
    private _locationService: LocationService,
    private _notification: NotificationService,
    private _changeDetectRef: ChangeDetectorRef,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private _router: Router,
    private route: ActivatedRoute

  ) {
    this.matIconRegistry.addSvgIcon("pop_out",this.domSanitizer.bypassSecurityTrustResourceUrl("assets/images/svg/popout.svg"));
    this.matIconRegistry.addSvgIcon("login",this.domSanitizer.bypassSecurityTrustResourceUrl("assets/images/svg/log-in.svg"));
    this.matIconRegistry.addSvgIcon("qr_code",this.domSanitizer.bypassSecurityTrustResourceUrl("assets/images/svg/qr_code.svg"));
  }

  ngOnInit(): void {
    this._handlePermission();
  }
  private _handlePermission() {
    this._locationService.permission$
      .pipe(map((permission) => permission === 'denied'))
      .subscribe((isDenied) => {
        this.isDenied = isDenied;
        this._changeDetectRef.detectChanges();
      });
  }

  cameraFound($event: MediaDeviceInfo[]) {
    this.cameras = $event;
  }
  async scanSuccessHandler(token: string) {
    const coordenadas = await this._locationService.getLocation();
    if (!coordenadas) {
      this._notification.warning('Error al obtener coordenadas');
      return;
    }

    const model = this._getModel(token, coordenadas);

    this.tipoMarcacionSelected = null;
    this._marcacionService
      .save(model)
      .pipe(untilDestroyed(this))
      .subscribe(() => this._handleRegisterMarcacion());
  }
  cameraChange(deviceId: string) {
    this.scanner.device = this.cameras.find((x) => x.deviceId === deviceId);
  }
  deviceChange($event: MediaDeviceInfo) {
    if ($event) {
      this.cameraCtrl.setValue($event.deviceId);
    }
  }
  private _handleRegisterMarcacion(): void {
    this.isMarked = true;
    this.isSelectEntrada = false;
    this.isSelectSalida = false
  }
  private _getModel(
    token: string,
    coordenadas: Coordenadas
  ): MarcacionRegister {
    return {
      idTipoMarcacion: this.tipoMarcacionSelected,
      token,
      latitud: String(coordenadas.lat),
      longitud: String(coordenadas.lng),
    };
  }

  openMisMarcaciones() {
    this._router.navigateByUrl('/mis-marcaciones');
  }

  selectEntrada() {
    this.tipoMarcacionSelected = this.tipoMarcacionEntrada;
    this.isSelectEntrada = true;
    this.isSelectSalida = false;
  }

  selectSalida() {
    this.tipoMarcacionSelected = this.tipoMarcacionSalida;
    this.isSelectEntrada = false;
    this.isSelectSalida = true;
  }

  back(){
    this._router.navigate([''], { relativeTo: this.route });
  }
}
