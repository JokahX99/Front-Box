import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductoService } from 'src/app/service/producto.service';
import { VentaService } from 'src/app/service/venta.service';
import { producto } from 'src/app/models/producto.models';
import { AuthService } from 'src/app/service/auth.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-registrar-venta',
  templateUrl: './registrar-venta.page.html',
  styleUrls: ['./registrar-venta.page.scss'],
  standalone: false,
})
export class RegistrarVentaPage implements OnInit {
  today: string = new Date().toISOString().substring(0, 10);
  ventaForm: FormGroup;
  productos: producto[] = [];
  productosFiltrados: producto[] = [];
  productosVenta: any[] = [];
  busqueda: string = '';
  mostrarCalendario = false;

  subMonto = 0;
  iva = 0;
  montoTotal = 0;

  usuarioCargado: boolean = false;  // Para saber si el usuario está listo

  constructor(
    private fb: FormBuilder,
    private productoService: ProductoService,
    private ventaService: VentaService,
    private authService: AuthService
  ) {
    this.ventaForm = this.fb.group({
      fecha: [this.today, Validators.required],
      nro_boleta: [null, Validators.required],
    });
  }

  async ngOnInit() {
    // Esperamos que el estado de autenticación se valide y usuario se cargue
    const autenticado = await firstValueFrom(this.authService.checkStatus());

    if (!autenticado) {
      alert('No estás autenticado. Por favor inicia sesión.');
      // Aquí podrías redirigir a login si quieres
      return;
    }

    console.log('Usuario cargado:', this.authService.user);
    this.usuarioCargado = true;

    // Cargar productos
    this.productoService.getProductos().subscribe((data) => {
      this.productos = data;
    });

    // Generar número de boleta único
    const nro = await this.generarBoleta();
    this.ventaForm.patchValue({ nro_boleta: nro });
  }

  toggleCalendario() {
    this.mostrarCalendario = !this.mostrarCalendario;
  }

  cerrarCalendario() {
    this.mostrarCalendario = false;
  }

  seleccionarFecha(event: any) {
    const fecha = event.detail.value;
    this.ventaForm.patchValue({ fecha });
    this.mostrarCalendario = false;
  }

  filtrarProductos(termino: string) {
    this.productosFiltrados = this.productos.filter((p) =>
      p.nombre.toLowerCase().includes(termino.toLowerCase())
    );
  }

  agregarProducto(producto: producto) {
    const existente = this.productosVenta.find(p => p.productoId === producto.id);

    if (existente) {
      existente.cantidad++;
    } else {
      this.productosVenta.push({
        productoId: producto.id,
        codigo: producto.codigo,
        nombre: producto.nombre,
        cantidad: 1,
        precioUnitario: producto.precio,
        montoTotal: producto.precio,
      });
    }

    this.busqueda = '';
    this.productosFiltrados = [];
    this.actualizarTotales();
  }

  incrementarCantidad(i: number) {
    this.productosVenta[i].cantidad++;
    this.actualizarTotales();
  }

  disminuirCantidad(i: number) {
    if (this.productosVenta[i].cantidad > 1) {
      this.productosVenta[i].cantidad--;
      this.actualizarTotales();
    }
  }

  eliminarProducto(index: number) {
    this.productosVenta.splice(index, 1);
    this.actualizarTotales();
  }

  actualizarTotales() {
    this.subMonto = this.productosVenta.reduce((sum, p) => sum + p.cantidad * p.precioUnitario, 0);
    this.iva = Math.round(this.subMonto * 0.19);
    this.montoTotal = this.subMonto + this.iva;
  }

  registrarVenta() {
    if (!this.usuarioCargado) {
      alert('Usuario no autenticado aún. Intenta de nuevo en unos segundos.');
      return;
    }

    const currentUser = this.authService.user;

    if (!currentUser) {
      alert('No se pudo obtener el usuario autenticado');
      return;
    }

    const venta = {
      fecha: new Date(this.ventaForm.value.fecha),
      nro_boleta: this.ventaForm.value.nro_boleta,
      subMonto: this.subMonto,
      iva: this.iva,
      montoTotal: this.montoTotal,
      ventaProductos: this.productosVenta.map((p) => ({
        productoId: p.productoId,
        cantidad: p.cantidad,
      })),
    };

    this.ventaService.create(venta).subscribe({
      next: () => {
        alert('Venta registrada correctamente');
        this.productosVenta = [];
        this.actualizarTotales();
        this.ventaForm.reset({
          fecha: new Date().toISOString().substring(0, 10),
        });
        this.generarBoleta().then((nro) =>
          this.ventaForm.patchValue({ nro_boleta: nro })
        );
      },
      error: (err) => {
        console.error(err);
        alert('Error al registrar la venta');
      },
    });
  }

  async generarBoleta(): Promise<number> {
    let nroBoleta = Math.floor(100000 + Math.random() * 900000);
    const ventas = (await firstValueFrom(this.ventaService.getVentas())) ?? [];

    while (ventas.some(v => v.nro_boleta === nroBoleta)) {
      nroBoleta = Math.floor(100000 + Math.random() * 900000);
    }

    return nroBoleta;
  }
}
