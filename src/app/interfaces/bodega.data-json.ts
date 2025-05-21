import { BodegaDataElement } from "./bodega.data-element";

export interface BodegaDataJsonElement {
    fila: number;
    etiqueta: string;
    datos: BodegaDataElement[];
}