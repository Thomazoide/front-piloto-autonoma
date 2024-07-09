import { ReactElement, useState, useEffect } from "react"
import { MapContainer, GeoJSON, TileLayer, Marker, Popup } from "react-leaflet"
import 'leaflet/dist/leaflet.css'
import { sede } from "@/types/sede"
import { sala } from "@/types/sala"
import { icon } from 'leaflet'
interface PropsMapa {
    dataSede: sede,
    sala?: sala
}

export default function Mapa(props: Readonly<PropsMapa>): ReactElement {
    const [sSala, setSSala] = useState<sala | undefined>(props.sala)
    const miIcono = icon({
        iconUrl: 'https://hipic-vet-soft-backend.s3.us-west-1.amazonaws.com/autonoma/PeopleIcons-16-1024.webp',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -34]
    })
    useEffect( () => {
        if(props.sala){
            setSSala(props.sala)
        }
    }, [props] )
    return(
        <>
        { props.dataSede ? 
        //@ts-ignore
        <MapContainer center={[props.dataSede.ubicacion.features[0].geometry.coordinates[1], props.dataSede.ubicacion.features[0].geometry.coordinates[0]]} zoom={20} style={{height: '100%', width: '100%'}}>
            <TileLayer 
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">Open StreetMap</a> contributors' />
            <GeoJSON data={props.dataSede.m2} style={{color: 'red'}}/>
            {sSala ?
                sSala.ubicacion.features.map( (f, i) => (
                    //@ts-ignore
                    <Marker key={i+1} position={[f.geometry.coordinates[1], f.geometry.coordinates[0]]} icon={miIcono}>
                        <Popup closeButton>
                            {`Sala: ${sSala.numero}`}
                        </Popup>
                    </Marker>
                ) )
            : null}
        </MapContainer> 
        : null}
        </>
    )
}