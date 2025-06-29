import { Component, OnInit } from '@angular/core';
import { VentaService } from 'src/app/service/venta.service';
import { ProductoService } from 'src/app/service/producto.service'; // Asegúrate que exista

@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.page.html',
  styleUrls: ['./estadisticas.page.scss'],
  standalone:false,
})
export class EstadisticasPage implements OnInit {
  fechaActual = new Date();
  nombreMesActual = '';
  anioActual = 0;
  gananciasDelMes = 0;
  totalVentas = 0;
  totalProductos = 0;
  topVentasDelMes: any[] = [];
  productosMasVendidos: any[] = [];
  productosConMasStock: any[] = [];
  productosConMenosStock: any[] = [];

  constructor(
    private ventaService: VentaService,
    private productoService: ProductoService
  ) {}

  ngOnInit() {
    this.actualizarMes();
    this.cargarProductos();
  }

  actualizarMes() {
    this.nombreMesActual = this.fechaActual.toLocaleString('es-CL', { month: 'long' });
    this.anioActual = this.fechaActual.getFullYear();
    this.obtenerVentasDelMes();
  }

  cambiarMes(direccion: number) {
    this.fechaActual.setMonth(this.fechaActual.getMonth() + direccion);
    this.actualizarMes();
  }

  obtenerVentasDelMes() {
  this.ventaService.getVentas().subscribe((ventas) => {
    const mes = this.fechaActual.getMonth();
    const anio = this.fechaActual.getFullYear();

    const ventasDelMes = ventas.filter((venta) => {
      const fechaVenta = new Date(venta.fecha);
      return (
        fechaVenta.getMonth() === mes &&
        fechaVenta.getFullYear() === anio
      );
    });

    this.totalVentas = ventasDelMes.length;
    this.gananciasDelMes = ventasDelMes.reduce((acc, venta) => acc + venta.montoTotal, 0);

    // Calcular productos más vendidos este mes
    const contadorProductos: { [nombre: string]: { nombre: string, cantidadVendida: number, gananciaTotal: number } } = {};

    ventasDelMes.forEach((venta: any) => {
      venta.VentaProductos.forEach((vp: any) => {
        const nombre = vp.producto?.nombre ?? 'Desconocido';
        const ganancia = vp.precioUnitario * vp.cantidad;

        if (!contadorProductos[nombre]) {
          contadorProductos[nombre] = {
            nombre,
            cantidadVendida: 0,
            gananciaTotal: 0,
          };
        }

        contadorProductos[nombre].cantidadVendida += vp.cantidad;
        contadorProductos[nombre].gananciaTotal += ganancia;
      });
    });

    const top = Object.values(contadorProductos)
      .sort((a, b) => b.gananciaTotal - a.gananciaTotal)
      .slice(0, 5);

    this.topVentasDelMes = top;
  });
}

  cargarProductos() {
    this.productoService.getProductos().subscribe((productos) => {
      this.totalProductos = productos.length;

      const ordenadosPorStock = [...productos].sort((a, b) => b.stock - a.stock);

      this.productosConMasStock = ordenadosPorStock.slice(0, 3);
      this.productosConMenosStock = ordenadosPorStock.reverse().slice(0, 3);
    });
  }
}
