import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular'; // <-- Make sure this is imported
import { ComponentsModule } from 'src/app/components/base1/components.module';
import { PrincipalPageRoutingModule } from './principal-routing.module';
import { PrincipalPage } from './principal.page';
import { ImageProductPipe } from '../../shared/image-product.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PrincipalPageRoutingModule,
    ComponentsModule,
    ImageProductPipe,
  ],
  declarations: [PrincipalPage],
})
export class PrincipalPageModule {}
