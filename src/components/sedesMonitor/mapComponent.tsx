import { MapContainer, GeoJSON, TileLayer } from "react-leaflet";
import { ReactElement } from "react";
import { GeoJson, sede } from "@/types/sede";
import { LatLngExpression } from "leaflet";

type coordinates = number[][][]

interface MCProps{
    planta?: GeoJson<coordinates>
    sede: sede
}

export default function MapComponent( props: Readonly<MCProps> ): ReactElement{

    const centro: LatLngExpression = {
        lat: props.sede.ubicacion.features[0].geometry.coordinates[1],
        lng: props.sede.ubicacion.features[0].geometry.coordinates[0]
    }

    return(
        <MapContainer center={centro} zoom={20} style={{height: "100%", width: "100%"}} key={JSON.stringify(props.sede)}>
            <TileLayer 
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">Open StreetMap</a> contributors' />
            {
                props.planta ?
                <GeoJSON data={props.planta} />
                : <GeoJSON data={props.sede.m2}/>
            }
        </MapContainer>
    )
}