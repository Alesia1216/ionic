import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import 
{
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
  IonRadio, 
  IonRadioGroup 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeOutline } from 'ionicons/icons';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { UsuarioHeaderComponent } from "../../components/usuario-header/usuario-header.component";
import { FooterComponent } from "../../components/footer/footer.component";

@Component({
  selector: 'app-usuario-form',
  templateUrl: './usuario-form.page.html',
  styleUrls: ['./usuario-form.page.css'],
  imports: [
    IonRadioGroup,
    IonRadio,
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
    UsuarioHeaderComponent,
    FooterComponent
],
})
export class UsuarioFormPage implements OnInit {

  usuarioForm: FormGroup;
  isEdit = false;

  constructor
  (
    private oRouter: Router,
    private oActivatedRoute: ActivatedRoute,
    private oUsuarioService: UsuarioService,
    private oToastService: ToastService,
    private fb: FormBuilder
  ) 
  {
    addIcons({ closeOutline });

    this.usuarioForm = this.fb.group({
      _id: [''],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      password2: [''],
      role: ['', Validators.required]
    },
    { validators: this?.coincicenPasswords }
  );
  }

  ngOnInit() {
    this.oActivatedRoute.params.subscribe((params) => {
      if (params['id']) {
        this.isEdit = true;
        this.cargarUsuario(params['id']);
      }else{
        this.usuarioForm.get('password')?.setValidators([Validators.required]);
        this.usuarioForm.get('password2')?.setValidators([Validators.required]);
      }
    });
  }

  coincicenPasswords: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const password = control.get('password');
    const password2 = control.get('password2');
    if (
      password?.value &&
      password2?.value &&
      password.value !== password2.value
    ) {
      return { passwordsMismatch: true };
    }
    return null;
  };


  cargarUsuario(id: string) {
    this.oUsuarioService.getUsuarioByEmail(id).subscribe((usuario) => {
      if (usuario) {
        delete usuario.password;
        this.usuarioForm.patchValue(usuario);
        console.log(usuario);
      }
    });
  }

  guardarUsuario() {
    if(this.usuarioForm.invalid){
      this.oToastService.showMessage('Formulario inválido', 'error');
      return;
    }

    const usuarioData = { ...this.usuarioForm.value };

    if (this.isEdit) {
      this.oUsuarioService.updateUsuario(usuarioData).subscribe(() => {
          this.oToastService.showMessage('Usuario actualizado', 'success');
          this.oRouter.navigate(['/usuario']);
        });
    } else {
      this.oUsuarioService.createUsuario(usuarioData).subscribe(() => {
          this.oToastService.showMessage('Usuario creado', 'success');
          this.oRouter.navigate(['/usuario']);
        });
    }
  }

  cancelar() {
    this.oRouter.navigate(['/usuario']);
  }

}
