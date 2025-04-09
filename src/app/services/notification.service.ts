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
  ) { }


  async initialize(){
    console.log('Initialize', this.oPlatform.is('capacitor'));
    if (this.oPlatform.is('capacitor')) {
      console.log('OneSignal setupPush');
      OneSignal.Debug.setLogLevel(6);

      OneSignal.initialize(environment.oneSignal.appId);
      console.log('OneSignal Init');

      OneSignal.Notifications.addEventListener('click', async (e) => {
        let clickData = await e.notification;
        console.log('Notification Clicked : ' + JSON.stringify(clickData));
      });

      OneSignal.Notifications.requestPermission(true).then(
        (success: Boolean) => {
          console.log('Notification permission granted ' + success);
        }
      );
      this.getOneSignalId();
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
