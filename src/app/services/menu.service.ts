import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { BehaviorSubject } from 'rxjs';
import { MenuItem } from '../interfaces/menu.interface';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private menuListSubject = new BehaviorSubject<MenuItem[]>([]);
  menuList$ = this.menuListSubject.asObservable(); // Observable para suscribirse

  constructor(private storageService: StorageService) {
    this.cargarMenus(); // Cargar el menú al iniciar el servicio
  }

  async cargarMenus() {
    const user = await this.storageService.get('plannerstats-user');
    const role = user?.role || 'user';

    const menu =
      role === 'admin'
        ? [
            { link: '/home', icon: 'home-outline', label: 'Inicio' },
            { link: '/vehiculo', icon: 'car-outline', label: 'Vehiculos' },
            { link: '/usuario', icon: 'people', label: 'Usuarios' },
            { link: '/mensaje',icon: 'notifications', label: 'Mensajes' }
          ]
        : [
            { link: '/home', icon: 'home-outline', label: 'Inicio' },
            { link: '/vehiculo', icon: 'car-outline', label: 'Vehiculos' },
            {
              link: '/mensaje-usuario',
              icon: 'notifications',
              label: 'Mis mensajes',
            },
          ];

    this.menuListSubject.next(menu);
  }
}
