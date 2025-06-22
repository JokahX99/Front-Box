import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { producto } from '../models/producto.models';
import { forkJoin, map, Observable, of, switchMap } from 'rxjs';
const URL = 'http://localhost:3000/api';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  private readonly _http = inject(HttpClient);
  public getProductos(): Observable<producto[]> {
    return this._http.get<producto[]>(`${URL}/product`);
  }

  public getProducto(id: string) {
    return this._http.get(`${URL}/product/${id}`);
  }

  public createProducto(
    productLike: producto,
    imagesFileList?: FileList
  ): Observable<producto> {
    const currentImages = productLike.images || [];

    return this.uploadImages(imagesFileList).pipe(
      map((imageName) => ({
        ...productLike,
        images: [...currentImages, ...imageName],
      })),
      switchMap((producto) =>
        this._http.post<producto>(`${URL}/product`, producto)
      )
    );
  }

  public updateProducto(id: string, producto: producto) {
    return this._http.patch(`${URL}/product/${id}`, producto);
  }

  public deleteProducto(id: string) {
    return this._http.delete(`${URL}/product/${id}`);
  }

  uploadImages(images?: FileList): Observable<string[]> {
    if (!images) return of([]);

    const uploadObservables = Array.from(images).map((imageFile) =>
      this.uploadImage(imageFile)
    );

    return forkJoin(uploadObservables);
  }

  uploadImage(imageFile: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', imageFile);

    return this._http
      .post<{ fileName: string }>(`${URL}/files/product`, formData)
      .pipe(map((resp) => resp.fileName));
  }
}
