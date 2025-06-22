import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

const URL = 'http://localhost:3000/api'; // Ajusta si tu API usa otro puerto o prefijo

export interface VentaProductoDto {
  productoId: number;
  cantidad: number;
}

export interface CreateVentaDto {
  fecha: Date;
  nro_boleta: number;
  ventaProductos: VentaProductoDto[];
}

@Injectable({
  providedIn: 'root',
})
export class VentaService {
  private readonly _http = inject(HttpClient);

  create(venta: CreateVentaDto): Observable<any> {
    return this._http.post(`${URL}/venta`, venta);
  }

  getVentas(): Observable<any[]> {
    return this._http.get<any[]>(`${URL}/venta`);
  }

  getVenta(id: string): Observable<any> {
    return this._http.get(`${URL}/venta/${id}`);
  }

  eliminarVenta(id: string): Observable<any> {
    return this._http.delete(`${URL}/venta/${id}`);
  }
}

