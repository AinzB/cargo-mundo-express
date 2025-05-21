import { Bodega } from "./bodega.model";
import { Servicio } from "./servicios.model";
import { Usuario } from "./usuario.model";

export interface Envio {
    id?: number;
    tracking_id: string;
    descripcion?: string;
    servicio: Servicio;
    status: string;
    bodega: Bodega;
    bodega_etiqueta?: string;
    peso: number;
    nombre_remitente: string;
    email_remitente?: string;
    numero_remitente?: string;
    nombre_receptor?: string;
    email_receptor?: string;
    numero_receptor?: string;
    entrega?: string;
    departamento?: string;
    direccion?: string;
    created_by?: Usuario;
    updated_by?: Usuario;
    [key: string]: string | number | boolean | undefined | Servicio | Bodega | Usuario;
}