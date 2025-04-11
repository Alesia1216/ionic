import { Component, inject, OnInit } from '@angular/core';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonButton,
  IonIcon,
  IonMenuToggle,
} from '@ionic/angular/standalone';
import { StorageService } from '../../services/storage.service';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { logOutOutline } from 'ionicons/icons';
import { UsuarioHeaderComponent } from "../../components/usuario-header/usuario-header.component";
import { FooterComponent } from "../../components/footer/footer.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonButton,
    IonIcon,
    IonMenuToggle,
    UsuarioHeaderComponent,
    FooterComponent
],
})
export class HomePage implements OnInit {
  private storageService = inject(StorageService);
  constructor(private router: Router) {
    addIcons({
      logOutOutline,
    });
  }

  ngOnInit() {}

  ngAfterViewInit() {}

  async logout() {
    await this.storageService.clear();
    this.router.navigate(['/login']);
  }
}
