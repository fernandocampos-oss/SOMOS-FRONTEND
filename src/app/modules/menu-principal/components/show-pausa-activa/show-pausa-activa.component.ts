import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-show-pausa-activa',
  templateUrl: './show-pausa-activa.component.html',
  styleUrls: ['./show-pausa-activa.component.scss']
})
export class ShowPausaActivaComponent implements OnInit {
  pathVideo?: string = 'https://portal.essalud.gob.pe/wp-content/uploads/2024/08/SEGURIDAD_Y_SALUD_EN_EL_TRABAJO_08082024.mp4';
  pathFile?: string = 'https://portal.essalud.gob.pe/wp-content/uploads/2024/08/pausas_activas_en_el_trabajo_08082024.pdf';
  isVideoEnded: boolean = false;

  @ViewChild('videoPlayer') videoPlayer: ElementRef<HTMLVideoElement>;

  constructor() { }

  ngOnInit(): void {
  }

  onVideoEnded() {
    this.isVideoEnded = true;
  }

  downloadPDF() {
    const link = document.createElement('a');
    link.href = this.pathFile;
    link.download = 'pausas_activas.pdf';
    link.style.display = 'none';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

}
