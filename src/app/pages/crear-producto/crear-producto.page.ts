import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { NavController, ToastController } from '@ionic/angular';
import { producto } from 'src/app/models/producto.models';
import { ProductoService } from 'src/app/service/producto.service';

import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, map, of, catchError } from 'rxjs';


@Component({
  selector: 'app-crear-producto',
  templateUrl: './crear-producto.page.html',
  styleUrls: ['./crear-producto.page.scss'],
  standalone: false,
})
export class CrearProductoPage {
  public imageFileList: FileList | undefined = undefined;
  public tempImages: string[] = [];
  public cargando: boolean = false;
  private readonly router = inject(Router);
  private readonly toastController = inject(ToastController);
  private readonly _productoService = inject(ProductoService);
  private readonly _formBuilder = inject(FormBuilder);

  public productForm = this._formBuilder.group({
    codigo: [
    '',
    [Validators.required, Validators.minLength(3)],
    [this.codigoUnicoValidator()]
  ],
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    stock: [0, [Validators.required,Validators.min(1)]],
    precio: [0, [Validators.required,Validators.min(1)]],
    descripcion: ['', [Validators.required, Validators.minLength(3)]],
    images: [[]],
  });

  public crearProducto() {
    this.cargando = true;
  if (this.productForm.invalid || this.tempImages.length === 0) {
    this.showToast1('Por favor completa todos los campos y selecciona al menos una imagen.');
    this.cargando = false;
    return;
  }

  const product = this.productForm.value as producto;

  this._productoService.createProducto(product, this.imageFileList).subscribe({
    next: () => {
      this.showToast2('Producto creado correctamente');
      this.router.navigate(['/principal']);
    },
    error: (err) => {
      if (err.error?.message?.toLowerCase().includes('codigo')) {
        this.showToast1('El código ya está en uso. Debe ser único.');
        this.cargando = false;
      } else {
        this.cargando = false;
        this.showToast1('Ocurrió un error al crear el producto.');
      }
    },
  });
}

  public home() {
    this.router.navigate(['/principal']);
  }

  public onFilesChanged(event: Event) {
    const fileList = (event.target as HTMLInputElement).files;

    this.imageFileList = fileList ?? undefined;

    const imagesUrls = Array.from(fileList ?? []).map((file) =>
      URL.createObjectURL(file)
    );

    this.tempImages = imagesUrls;
  }

  public removeImage(index: number) {
  this.tempImages.splice(index, 1);

  const dt = new DataTransfer();
  Array.from(this.imageFileList || []).forEach((file, i) => {
    if (i !== index) dt.items.add(file);
  });
  this.imageFileList = dt.files;
}

private async showToast1(message: string) {
  const toast = await this.toastController.create({
    message,
    duration: 2500,
    color: 'danger',
    position: 'bottom',
  });

  toast.present();
}

private async showToast2(message: string) {
  const toast = await this.toastController.create({
    message,
    duration: 2500,
    color: 'success',
    position: 'bottom',
  });

  toast.present();
}

private codigoUnicoValidator(): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const codigo = control.value;

    if (!codigo) return of(null);

    return this._productoService.getProductos().pipe(
      map(productos => {
        const exists = productos.some(p => p.codigo === codigo);
        return exists ? { codigoDuplicado: true } : null;
      }),
      catchError(() => of(null)) // evita errores de red que bloqueen validación
    );
  };
}

}
