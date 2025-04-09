import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Usuario } from '../interfaces/user.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = environment.apiBaseUrl + '/usuarios';
  constructor(private ohttp: HttpClient) { }

  getUsuarios() {
    return this.ohttp.get<Usuario[]>(this.apiUrl);
  }

  getUsuarioByEmail(email:string): Observable<Usuario> {
    return this.ohttp.get<Usuario>(`${this.apiUrl}/${email}`);
  }

  createUsuario(usuario: Usuario): Observable<any> {
    return this.ohttp.post<any>(this.apiUrl, usuario);
  }
  
  updateUsuario(usuario: Usuario): Observable<any> {
    return this.ohttp.put<any>(`${this.apiUrl}/${usuario._id}`, usuario);
  }

  deleteUsuario(email:string): Observable<any> {
    return this.ohttp.delete<any>(`${this.apiUrl}/${email}`);
  }

}
