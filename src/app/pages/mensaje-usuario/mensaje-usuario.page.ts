import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonButton,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  IonSearchbar,
  IonMenuToggle,
  IonItemSliding,
  LoadingController,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { Mensaje } from '../../interfaces/mensaje.interface';
import { MensajeService } from '../../services/mensaje.service';
import { ToastService } from '../../services/toast.service';
import { addIcons } from 'ionicons';
import {
  homeOutline,
  trashOutline,
  createOutline,
  addOutline,
  hourglassOutline,
  checkmarkCircleOutline,
  notifications,
} from 'ionicons/icons';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-mensaje-usuario',
  templateUrl: './mensaje-usuario.page.html',
  styleUrls: ['./mensaje-usuario.page.css'],
  standalone: true,
  imports: [
    IonItemSliding,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonButton,
    IonIcon,
    CommonModule,
    FormsModule,
    IonList,
    IonItem,
    IonLabel,
    IonSearchbar,
    IonMenuToggle,
  ],
})
export class MensajeUsuarioPage {
  searchQuery: string = ''; 
  mensajes: Mensaje[] = []; 
  filteredMensajes: Mensaje[] = []; 

  constructor(
    private oRouter: Router,
    private oLoadingController: LoadingController,
    private oMensajeService: MensajeService,
    private oToastService: ToastService,
    private oStorageService: StorageService
    
  ) {
    addIcons({
      homeOutline,
      hourglassOutline,
      checkmarkCircleOutline,
      createOutline,
      trashOutline,
      addOutline,
    });
  }

  ionViewWillEnter() {
    this.obtenerMensajes();
  }

  ngAfterViewInit() {}

  async obtenerMensajes() {
    const loading = await this.oLoadingController.create({
      message: 'Cargando mensajes...',
      duration: 0, 
    });
    await loading.present();
    const user = await this.oStorageService.get('plannerstats-user');

    this.oMensajeService.getMensajeByUser(user._id).subscribe({
      next: (data: Mensaje[]) => {
        this.mensajes = data;
        this.filteredMensajes = data;
        loading.dismiss();
      },
      error: (error) => {
        console.error('Error al obtener mensajes:', error);
        let message = 'Error en la obtención de mensajes';
        if (error.error && error.error.message) message = error.error.message;
        this.oToastService.showMessage(message, 'warning');
        loading.dismiss();
      },
    });
  }

  searchMensaje() {
    if (this.searchQuery.trim() === '') {
      this.filteredMensajes = this.mensajes; 
    } else {
      this.filteredMensajes = this.mensajes.filter((mensaje) =>
        mensaje.title.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  }

  goHome() {
    this.oRouter.navigate(['/home']);
  }

  goToDetalle(mensaje: Mensaje) {
    this.oRouter.navigate(['/mensaje-detalle', mensaje._id]);
  }

  trackByFn(index: number, item: any): any {
    return item._id; 
  }

}
