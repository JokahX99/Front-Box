import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { notAuthenticatedGuard } from './auth/guards/not-authenticated.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'principal',
    loadChildren: () =>
      import('./pages/principal/principal.module').then(
        (m) => m.PrincipalPageModule
      ),
    canMatch: [notAuthenticatedGuard],
  },
  {
    path: 'register',
    loadChildren: () =>
      import('./pages/register/register.module').then(
        (m) => m.RegisterPageModule
      ),
  },
  {
    path: 'ver-producto',
    loadChildren: () =>
      import('./pages/ver-producto/ver-producto.module').then(
        (m) => m.VerProductoPageModule
      ),
    canMatch: [notAuthenticatedGuard],
  },
  {
    path: 'crear-producto',
    loadChildren: () =>
      import('./pages/crear-producto/crear-producto.module').then(
        (m) => m.CrearProductoPageModule
      ),
    canMatch: [notAuthenticatedGuard],
  },
  {
    path: 'editar-producto',
    loadChildren: () =>
      import('./pages/editar-producto/editar-producto.module').then(
        (m) => m.EditarProductoPageModule
      ),
    canMatch: [notAuthenticatedGuard],
  },
  {
    path: 'registrar-venta',
    loadChildren: () =>
      import('./pages/registrar-venta/registrar-venta.module').then(
        (m) => m.RegistrarVentaPageModule
      ),
    canMatch: [notAuthenticatedGuard],
  },
  {
    path: 'historial-ventas',
    loadChildren: () =>
      import('./pages/historial-ventas/historial-ventas.module').then(
        (m) => m.HistorialVentasPageModule
      ),
    canMatch: [notAuthenticatedGuard],
  },
  {
    path: 'ajustes',
    loadChildren: () =>
      import('./pages/ajustes/ajustes.module').then((m) => m.AjustesPageModule),
    canMatch: [notAuthenticatedGuard],
  },
  {
    path: 'estadisticas',
    loadChildren: () =>
      import('./pages/estadisticas/estadisticas.module').then(
        (m) => m.EstadisticasPageModule
      ),
    canMatch: [notAuthenticatedGuard],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
