import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-image-options',
  templateUrl: './image-options.component.html',
  styleUrls: ['./image-options.component.scss']
})
export class ImageOptionsComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,) { }

  ngOnInit(): void {
  }

  print(){
    const byteString = window.atob(this.data.imagenBase64);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/png' });
    let url = window.URL.createObjectURL(blob);
    let a = document.createElement('a');
    document.body.appendChild(a);
    a.setAttribute('style', 'display: none');
    a.href = url;
    a.download = "Inscripcion " + this.data.idInscripcion + '_' + this.data.descripcion + "." + 'png';
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }
}
