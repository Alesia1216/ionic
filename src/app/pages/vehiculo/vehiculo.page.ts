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
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular/standalone';
import { Vehicle } from 'src/app/interfaces/vehicle.interface';
import { VehicleService } from 'src/app/services/vehicle.service';
import { ToastService } from 'src/app/services/toast.service';
import { addIcons } from 'ionicons';
import {
  homeOutline,
  trashOutline,
  createOutline,
  addOutline,
} from 'ionicons/icons';
import { UsuarioHeaderComponent } from "../../components/usuario-header/usuario-header.component";

@Component({
  selector: 'app-vehiculo',
  templateUrl: './vehiculo.page.html',
  styleUrls: ['./vehiculo.page.scss'],
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
    UsuarioHeaderComponent
],
})
export class VehiculoPage {
  searchQuery: string = ''; // Valor del campo de búsqueda
  vehiculos: Vehicle[] = []; // Lista completa de vehículos
  filteredVehiculos: Vehicle[] = []; // Lista filtrada según la búsqueda

  private vehicleService = inject(VehicleService);
  private toastService = inject(ToastService);

  constructor(
    private router: Router,
    private alertController: AlertController
  ) {
    addIcons({ homeOutline, createOutline, trashOutline, addOutline });
  }

  // Utilizamos willEnter para que se actualice la lista al crear o eliminar
  ionViewWillEnter() {
    this.obtenerVehiculos();
  }

  ngAfterViewInit() {}

  obtenerVehiculos() {
    this.vehicleService.getAllVehicles().subscribe({
      next: (data) => {
        this.vehiculos = data;
        this.filteredVehiculos = data;
      },
      error: (error) => {
        console.error('Error al obtener vehículos:', error);
        let message = 'Error en la obtención de vehículos';
        if (error.error && error.error.message) message = error.error.message;
        this.toastService.showMessage(message, 'warning');
      },
    });
  }

  // Función que se llama cuando el usuario hace una búsqueda
  searchVehicle() {
    console.log('SearchVehicle');
    if (this.searchQuery.trim() === '') {
      this.filteredVehiculos = this.vehiculos; // Si no hay texto de búsqueda, mostramos todos los vehículos
    } else {
      // Filtramos la lista de vehículos por matrícula
      this.filteredVehiculos = this.vehiculos.filter((vehiculo) =>
        vehiculo.matricula
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase())
      );
    }
  }

  goHome() {
    this.router.navigate(['/home']);
  }

  editVehicle(vehiculo: Vehicle) {
    console.log('EditV', vehiculo);
    this.router.navigate(['/vehiculo/editar', vehiculo.matricula]);
  }

  async deleteVehicle(vehiculo: Vehicle) {
    console.log('DeleteV', vehiculo);
    const alert = await this.alertController.create({
      header: 'Eliminar Vehículo',
      message: `¿Estás seguro de que deseas eliminar el vehiculo con matrícula ${vehiculo.matricula}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          role: 'destructive', // Rojo en iOS
          handler: () => {
            this.vehicleService.deleteVehicle(vehiculo).subscribe(() => {
              this.toastService.showMessage('Vehículo eliminado', 'warning');
              this.obtenerVehiculos(); // Recargar la lista tras eliminar
            });
          },
        },
      ],
    });

    await alert.present();
  }
  createVehicle() {
    console.log('Crear vehículo');
    this.router.navigate(['/vehiculo/nuevo']);
  }
}
