export interface producto {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  stock: number;
  precio: number;
  images?: string[];
}
