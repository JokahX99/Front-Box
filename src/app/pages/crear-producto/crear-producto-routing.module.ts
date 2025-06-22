import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrearProductoPage } from './crear-producto.page';

const routes: Routes = [
  {
    path: '',
    component: CrearProductoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrearProductoPageRoutingModule {}
