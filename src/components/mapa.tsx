import { FC, useState } from "react"
import { MapContainer, Polygon, TileLayer } from "react-leaflet"
import 'leaflet/dist/leaflet.css'
import { sede } from "@/types/sede"
import { LatLngTuple } from "leaflet"

const Mapa: FC<sede> = (dataSede) => {
    const [poligono] = useState<LatLngTuple>(dataSede.m2?.features[0].geometry.coordinates)
    return(
        <MapContainer center={dataSede.ubicacion.features[0].geometry.coordinates}></MapContainer>
    )
}