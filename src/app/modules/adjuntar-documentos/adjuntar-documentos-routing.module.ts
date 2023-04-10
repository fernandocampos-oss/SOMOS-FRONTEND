import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdjuntarDocumentosComponent } from './adjuntar-documentos.component';

const routes: Routes = [ {
  path: '',
  component: AdjuntarDocumentosComponent,
},];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdjuntarDocumentosRoutingModule { }
