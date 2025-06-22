import { isStandalone, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'; // 👈 se agrega CUSTOM_ELEMENTS_SCHEMA
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistrarVentaPageRoutingModule } from './registrar-venta-routing.module';
import { RegistrarVentaPage } from './registrar-venta.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RegistrarVentaPageRoutingModule
  ],
  declarations: [RegistrarVentaPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // 👈 se agrega aquí
})
export class RegistrarVentaPageModule {}
