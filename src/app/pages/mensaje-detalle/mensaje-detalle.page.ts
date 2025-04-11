import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MensajeService } from '../../services/mensaje.service';
import { Mensaje } from '../../interfaces/mensaje.interface';
import { ToastService } from '../../services/toast.service';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
  IonCardSubtitle,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonLabel,
  IonList,
  IonItem,
  IonTab,
  IonIcon,
} from '@ionic/angular/standalone';
//import { UsuarioHeaderComponent } from '../../components/usuario-header/usuario-header.component';

import { addIcons } from 'ionicons';
import { peopleOutline, documentOutline } from 'ionicons/icons';
import { UsuarioHeaderComponent } from "../../components/usuario-header/usuario-header.component";
import { FooterComponent } from "../../components/footer/footer.component";
//import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-mensaje-detalle',
  templateUrl: './mensaje-detalle.page.html',
  styleUrls: ['./mensaje-detalle.page.css'],
  standalone: true,
  imports: [
    IonIcon,
    IonTab,
    CommonModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonCardTitle,
    IonCardSubtitle,
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonLabel,
    IonList,
    IonItem,
    UsuarioHeaderComponent,
    FooterComponent
],
})
export class MensajeDetallePage implements OnInit {
  mensaje: Mensaje | null = null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private mensajeService: MensajeService,
    private toastService: ToastService
  ) {
    addIcons({ documentOutline, peopleOutline });
  }

  ngOnInit() {
    addIcons({ documentOutline, peopleOutline });
    const mensajeId = this.activatedRoute.snapshot.paramMap.get('id');
    if (mensajeId) {
      this.obtenerMensajeDetalle(mensajeId);
    }
  }

  obtenerMensajeDetalle(id: string) {
    this.mensajeService.getMensajeById(id).subscribe({
      next: (data) => {
        this.mensaje = data;
      },
      error: (error) => {
        console.error('Error al obtener el mensaje:', error);
        this.toastService.showMessage('Error al obtener el mensaje', 'warning');
      },
    });
  }
}
