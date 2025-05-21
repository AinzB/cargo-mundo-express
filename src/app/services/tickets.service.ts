import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfig } from '../config/api.config';

@Injectable({
    providedIn: 'root',
})

export class TicketService {
    private apiUrl = ApiConfig.baseUrl + ApiConfig.ticketsEndpoint;

    constructor(private http: HttpClient) { }

    // Método para obtener el PDF del ticket
    getTicketPdf(ticket: any): Observable<Blob> {
        return this.http.post(`${this.apiUrl}`, ticket, { responseType: 'blob' });
    }

    // Metodo para generar el segundo ticket 
    getSegundoTicketPDF(ticket: any): Observable<Blob> {
        return this.http.post(`${this.apiUrl}/second`, ticket, { responseType: 'blob' });
    }
}