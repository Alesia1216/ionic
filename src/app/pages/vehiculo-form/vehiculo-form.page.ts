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
} from '@ionic/angular/standalone';
import { VehicleService } from '../../services/vehicle.service';
import { ToastService } from '../../services/toast.service';
import { addIcons } from 'ionicons';
import { closeOutline } from 'ionicons/icons';
import { UsuarioHeaderComponent } from "../../components/usuario-header/usuario-header.component";
import { FooterComponent } from "../../components/footer/footer.component";

@Component({
  selector: 'app-vehiculo-form',
  templateUrl: './vehiculo-form.page.html',
  styleUrls: ['./vehiculo-form.page.scss'],
  standalone: true,
  imports: [
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
export class VehiculoFormPage implements OnInit {
  vehiculoForm: FormGroup;
  isEdit = false;
  private vehicleService = inject(VehicleService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  constructor(private fb: FormBuilder) {
    addIcons({ closeOutline });

    this.vehiculoForm = this.fb.group({
      identificador: ['', Validators.required],
      matricula: ['', Validators.required],
      vin: ['', Validators.required],
      tenant: ['', Validators.required],
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.cargarVehiculo(id);
    }
  }

  cargarVehiculo(id: string) {
    this.vehicleService.getVehicleById(id).subscribe((vehiculo) => {
      if (vehiculo) {
        this.vehiculoForm.patchValue(vehiculo);
      }
    });
  }

  guardarVehiculo() {
    if (this.vehiculoForm.invalid) {
      return;
    }

    const vehiculoData = this.vehiculoForm.value;

    if (this.isEdit) {
      this.vehicleService.updateVehicle(vehiculoData).subscribe(() => {
        this.toastService.showMessage('Vehículo actualizado', 'success');
        this.router.navigate(['/vehiculo']);
      });
    } else {
      this.vehicleService.createVehicle(vehiculoData).subscribe(() => {
        this.toastService.showMessage('Vehículo creado', 'success');
        this.router.navigate(['/vehiculo']);
      });
    }
  }

  cancelar() {
    this.router.navigate(['/vehiculo']);
  }
}
