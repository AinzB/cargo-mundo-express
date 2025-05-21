import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { identity, Observable } from "rxjs";
import { Envio } from "../models/envio.model";
import { ApiConfig } from "../config/api.config";

@Injectable({
    providedIn: 'root',
})

export class Envioservice {
    private apiUrl = ApiConfig.baseUrl + ApiConfig.enviosEndpoint;

    constructor(private http: HttpClient) { }

    // Listar todos los envios
    getEnvios(): Observable<Envio[]> {
        return this.http.get<Envio[]>(this.apiUrl);
    }

     // Listar todos los Envios activos
    getEnviosActivos(): Observable<Envio[]> {
        return this.http.get<Envio[]>(this.apiUrl + '/getactive');
    }

    // Busqueda de Envio por Id
    getEnvio(id: number): Observable<Envio> {
        return this.http.get<Envio>(`${this.apiUrl}/${id}`);
    }

    getEnvioFiltrado(filtro: string): Observable<Envio[]> {
        return this.http.get<Envio[]>(`${this.apiUrl}/getfiltro/${filtro}`);
    }

    getResumenEnvio(period: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/getresumen/${period}`);
    }

    // Crear un nuev Envio
    createEnvio(envio: Envio): Observable<Envio> {
        return this.http.post<Envio>(this.apiUrl, this.completePayload(envio) );
    }

    // Actualizar un Envio existente
    updateEnvio(id: number, envio: Envio): Observable<Envio> {
        return this.http.put<Envio>(`${this.apiUrl}/${id}`, this.completePayload(envio));
    }

    // Actualizar parcialmente un Envio
    updatePartialEnvio(id: number, envio: Envio): Observable<Envio> {
        return this.http.patch<Envio>(`${this.apiUrl}/${id}`, this.completePayload(envio));
    }

    // Eliminar una Envio
    deleteEnvio(id:number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    exportAsCsv(): Observable<Blob> {
        return this.http.get(`${this.apiUrl}/export/csv`, { responseType: 'blob' });
    }

    exportAsXlsx(): Observable<Blob> {
        return this.http.get(`${this.apiUrl}/export/xlsx`, { responseType: 'blob' });
    }

    completePayload(envio:Envio) {
        const payload = {
            tracking_id: envio.tracking_id,
            descripcion: envio.descripcion,
            status: envio.status,
            bodega_etiqueta: envio.bodega_etiqueta,
            peso: envio.peso,
            nombre_remitente: envio.nombre_remitente,
            email_remitente: envio.email_remitente,
            numero_remitente: envio.numero_remitente,
            nombre_receptor: envio.nombre_receptor,
            email_receptor: envio.email_receptor,
            numero_receptor: envio.numero_receptor,
            entrega: envio.entrega,
            departamento: envio.departamento,
            direccion: envio.direccion,
            // Foreign Keys
            bodega_id: envio.bodega?.id,
            servicio_id: envio.servicio?.id,
            created_by_id: envio.created_by?.id,
            updated_by_id: envio.updated_by?.id,
        };

        return payload;
    }
}