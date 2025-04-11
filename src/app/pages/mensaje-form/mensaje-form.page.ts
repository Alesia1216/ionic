import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonInput,
  IonText,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonList,
} from '@ionic/angular/standalone';
import { MensajeService } from '../../services/mensaje.service';
import { ToastService } from '../../services/toast.service';
import { addIcons } from 'ionicons';
import { add, closeOutline, personCircleOutline, search } from 'ionicons/icons';
import { UsuarioService } from '../../services/usuario.service';
import { StorageService } from '../../services/storage.service';
import { Usuario } from '../../interfaces/user.interface';
import { FormsModule } from '@angular/forms';
import { take } from 'rxjs';
import { UsuarioHeaderComponent } from "../../components/usuario-header/usuario-header.component";
import { FooterComponent } from "../../components/footer/footer.component";

@Component({
  selector: 'app-mensaje-form',
  templateUrl: './mensaje-form.page.html',
  styleUrls: ['./mensaje-form.page.css'],
  standalone: true,
  imports: [
    IonList,
    IonText,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonItem,
    IonLabel,
    IonInput,
    ReactiveFormsModule,
    IonTextarea,
    IonSelect,
    IonSelectOption,
    FormsModule,
    UsuarioHeaderComponent,
    FooterComponent
],
})
export class MensajeFormPage implements OnInit {
  mensajeForm: FormGroup;
  isEdit = false;
  intId = '';
  users: any[] = [];

  usuariosFiltrados = [...this.users];

  constructor(
    private fb: FormBuilder,
    private oMensajeService: MensajeService,
    private oUsuarioService: UsuarioService,
    private oStorageService: StorageService,
    private oRouter: Router,
    private oActivatedRoute: ActivatedRoute,
    private oToastService: ToastService,
  ) 
  { 
    addIcons({ closeOutline, personCircleOutline });

    this.mensajeForm = this.fb.group({
      title: ['', [Validators.required]],
      body: ['', [Validators.required]],
      audience: ['all', [Validators.required]],
      receiverId: [''],
      searchTerm: [''],
      sentAt: [null],
    })
  }

  ngOnInit() {
    const id = this.oActivatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.intId = id;
      this.isEdit = true;
      this.cargarMensaje(id);

      this.loadUsuarios();
      this.cargarMensaje(id);
    }else{
      this.loadUsuarios(); // Cargar usuarios al iniciar
    }
  }


  loadUsuarios(){
    this.oUsuarioService.getUsuarios().subscribe((users) => {
      this.users = users;
    });
  }


  filtrarUsuarios() {
    const searchTerm =
      this.mensajeForm.get('searchTerm')?.value?.toLowerCase() || ''; 
    this.usuariosFiltrados = this.users.filter((user) =>
      user.name.toLowerCase().includes(searchTerm)
    );
  }


  seleccionarUsuario(user: Usuario) {
    this.mensajeForm.patchValue({
      receiverId: user._id,
      searchTerm: user.name, 
    });
    this.usuariosFiltrados = []; 
  }

  cargarMensaje(id: string) {
    this.oMensajeService.getMensajeById(id).subscribe((mensaje) => {
      if(mensaje){
        this.mensajeForm.patchValue(mensaje);
        if(mensaje.audience === 'single' && mensaje.receiverId){
          const usuario = this.users.find((user) => user._id === mensaje.receiverId);
          if(usuario){
            this.mensajeForm.patchValue({ searchTerm: usuario.name });
          }
        }
      }
    });
  }

  private procesarEnvio(send: boolean) {
    if (send) {
      this.oMensajeService.sendOneSignal(this.intId).subscribe(() => {
        this.oToastService.showMessage('Mensaje notificado', 'success');
        this.oRouter.navigate(['/mensaje']);
      });
    } else {
      this.oRouter.navigate(['/mensaje']);
    }
  }

  async obtenerSenderId() {
    const usuario = await this.oStorageService.get('plannerstats-user');
    return usuario ? usuario._id : null;
  }

  cancelar() {
    this.oRouter.navigate(['/mensaje']);
  }

  async guardarMensaje(send: boolean = false) {
    if (this.mensajeForm.invalid) {
      return;
    }
    const senderId = await this.obtenerSenderId();
    const { searchTerm, ...mensajeData } = this.mensajeForm.value; 
    const mensaje = { ...mensajeData, senderId }; 

    if (this.isEdit) {
     mensaje._id = this.intId;
     this.oMensajeService.updateMensaje(mensaje).subscribe((data) => {
        this.oToastService.showMessage('Mensaje actualizado', 'success');
        this.procesarEnvio(send);
     });
    } else {
      this.oMensajeService
        .createMensaje(mensaje)
        .pipe(take(1))
        .subscribe((data: any) => {
          this.intId = data.createdMessage._id;
          this.oToastService.showMessage('Mensaje creado', 'success');
          this.procesarEnvio(send);
        });
    }
  }



}
