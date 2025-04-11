import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { s } from '@angular/core/weak_ref.d-ttyj86RV';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  homeOutline,
  trashOutline,
  createOutline,
  addOutline,
} from 'ionicons/icons';
import { Usuario } from 'src/app/interfaces/user.interface';
import { ToastService } from 'src/app/services/toast.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { UsuarioHeaderComponent } from "../../components/usuario-header/usuario-header.component";

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.page.html',
  styleUrls: ['./usuario.page.css'],
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
    UsuarioHeaderComponent
],
})
export class UsuarioPage implements OnInit {

  searchQuery: string = ''; 
  usuarios: Usuario[] = []; 
  filteredUsuarios: Usuario[] = []; 

  constructor
  (    
    private oRouter: Router,
    private oUsuarioService: UsuarioService,
    private oToastService: ToastService
  ) 
  { 
    addIcons({ homeOutline, createOutline, trashOutline, addOutline });
  }

  ngOnInit() {
    this.obtenerUsuarios();
  }

  ionViewWillEnter() {
    this.obtenerUsuarios();
  }


  obtenerUsuarios() {
    this.oUsuarioService.getUsuarios().subscribe({

      next: (response) => {
        this.usuarios = response;
        this.filteredUsuarios = response;
      },
      error: (error) => {
        console.error('Error al obtener los usuarios:', error);
        this.oToastService.showMessage(error, 'warning');

      }

    })
  }

  filterUsuario() {
    if (this.searchQuery.trim() === '') {
      this.filteredUsuarios = this.usuarios; 
    } else {
      this.filteredUsuarios = this.usuarios.filter((usuario) =>
        usuario.email
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase())
      );
    }
  }

  goHome() {
    this.oRouter.navigate(['/home']);
  }


  createUsuario() {
    this.oRouter.navigate(['/usuario/nuevo']);
  }


  editUsuario(usuario: Usuario) {
    this.oRouter.navigate(['/usuario/editar', usuario.email]);
  }


  deleteUsuario(usuario: Usuario) {
    this.oUsuarioService.deleteUsuario(usuario.email).subscribe({
      next: (response) => {
        this.oToastService.showMessage('Usuario eliminado', 'success');
        this.obtenerUsuarios();
      },
      error: (error) => {
        console.error('Error al eliminar el usuario:', error);
        this.oToastService.showMessage(error, 'warning');
      }
    })
  }


}
