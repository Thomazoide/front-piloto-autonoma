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
    bounds: LatLngExpression[]
}

export type GeoJson<T> = {
    type: 'FeatureCollection',
    features: featuresGeoJson<T>[]
}

export type sede = {
    id: number,
    ubicacion: GeoJson<number[]>,
    nombre: string,
    m2: GeoJson<number[][][]>,
    indoorMap: IndoorMap | null,
    plantas: GeoJson<number[][][]>[]
}