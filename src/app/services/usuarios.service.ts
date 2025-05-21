import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { identity, Observable } from "rxjs";
import { Usuario } from "../models/usuario.model";
import { ApiConfig } from "../config/api.config";

@Injectable({
    providedIn: 'root',
})

export class UsuarioService {
    private apiUrl = ApiConfig.baseUrl + ApiConfig.usuariosEndpoint;

    constructor(private http: HttpClient) { }

    // Listar todos los usuarios
    getUsuarios(): Observable<Usuario[]> {
        return this.http.get<Usuario[]>(this.apiUrl);
    }

    // Listar todos los usuarios por active field
    getUsuariosPorActive(filtro:boolean): Observable<Usuario[]> {
        return this.http.get<Usuario[]>(`${this.apiUrl}/filtraractivos/${filtro}`);
    }

    // Busqueda de usuario por Id
    getUsuario(id: number): Observable<Usuario> {
        return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
    }

    // Crear un nuevo usuario
    createUsuario(usuario: Usuario): Observable<Usuario> {
        return this.http.post<Usuario>(this.apiUrl, usuario);
    }

    // Actualizar un usuario existente
    updateUsuario(id: number, usuario: Usuario): Observable<Usuario> {
        return this.http.put<Usuario>(`${this.apiUrl}/${id}`, usuario);
    }

    // Actualizar parcialmente un usuario
    updatePartialUsuario(id: number, usuario: Usuario): Observable<Usuario> {
        return this.http.patch<Usuario>(`${this.apiUrl}/${id}`, usuario);
    }

    // Eliminar un usuario
    inactivateUsuario(id:number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    // Reactivar un usuario
    activarUsuario(id:number): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}/activarusuario/${id}`, null);
    }
}