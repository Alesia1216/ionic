import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuController } from '@ionic/angular/standalone';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { Platform } from '@ionic/angular';
import { NotificationService } from './services/notification.service';
import { MenuService } from './services/menu.service';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonMenu,
  IonList,
  IonIcon,
  IonLabel,
  IonMenuToggle,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { homeOutline, carOutline, people } from 'ionicons/icons';
import { MenuItem } from './interfaces/menu.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [
    RouterModule,
    IonApp,
    IonRouterOutlet,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonMenu,
    IonList,
    IonIcon,
    IonLabel,
    IonMenuToggle,
  ],
})
export class AppComponent implements OnInit {

  private notificationService = inject(NotificationService);
  private menuService = inject(MenuService);
  menuList: MenuItem[] = [];

  constructor(private menuCtrl: MenuController, private platform: Platform) {
    this.initializeApp();
    addIcons({homeOutline,carOutline,people,});

  }

  async ngOnInit() {
    console.log('App OnInit');
     this.menuService.menuList$.subscribe((menu) => {
       this.menuList = menu;
     });
  }

  closeMenu() {
    console.log('Cierra menu');
    this.menuCtrl.close('main-menu');
  }

  // IONIC Zone
  initializeApp() {
    this.platform.ready().then(() => {
      this.notificationService.initialize();
    });
  }

}
