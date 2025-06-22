import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductoService } from 'src/app/service/producto.service';
import { VentaService } from 'src/app/service/venta.service';
import { producto } from 'src/app/models/producto.models';

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

  constructor(
    private fb: FormBuilder,
    private productoService: ProductoService,
    private ventaService: VentaService
  ) {
    this.ventaForm = this.fb.group({
      fecha: [new Date().toISOString().substring(0, 10), Validators.required],
      nro_boleta: [null, Validators.required],
    });
  }

  ngOnInit() {
    this.productoService.getProductos().subscribe((data) => {
      this.productos = data;
    });

    this.generarBoleta().then((nro) => {
      this.ventaForm.patchValue({ nro_boleta: nro });
    });
  }

  // 🔄 Fecha
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

  // 🔎 Autocompletado
  filtrarProductos(termino: string) {
    console.log('Buscando:', termino);
    this.productosFiltrados = this.productos.filter((p) =>
      p.nombre.toLowerCase().includes(termino.toLowerCase())
    );
  }

  // ➕ Agregar producto
  agregarProducto(producto: producto) {
    const existente = this.productosVenta.find(p => p.productoId === producto.id);

    if (existente) {
      existente.cantidad++;
      existente.montoTotal = existente.cantidad * existente.precioUnitario;
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
    this.productosVenta[i].montoTotal =
      this.productosVenta[i].cantidad * this.productosVenta[i].precioUnitario;
    this.actualizarTotales();
  }

  disminuirCantidad(i: number) {
    if (this.productosVenta[i].cantidad > 1) {
      this.productosVenta[i].cantidad--;
      this.productosVenta[i].montoTotal =
        this.productosVenta[i].cantidad * this.productosVenta[i].precioUnitario;
      this.actualizarTotales();
    }
  }

  eliminarProducto(index: number) {
    this.productosVenta.splice(index, 1);
    this.actualizarTotales();
  }

  actualizarTotales() {
    this.subMonto = this.productosVenta.reduce((sum, p) => sum + p.montoTotal, 0);
    this.iva = Math.round(this.subMonto * 0.19);
    this.montoTotal = this.subMonto + this.iva;
  }

  registrarVenta() {
    const venta = {
      fecha: new Date(this.ventaForm.value.fecha),
      nro_boleta: this.ventaForm.value.nro_boleta,
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
    const ventas = (await this.ventaService.getVentas().toPromise()) ?? [];

    while (ventas.some(v => v.nro_boleta === nroBoleta)) {
      nroBoleta = Math.floor(100000 + Math.random() * 900000);
    }

    return nroBoleta;
  }
}
