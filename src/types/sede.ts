import { LatLngTuple } from "leaflet"

export type featuresGeoJson = {
    type: string,
    properties?: {},
    geometry: {
        coordinates: LatLngTuple,
        type: string
    }
}

export type geoJson = {
    type: 'FeatureCollection',
    features: featuresGeoJson[]
}

export type sede = {
    id: number,
    ubicacion: geoJson,
    nombre: string,
    m2: geoJson
}