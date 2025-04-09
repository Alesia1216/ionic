import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuController } from '@ionic/angular/standalone';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
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
export class AppComponent {
  constructor(private menuCtrl: MenuController) {
    addIcons({homeOutline,carOutline,people,});
  }
  closeMenu() {
    console.log('Cierra menu');
    this.menuCtrl.close('main-menu');
  }
}
