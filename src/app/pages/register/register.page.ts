import { Component, inject } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false,
})
export class RegisterPage {
  private readonly router = inject(Router);
  private readonly formBuilder = inject(FormBuilder);
  constructor(
    private authService: AuthService,
    private toastCtrl: ToastController
  ) {}

  public registerForm = this.formBuilder.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    termsAccepted: [false, Validators.requiredTrue],
  });

  async crearUsuario() {
    const { fullName, email, password, confirmPassword, termsAccepted } =
      this.registerForm.value;

    if (!fullName || !email || !password || !confirmPassword) {
      this.presentToast('Todos los campos son obligatorios.');
      return;
    }

    if (password !== confirmPassword) {
      this.presentToast('Las contraseñas no coinciden.');
      return;
    }

    if (!termsAccepted) {
      this.presentToast('Debe aceptar los términos.');
      return;
    }

    try {
      await this.authService.register(fullName, email, password).toPromise();
      this.presentToast('Usuario creado exitosamente.');
      this.router.navigateByUrl('/principal');
    } catch (error) {
      this.presentToast('Error al crear usuario.');
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color: 'primary',
    });
    toast.present();
  }

  public home() {
    this.router.navigate(['/home']);
  }
}
