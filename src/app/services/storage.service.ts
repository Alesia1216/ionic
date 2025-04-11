import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject, from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private _storage: Storage | null = null;
  private isReady = false;

  private userSubject = new BehaviorSubject<any>(null);

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    this._storage = await this.storage.create();
    this.isReady = true; // Marcar como listo

     // Recuperar el usuario guardado al iniciar
    const savedUser = await this._storage.get('plannerstats-user');
    if (savedUser) {
    this.userSubject.next(savedUser);
    }
  }

  async setUser(user: any) {
    await this.ensureReady();
    await this._storage?.set('plannerstats-user', user);
    this.userSubject.next(user); 
  }

  getUser(): Observable<any> {
    return this.userSubject.asObservable(); 
  }

  async set(key: string, value: any) {
    await this.ensureReady();
    await this._storage?.set(key, value);
  }

  async get(key: string) {
    await this.ensureReady();
    return this._storage?.get(key);
  }

  async remove(key: string) {
    await this.ensureReady();
    await this._storage?.remove(key);
  }

  async clear() {
    await this.ensureReady();
    await this._storage?.clear();
  }

  private async ensureReady() {
    while (!this.isReady) {
      await new Promise((resolve) => setTimeout(resolve, 10)); // Esperar hasta que Storage esté listo
    }
  }
}
