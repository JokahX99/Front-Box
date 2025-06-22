import { Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular'; 
import { IonHeader, IonButtons, IonButton, IonIcon, IonItem } from "@ionic/angular/standalone";
import { Router } from '@angular/router';

@Component({
  selector: 'app-base1',
  templateUrl: './base1.component.html',
  styleUrls: ['./base1.component.scss'],
  standalone: false,
})
export class Base1Component {
  @Input() title: string = 'Mi App';
  menuOpen = false;
  
  constructor(private router: Router) {}
  
  crearprod() {
    this.router.navigate(['/crear-producto']);  // Ajusta la ruta a donde quieres volver
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  onOptionClick(opcion: string) {
    console.log(`Seleccionaste: ${opcion}`);
    this.menuOpen = false;
    // Puedes emitir un evento o navegar si lo necesitas
  }
}
