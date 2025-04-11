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
  IonItemOptions,
  IonItemOption,
  IonFab,
  IonFabButton,
  LoadingController,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular/standalone';
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
} from 'ionicons/icons';
import { UsuarioHeaderComponent } from "../../components/usuario-header/usuario-header.component";
import { FooterComponent } from "../../components/footer/footer.component";

@Component({
  selector: 'app-mensaje',
  templateUrl: './mensaje.page.html',
  styleUrls: ['./mensaje.page.css'],
  standalone: true,
  imports: [
    IonFabButton,
    IonFab,
    IonItemOption,
    IonItemOptions,
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
    UsuarioHeaderComponent,
    FooterComponent
],
})
export class MensajePage implements OnInit {

  searchQuery: string = '';
  mensajes: Mensaje[] = [];
  filteredMensajes: Mensaje[] = [];

  constructor(
    private oRouter: Router,
    private oAlertController: AlertController,
    private oMensajeService: MensajeService,
    private oToastService: ToastService,
    private oLoadingController: LoadingController,
  ) 
  {
    addIcons({
      homeOutline,
      checkmarkCircleOutline,
      hourglassOutline,
      createOutline,
      trashOutline,
      addOutline
    }); 
  }
  
  ionViewWillEnter() {
    this.obtenerMensajes();
  }

  ngOnInit() {
  }

  async obtenerMensajes() {
    const loading = await this.oLoadingController.create({
      message: 'Cargando mensajes...',
      duration: 0,
    });
    await loading.present();
    this.oMensajeService.getMensajes().subscribe({
      next: (data) => {
        this.mensajes = data;
        this.filteredMensajes = data;
        loading.dismiss();
      },
      error: (error) => {
        this.oToastService.showMessage('Error al cargar los mensajes', 'warning');
        loading.dismiss();
      },
    });
  }

  searchMensaje() {
    if(this.searchQuery.trim() === '') {
      this.filteredMensajes = this.mensajes;
    } else {
      this.filteredMensajes = this.mensajes.filter((mensaje) =>
        mensaje.title.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  }

  goHome(){
    this.oRouter.navigate(['/home']);
  }

  createMensaje() {
    this.oRouter.navigate(['/mensaje/nuevo']);
  }

  editMensaje(mensaje: Mensaje) {
    this.oRouter.navigate(['/mensaje/editar', mensaje._id]);
  }

  goToDetalle(mensaje: Mensaje) {
    this.oRouter.navigate(['/mensaje-detalle', mensaje._id]);
  }

  trackByFn(index: number, item: any): any {
    return item._id; 
  }

  async deleteMensaje(mensaje: Mensaje) {
    const alert = await this.oAlertController.create({
      header: 'Eliminar mensaje',
      message: `¿Está seguro de que desea eliminar este mensaje: '${mensaje.title}'?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.oMensajeService.deleteMensaje(mensaje).subscribe(() => {
                this.oToastService.showMessage('Mensaje eliminado', 'success');
                this.obtenerMensajes();
            });
          },
        },
      ],
    });
    await alert.present();
  }

}
