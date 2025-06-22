import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { producto } from 'src/app/models/producto.models';
import { ProductoService } from 'src/app/service/producto.service';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-editar-producto',
  templateUrl: './editar-producto.page.html',
  styleUrls: ['./editar-producto.page.scss'],
  standalone:false,
})
export class EditarProductoPage implements OnInit {
  productForm!: FormGroup;
  tempImages: string[] = [];
  productoEditando!: producto;
  public cargando: boolean = false;
  constructor(
    
    private router: Router,
    private location: Location,
    private fb: FormBuilder,
    private productoService: ProductoService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    const nav = this.router.getCurrentNavigation();
    this.productoEditando = nav?.extras.state?.['producto'];

    this.productForm = this.fb.group({
      codigo: [{ value: '', disabled: true }, Validators.required],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      stock: [0, [Validators.required, Validators.min(1)]],
      precio: [0, [Validators.required, Validators.min(1)]],
    });

    if (this.productoEditando) {
      this.productForm.patchValue({
        codigo: this.productoEditando.codigo,
        nombre: this.productoEditando.nombre,
        descripcion: this.productoEditando.descripcion,
        stock: this.productoEditando.stock,
        precio: this.productoEditando.precio,
      });

      this.tempImages = [...(this.productoEditando.images || [])];
    }
  }

  volver() {
    this.location.back();
  }

  onFilesChanged(event: any) {
    const files: FileList = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.onload = () => {
        this.tempImages.push(reader.result as string);
      };
      reader.readAsDataURL(files[i]);
    }
  }

  removeImage(index: number) {
    this.tempImages.splice(index, 1);
  }

  guardarCambios() {
    this.cargando = true;
    if (this.productForm.invalid || this.tempImages.length === 0) {
      this.cargando = false;
      this.productForm.markAllAsTouched();
      this.toastController.create({
        message: 'Completa todos los campos correctamente.',
        duration: 2000,
        color: 'danger',
      }).then(toast => toast.present());
      return;
    }

    const formData = {
      ...this.productForm.getRawValue(),
      images: this.tempImages,
    } as producto;

    this.productoService.updateProducto(this.productoEditando.id, formData)
      .subscribe({
        next: () => {
          this.cargando = false;
          this.toastController.create({
            message: 'Producto actualizado con éxito.',
            duration: 2000,
            color: 'success',
          }).then(toast => toast.present());

          this.router.navigate(['/principal']);
        },
        error: () => {
          this.cargando = false;
          this.toastController.create({
            message: 'Error al actualizar el producto.',
            duration: 2000,
            color: 'danger',
          }).then(toast => toast.present());
        }
      });
  }
}
