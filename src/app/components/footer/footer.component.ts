import { Component, OnInit } from '@angular/core';
import { App } from '@capacitor/app';
import { environment } from '../../../environments/environment';
import { IonFooter, IonToolbar, IonText } from '@ionic/angular/standalone';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  standalone: true,
  imports: [IonFooter, IonToolbar, IonText],
})
export class FooterComponent implements OnInit {
  version: string = '';

  constructor(private platform: Platform) {}

  ngOnInit() {
    if (this.platform.is('capacitor')) {
      // Si estamos en una plataforma móvil, usamos Capacitor
      this.getMobileVersion();
    } else {
      this.version = environment.version;
    }
  }

  // Obtener la versión en dispositivos móviles
  async getMobileVersion() {
    const info = await App.getInfo();
    this.version = info.version;
  }
}