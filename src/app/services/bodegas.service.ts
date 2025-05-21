import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { identity, Observable } from "rxjs";
import { Bodega } from "../models/bodega.model";
import { ApiConfig } from "../config/api.config";

@Injectable({
    providedIn: 'root',
})

export class BodegaService {
    private apiUrl = ApiConfig.baseUrl + ApiConfig.bodegasEndpoint;

    constructor(private http: HttpClient) { }

    // Listar todas las boedgas
    getBodegas(): Observable<Bodega[]> {
        return this.http.get<Bodega[]>(this.apiUrl);
    }

     // Listar todas las bodegas activas
     getBodegasActivas(): Observable<Bodega[]> {
        return this.http.get<Bodega[]>(this.apiUrl + '/getactive');
    }

    // Busqueda de bodega por Id
    getBodega(id: number): Observable<Bodega> {
        return this.http.get<Bodega>(`${this.apiUrl}/${id}`);
    }

    // Crear una nueva bodega
    createBodega(Bodegas: Bodega): Observable<Bodega> {
        return this.http.post<Bodega>(this.apiUrl, Bodegas);
    }

    // Actualizar una bodega existente
    updateBodega(id: number, Bodega: Bodega): Observable<Bodega> {
        return this.http.put<Bodega>(`${this.apiUrl}/${id}`, Bodega);
    }

    // Actualizar parcialmente una Bodega
    updatePartialSerivicio(id: number, Bodega: Bodega): Observable<Bodega> {
        return this.http.patch<Bodega>(`${this.apiUrl}/${id}`, Bodega);
    }

    // Eliminar una Bodega
    deleteBodega(id:number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}