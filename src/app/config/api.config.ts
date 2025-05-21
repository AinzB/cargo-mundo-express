import { environment } from "../../environments/environment";

// Export de todos los endpoints de servicios
export const ApiConfig = {
    baseUrl: environment.apiUrl,
    usuariosEndpoint: 'usuarios',
    serviciosEndpoint: 'servicios',
    bodegasEndpoint: 'bodegas',
    enviosEndpoint: 'envios',
    ticketsEndpoint: 'tickets',
}