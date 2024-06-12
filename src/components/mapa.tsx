import { ReactElement } from "react"
import { MapContainer, GeoJSON, TileLayer, Marker, Popup } from "react-leaflet"
import 'leaflet/dist/leaflet.css'
import { sede } from "@/types/sede"
import { sala } from "@/types/sala"
import { Spinner } from "@nextui-org/react"

interface PropsMapa {
    dataSede?: sede,
    sala?: sala
}

export default function Mapa(props: Readonly<PropsMapa>): ReactElement {
    return(
        <>
        { props.dataSede ? 
        <MapContainer center={[props.dataSede.ubicacion.features[0].geometry.coordinates[1], props.dataSede.ubicacion.features[0].geometry.coordinates[0]]} zoom={!props.sala ? 17 : 20} style={{height: '100%', width: '100%'}}>
            <TileLayer 
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">Open StreetMap</a> contributors' />
            <GeoJSON data={props.dataSede.m2} style={{color: 'red'}}/>
            {props.sala ?
            <Marker
            position={[props.sala.ubicacion.geometry.coordinates[1], props.sala.ubicacion.geometry.coordinates[0]]}>
                <Popup closeButton>
                    <small>
                        Sala {props.sala.numero} <br/>
                        ID: {props.sala.id}
                    </small>
                </Popup>
            </Marker>
            : null}
        </MapContainer> 
        : null}
        </>
    )
}