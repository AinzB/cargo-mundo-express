export interface Servicio {
    id?: number;
    name: string;
    description: string;
    transporte?: string;
    duracion?: string;
    priceperlb?: number;
    extraprice?: number;
    active?: boolean;
    [key: string]: string | number | boolean | undefined;
}