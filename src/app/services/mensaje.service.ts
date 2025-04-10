import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Mensaje } from '../interfaces/mensaje.interface';

@Injectable({
  providedIn: 'root'
})
export class MensajeService {

  private apiUrl = environment.apiBaseUrl + '/mensajes';

  constructor(private oHttp: HttpClient) { }

  getMensajes(): Observable<Mensaje[]> {
    return this.oHttp.get<Mensaje[]>(this.apiUrl);
  }

  getMensajeById(id: string): Observable<Mensaje> {
    return this.oHttp.get<Mensaje>(`${this.apiUrl}/${id}`);
  }

  getMensajeByUser(userId: string): Observable<Mensaje[]> {
    return this.oHttp.get<Mensaje[]>(`${this.apiUrl}/user/${userId}`);
  }

  createMensaje(mensaje: Mensaje): Observable<Mensaje> {
    return this.oHttp.post<Mensaje>(this.apiUrl, mensaje);
  }

  updateMensaje(mensaje: Mensaje): Observable<Mensaje> {
    return this.oHttp.put<Mensaje>(`${this.apiUrl}/${mensaje._id}`, mensaje);
  }

  sendOneSignal(id: string): Observable<Mensaje> {
    return this.oHttp.post<Mensaje>(`${this.apiUrl}/onesignal/${id}`, {});
  }

  deleteMensaje(mensaje: Mensaje): Observable<Mensaje> {
    return this.oHttp.delete<Mensaje>(`${this.apiUrl}/${mensaje._id}`);
  }

}
