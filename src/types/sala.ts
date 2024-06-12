import { LatLngExpression } from "leaflet"

export type punto = {
    type: string,
    properties: {},
    geometry: {
        type: string,
        coordinates: LatLngExpression
    }
}

export type sala = {
    id: number,
    numero: number,
    ubicacion: punto,
    id_gateway?: number,
    id_sede?: number
}