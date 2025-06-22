import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { ToastController } from '@ionic/angular';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  public hasError: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastCtrl: ToastController,
    private formBuilder: FormBuilder
  ) {}

  public loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  public onSubmit() {
    if (this.loginForm.invalid) {
      this.hasError = true;
      setTimeout(() => {
        this.hasError = false;
      }, 2000);
      return;
    }

    const { email, password } = this.loginForm.value;

    this.authService.login(email!, password!).subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        this.router.navigateByUrl('/principal');
        return;
      }

      this.hasError = true;
      setTimeout(() => {
        this.hasError = false;
      }, 2000);
    });
  }

  Register() {
    this.router.navigate(['/register']);
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color: 'primary',
    });
    toast.present();
  }
}
