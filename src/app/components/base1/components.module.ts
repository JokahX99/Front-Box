import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { Base1Component } from './base1.component';  // 👈 Importación directa

@NgModule({
  declarations: [Base1Component],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [Base1Component] // 👈 Para poder usarlo en otras páginas
})
export class ComponentsModule {}
