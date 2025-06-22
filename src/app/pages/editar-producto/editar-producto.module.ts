import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditarProductoPageRoutingModule } from './editar-producto-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

import { EditarProductoPage } from './editar-producto.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditarProductoPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [EditarProductoPage]
})
export class EditarProductoPageModule {}
