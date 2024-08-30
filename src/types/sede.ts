import { LatLngExpression } from "leaflet"

export type featuresGeoJson<T> = {
    type: string,
    properties?: {},
    geometry: {
        coordinates: T,
        type: string
    }
}

export interface IndoorMap{
    pisos: string[]
}

export type GeoJson<T> = {
    type: 'FeatureCollection',
    features: featuresGeoJson<T>[]
}

export type sede = {
    id: number,
    ubicacion: GeoJson<LatLngExpression>,
    nombre: string,
    m2: GeoJson<LatLngExpression[]>,
    indoorMap: IndoorMap | null
}