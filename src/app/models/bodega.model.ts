import { BodegaDataJsonElement } from "../interfaces/bodega.data-json";

export interface Bodega {
    id?: number;
    codigo: string;
    dataJson: BodegaDataJsonElement[];
    active?: boolean;
    [key: string]: string | number | boolean | BodegaDataJsonElement[] | undefined;
}