import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavController } from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { LoginResponse, Usuario } from '../../interfaces/user.interface';
import { StorageService } from '../../services/storage.service';
import { NotificationService } from '../../services/notification.service';
import { UsuarioService } from '../../services/usuario.service';
import { firstValueFrom } from 'rxjs';
import { MenuService } from '../../services/menu.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonButton,
  IonText,
  IonInput,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonInput,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    IonItem,
    IonLabel,
    IonButton,
    IonText,
    ReactiveFormsModule,
  ],
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;
  private toastService = inject(ToastService);
  private storageService = inject(StorageService);
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);
  private usuarioService = inject(UsuarioService);
  private menuService = inject(MenuService);

  constructor(private navCtrl: NavController, private fb: FormBuilder) {

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

  }

  ngOnInit() {}

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.authService
      .login(this.loginForm.value.email, this.loginForm.value.password)
      .subscribe({
        next: async (response: LoginResponse) => {
          console.log('Login exitoso', response);
          await this.storageService.set('plannerstats-user', response);
          this.authService.setAccessToken(response.accessToken);
          this.authService.setRefreshToken(response.refreshToken);

          // Actualizar el playerId
          const playerId = await this.notificationService.getOneSignalId();
          let user: Usuario = response;
          if (playerId) {
            user.playerId = playerId;
            try {
              console.log('Usuario a actualizar', user);
              await firstValueFrom(this.usuarioService.updateUsuario(user));
              await this.notificationService.setExternalId(user._id);
              console.log('Usuario actualizado con Player ID');
            } catch (err) {
              console.error('Error actualizando el usuario:', err);
            }
          }
          await this.notificationService.setAliasOneSignal(user.name);
          this.menuService.cargarMenus();
          console.log('menu de', user.role);
          this.navCtrl.navigateForward('/home'); 
        },
        error: (error) => {
          console.error('Error en el login', error);
          let message = 'Credenciales incorrectas. Inténtalo de nuevo.';
          if (error.error && error.error.message) message = error.error.message;
          this.toastService.showMessage(message, 'warning');
        },
      });
  }
}
