import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-administracion',
  templateUrl: './administracion.component.html',
  styleUrls: ['./administracion.component.scss']
})
export class AdministracionComponent implements OnInit {

  restringir = false;
  constructor(private _router : Router,
              private route   : ActivatedRoute,) { }

  ngOnInit(): void {
    
  }

  back(){
    this._router.navigate([''], { relativeTo: this.route });
  }
  printValue(event){
    this.restringir = event.checked;
  }
}
