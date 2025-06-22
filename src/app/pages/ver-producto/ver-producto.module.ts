import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComponentsModule } from 'src/app/components/base1/components.module';
import { IonicModule } from '@ionic/angular';

import { VerProductoPageRoutingModule } from './ver-producto-routing.module';
import { ImageProductPipe } from '../../shared/image-product.pipe';

import { VerProductoPage } from './ver-producto.page';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    FormsModule,
    IonicModule,
    VerProductoPageRoutingModule,
    ImageProductPipe,
  ],
  declarations: [VerProductoPage],
})
export class VerProductoPageModule {}
