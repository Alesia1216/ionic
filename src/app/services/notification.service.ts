import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import OneSignal from 'onesignal-cordova-plugin';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private oPlatform: Platform,
    private oRouter: Router,
    private oStorageService: StorageService,
    private oMensajeService: MensajeService
  ) { }


  async initialize(){
    if (this.oPlatform.is('capacitor')) {
      console.log('OneSignal setupPush');
      OneSignal.Debug.setLogLevel(6);

      OneSignal.initialize(environment.oneSignal.appId);
      console.log('OneSignal Init');

      OneSignal.Notifications.addEventListener('click', async (e) => {
        let clickData = await e.notification;
        console.log('Notification Clicked : ' + JSON.stringify(clickData));
        const usuario = await this.storageService.get('plannerstats-user');
        const datos: MensajeLeido = {
          messageId: clickData.additionalData.messageId,
          userId: usuario._id,
        };
        // Marcar el mensaje como leido.
        await firstValueFrom(this.mensajeService.recivedMensaje(datos));
        // Navegar a la página de detalles del mensaje
        const messageId = clickData.additionalData.messageId;
        if (messageId) {
          // Navegar a la página de detalles pasando el ID del mensaje como parámetro
          this.router.navigate(['/mensaje-detalle', messageId]);
        }
      });


      OneSignal.Notifications.requestPermission(true).then(
        (success: Boolean) => {
          console.log('Notification permission granted ' + success);
        }
      );
      OneSignal.User.pushSubscription.optIn();
      console.log('🔁 Forzando suscripción del usuario');

      // Obtener OneSignal ID
      const oneSignalId = await this.getOneSignalId();
      console.log('🆔 OneSignal User ID:', oneSignalId);
    }
  }


  async getOneSignalId(): Promise<string | null> {

    try{
      const userId = await OneSignal.User.getOnesignalId();
      return userId;
    }catch(error){
      console.error('Error obteniendo el OneSignal User ID:', error);
      return null;
    }

  }

  async setAliasOneSignal(alias: string){
    try{
      await OneSignal.User.addAlias('Nombre IONIC', alias);
    }catch(error){
      console.error('Error actualizando alias:', error);
    }
  }


  async setExternalId(externalId: string){
    try{
      await OneSignal.login(externalId);
    }catch(error){
      console.error('Error asignando el External ID en OneSignal:', error);
    }

  }

}
