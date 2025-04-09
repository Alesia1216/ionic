import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { Usuario } from './interfaces/user.interface';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'test',
    loadComponent: () => import('./test/test.page').then((m) => m.TestPage),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.page').then((m) => m.HomePage),
    canActivate: [AuthGuard],
  },
  {
    path: 'vehiculo',
    loadComponent: () =>
      import('./pages/vehiculo/vehiculo.page').then((m) => m.VehiculoPage),
    canActivate: [AuthGuard],
  },
  {
    path: 'vehiculo/nuevo',
    loadComponent: () =>
      import('./pages/vehiculo-form/vehiculo-form.page').then(
        (m) => m.VehiculoFormPage
      ),
  },
  {
    path: 'vehiculo/editar/:id',
    loadComponent: () =>
      import('./pages/vehiculo-form/vehiculo-form.page').then(
        (m) => m.VehiculoFormPage
      ),
  },{
    path: 'usuario',
    loadComponent: () =>
      import('./pages/usuario/usuario.page').then((m) => m.UsuarioPage),
    canActivate: [AuthGuard],
  },
  {
    path: 'usuario/nuevo',
    loadComponent: () =>
      import('./pages/usuario-form/usuario-form.page').then(
        (m) => m.UsuarioFormPage
      ),
      canActivate: [AuthGuard],
  },
  {
    path: 'usuario/editar/:id',
    loadComponent: () =>
      import('./pages/usuario-form/usuario-form.page').then(
        (m) => m.UsuarioFormPage
      ),
      canActivate: [AuthGuard],
  },
];
