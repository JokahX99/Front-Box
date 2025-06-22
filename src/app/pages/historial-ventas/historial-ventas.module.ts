import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HistorialVentasPageRoutingModule } from './historial-ventas-routing.module';

import { HistorialVentasPage } from './historial-ventas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HistorialVentasPageRoutingModule
  ],
  declarations: [HistorialVentasPage]
})
export class HistorialVentasPageModule {}
