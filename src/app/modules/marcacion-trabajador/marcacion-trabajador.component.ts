import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BarcodeFormat } from '@zxing/library';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';

import { TipoMarcacion } from '@data/enums/tipo-marcacion.enum';
import { MarcacionTrabajadorRegister } from '@data/models';
import { MarcacionService } from '@data/services';
import {
  Coordenadas,
  LocationService,
  NotificationService,
} from '@core/services';
import { map } from 'rxjs/operators';
import { AppConfig } from '@core/configs';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { Router, ActivatedRoute } from '@angular/router';

@UntilDestroy()
@Component({
  selector: 'app-marcacion-trabajador',
  templateUrl: './marcacion-trabajador.component.html',
  styleUrls: ['./marcacion-trabajador.component.scss'],
})
export class MarcacionTrabajadorComponent implements OnInit {
  cameras: MediaDeviceInfo[] = [];
  cameraCtrl = new FormControl();
  form: FormGroup;
  allowedFormats = [BarcodeFormat.QR_CODE];
  tipoMarcacionEntrada = TipoMarcacion.ENTRADA;
  tipoMarcacionSalida = TipoMarcacion.SALIDA;
  tipoMarcacionSelected: TipoMarcacion;
  isDenied: boolean;
  isSelectEntrada: boolean;
  isSelectSalida: boolean;
  delayBetweenScanSuccess =
    AppConfig.DELAY_BETWEEN_SCAN_SUCCESS_IN_MILLISECONDS;

  @ViewChild('scanner', { static: false })
  scanner: ZXingScannerComponent;

  constructor(
    private _marcacionService: MarcacionService,
    private _fb: FormBuilder,
    private _notification: NotificationService,
    private _locationService: LocationService,
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
    this._createForm();
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

  private _createForm() {
    this.form = this._fb.group({
      numeroDocumento: [null, Validators.required],
    });
  }

  cameraFound($event: MediaDeviceInfo[]) {
    this.cameras = $event;
  }
  async scanSuccessHandler(data: string) {
    const coordenadas = await this._locationService.getLocation();
    if (!coordenadas) {
      this._notification.warning('Error al obtener coordenadas');
      return;
    }

    const model = this._getModel(data, coordenadas);
    this.tipoMarcacionSelected = null;
    this._marcacionService
      .saveMarcacionTrabajador(model)
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
  onChangeTipoMarcacion(tipoMarcacion: TipoMarcacion) {
    this.tipoMarcacionSelected = tipoMarcacion;
  }
  private _handleRegisterMarcacion(): void {
    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.form.updateValueAndValidity();
    this._notification.success('Marcación registrada correctamente');
  }
  private _getModel(
    token: string,
    coordenadas: Coordenadas
  ): MarcacionTrabajadorRegister {
    return {
      idTipoMarcacion: this.tipoMarcacionSelected,
      token,
      latitud: String(coordenadas.lat),
      longitud: String(coordenadas.lng),
      ...this.form.value,
    };
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
