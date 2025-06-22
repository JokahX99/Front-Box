import { Component, OnInit } from '@angular/core';
import { ActionSheetController, AlertController } from '@ionic/angular';

import { Router } from '@angular/router';
import { producto } from 'src/app/models/producto.models';
import { ProductoService } from 'src/app/service/producto.service';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.page.html',
  styleUrls: ['./principal.page.scss'],
  standalone: false,
})
export class PrincipalPage {
  mostrarFiltros = false;
  filtroActivo = false;
  filtroTipo: string | null = null;
  searchQuery: string = '';

  public productos: producto[] = [];
  public productosFiltrados: producto[] = [];

  constructor(
    private readonly _productoService: ProductoService,
    private readonly _authService: AuthService,
    private actionSheetController: ActionSheetController,
    private alertController: AlertController,
    private router: Router
  ) {}

  ionViewWillEnter() {
    this.getData();
  }

  private getData() {
    this._productoService.getProductos().subscribe((productos: producto[]) => {
      this.productos = productos;
      this.filtrarProductos(); // aplica búsqueda y filtros si hay
    });
  }

  public filtrarProductos(event?: any) {
    const inputValue = event?.target?.value ?? '';
    this.searchQuery = inputValue.toLowerCase();

    let resultado = [...this.productos];

    if (this.searchQuery && this.searchQuery.trim() !== '') {
      resultado = resultado.filter((prod) =>
        prod.nombre.toLowerCase().includes(this.searchQuery)
      );
    }

    switch (this.filtroTipo) {
      case 'stockMayor':
        resultado.sort((a, b) => b.stock - a.stock);
        break;
      case 'stockMenor':
        resultado.sort((a, b) => a.stock - b.stock);
        break;
      case 'precioMayor':
        resultado.sort((a, b) => b.precio - a.precio);
        break;
      case 'precioMenor':
        resultado.sort((a, b) => a.precio - b.precio);
        break;
    }

    this.productosFiltrados = resultado;
  }

  aplicarFiltro(tipo: string) {
    this.filtroTipo = tipo;
    this.filtroActivo = true;
    this.mostrarFiltros = false;
    this.filtrarProductos();
  }

  toggleFiltro() {
    if (this.filtroActivo) {
      // Si ya hay un filtro, desactivarlo
      this.filtroTipo = null;
      this.filtroActivo = false;
      this.mostrarFiltros = false;
      this.filtrarProductos();
    } else {
      // Mostrar menú
      this.mostrarFiltros = !this.mostrarFiltros;
    }
  }

  async presentActionSheet(producto: producto) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Opciones del producto',
      buttons: [
        {
          text: 'Modificar producto',
          icon: 'create-outline',
          handler: () => {
            this.router.navigate(['/editar-producto'], {
              state: { producto },
            });
          },
        },
        {
          text: 'Eliminar producto',
          role: 'destructive',
          icon: 'trash-outline',
          handler: () => {
            this.presentDeleteConfirm(producto);
          },
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel',
        },
      ],
    });
    await actionSheet.present();
  }

  async presentDeleteConfirm(producto: producto) {
    const alert = await this.alertController.create({
      header: '¿Estás seguro?',
      message: `¿Deseas eliminar ${producto.nombre}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this._productoService.deleteProducto(producto.id).subscribe({
              next: () => {
                this.getData(); // Recargar productos
              },
              error: (err) => {
                console.error('Error al eliminar producto:', err);
              },
            });
          },
        },
      ],
    });

    await alert.present();
  }

  VerProducto(producto: any) {
    this.router.navigate(['/ver-producto'], {
      state: { producto },
    });
  }

  crearprod() {
    this.router.navigate(['/crear-producto']);
  }

  registrarventa() {
    this.router.navigate(['/registrar-venta']);
  }

  historialventa() {
    this.router.navigate(['/historial-ventas']);
  }

  estadisticas() {
    this.router.navigate(['/estadisticas']);
  }

  ajustes() {
    this.router.navigate(['/ajustes']);
  }

  cerrarsesion() {
    this._authService.logout();
    this.router.navigate(['/home']);
  }

  public getImages(producto: producto): string | null {
    if (producto && producto.images && producto.images.length > 0) {
      return producto.images[0];
    }
    return null;
  }
}
