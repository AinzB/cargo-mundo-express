import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { identity, Observable } from "rxjs";
import { Servicio } from "../models/servicios.model";
import { ApiConfig } from "../config/api.config";

@Injectable({
    providedIn: 'root',
})

export class ServicioService {
    private apiUrl = ApiConfig.baseUrl + ApiConfig.serviciosEndpoint;

    constructor(private http: HttpClient) { }

    // Listar todos los servicios
    getServicios(): Observable<Servicio[]> {
        return this.http.get<Servicio[]>(this.apiUrl);
    }

    getActiveServices(): Observable<Servicio[]> {
        return this.http.get<Servicio[]>(this.apiUrl + '/getactive');
    }

    // Busqueda de servicio por Id
    getServicio(id: number): Observable<Servicio> {
        return this.http.get<Servicio>(`${this.apiUrl}/${id}`);
    }

    getServicioFiltrado(filtro: string): Observable<Servicio[]> {
        return this.http.get<Servicio[]>(`${this.apiUrl}/getfiltro/${filtro}`);
    }

    // Crear un nuevo servicio
    createServicio(servicios: Servicio): Observable<Servicio> {
        return this.http.post<Servicio>(this.apiUrl, servicios);
    }

    // Actualizar un servicio existente
    updateServicio(id: number, servicio: Servicio): Observable<Servicio> {
        return this.http.put<Servicio>(`${this.apiUrl}/${id}`, servicio);
    }

    // Actualizar parcialmente un servicio
    updatePartialSerivicio(id: number, servicio: Servicio): Observable<Servicio> {
        return this.http.patch<Servicio>(`${this.apiUrl}/${id}`, servicio);
    }

    // Eliminar un servicio
    deleteServicio(id:number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}