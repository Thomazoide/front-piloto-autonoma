import { geolocation } from "./location"

export type worker = {
    id: number,
    rut: string,
    nombre: string,
    email: string,
    celular: string,
    id_beacon: number,
    ubicacion: geolocation | null
}