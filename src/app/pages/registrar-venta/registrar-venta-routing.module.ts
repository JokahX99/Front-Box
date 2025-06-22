import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistrarVentaPage } from './registrar-venta.page';

const routes: Routes = [
  {
    path: '',
    component: RegistrarVentaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistrarVentaPageRoutingModule {}
