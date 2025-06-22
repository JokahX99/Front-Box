import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  trigger,
  transition,
  style,
  animate,
} from '@angular/animations';

@Component({
  selector: 'app-ver-producto',
  templateUrl: './ver-producto.page.html',
  styleUrls: ['./ver-producto.page.scss'],
  standalone: false,
  animations: [
    trigger('slideAnimation', [
      transition(':increment', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 })),
      ]),
      transition(':decrement', [
        style({ transform: 'translateX(-100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 })),
      ]),
    ]),
  ],
})
export class VerProductoPage {
  producto: any;
  currentImageIndex = 0;
  nextImageIndex: number | null = null;

  private touchStartX = 0;
  private currentTranslateX = 0;
  currentTransform = 'translateX(0)';
  nextTransform = 'translateX(100%)';
  imageTransition = 'none';

  constructor(private router: Router) {
    const nav = this.router.getCurrentNavigation();
    this.producto = nav?.extras.state?.['producto'];
  }

  goBack() {
    this.router.navigate(['/principal']);
  }

  startTouch(event: TouchEvent) {
    this.touchStartX = event.touches[0].clientX;
    this.imageTransition = 'none';
    this.nextImageIndex = null;
  }

  moveTouch(event: TouchEvent) {
    const touchX = event.touches[0].clientX;
    const deltaX = touchX - this.touchStartX;
    this.currentTranslateX = deltaX;

    if (deltaX < 0 && this.currentImageIndex < (this.producto.images.length - 1)) {
      // Swipe izquierda: mostrar siguiente imagen a la derecha
      this.nextImageIndex = this.currentImageIndex + 1;
      this.currentTransform = `translateX(${deltaX}px)`;
      this.nextTransform = `translateX(${window.innerWidth + deltaX}px)`;
    } else if (deltaX > 0 && this.currentImageIndex > 0) {
      // Swipe derecha: mostrar anterior imagen a la izquierda
      this.nextImageIndex = this.currentImageIndex - 1;
      this.currentTransform = `translateX(${deltaX}px)`;
      this.nextTransform = `translateX(${-window.innerWidth + deltaX}px)`;
    } else {
      // No hay siguiente imagen, sólo mueve la actual con límite
      this.nextImageIndex = null;
      this.currentTransform = `translateX(${deltaX / 3}px)`; // frena movimiento si no hay next
    }
  }

  endTouch(event: TouchEvent) {
    const deltaX = this.currentTranslateX;
    const threshold = 100;

    if (deltaX < -threshold && this.currentImageIndex < (this.producto.images.length - 1)) {
      // swipe izquierda - cambiar imagen siguiente
      this.imageTransition = 'transform 0.3s ease-out';
      this.currentTransform = `translateX(${-window.innerWidth}px)`;
      this.nextTransform = `translateX(0)`;

      setTimeout(() => {
        this.currentImageIndex++;
        this.resetTransforms();
      }, 300);
    } else if (deltaX > threshold && this.currentImageIndex > 0) {
      // swipe derecha - cambiar imagen anterior
      this.imageTransition = 'transform 0.3s ease-out';
      this.currentTransform = `translateX(${window.innerWidth}px)`;
      this.nextTransform = `translateX(0)`;

      setTimeout(() => {
        this.currentImageIndex--;
        this.resetTransforms();
      }, 300);
    } else {
      // vuelve a la posición original
      this.imageTransition = 'transform 0.3s ease-out';
      this.currentTransform = 'translateX(0)';
      this.nextTransform = deltaX < 0 ? 'translateX(100%)' : 'translateX(-100%)';

      setTimeout(() => {
        this.resetTransforms();
      }, 300);
    }
  }

  resetTransforms() {
    this.imageTransition = 'none';
    this.currentTransform = 'translateX(0)';
    this.nextTransform = 'translateX(100%)';
    this.nextImageIndex = null;
    this.currentTranslateX = 0;
  }
}