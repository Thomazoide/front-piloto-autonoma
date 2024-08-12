import { LatLngExpression } from "leaflet"
import { GeoJson } from "./sede"

export type sala = {
    id: number,
    numero: string,
    ubicacion: GeoJson<LatLngExpression>,
    id_gateway: number,
    id_sede: number
}