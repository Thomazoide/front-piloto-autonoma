import { ReactElement, useState, useEffect } from "react"
import { MapContainer, GeoJSON, TileLayer, Marker, Popup } from "react-leaflet"
import 'leaflet/dist/leaflet.css'
import { sede } from "@/types/sede"
import { sala } from "@/types/sala"
import { geoJson, icon, LatLngBounds, LatLngExpression } from 'leaflet'
import { worker } from "@/types/worker"
import ReactLeafletDriftMarker from 'react-leaflet-drift-marker';
interface PropsMapa {
    tipo?: "guardia" | "docente"
    dataSede: sede
    sala?: sala
    entidad?: worker
    showIndoor?: boolean
    floor?: number
}

export default function Mapa(props: Readonly<PropsMapa>): ReactElement {
    const [sSala, setSSala] = useState<sala | undefined>(props.sala)
    
    const iconoSala = icon({
        iconUrl: "https://storagejca.s3.sa-east-1.amazonaws.com/teacher-icon-png-11.webp",
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -34]
    })

    const miIcono = icon({
        iconUrl: 'https://storagejca.s3.sa-east-1.amazonaws.com/teacher-icon-png-11.webp',
        iconSize: [12, 12],
        iconAnchor: [8, 16],
        popupAnchor: [0, -34]
    })
    useEffect( () => {
        if(props.sala){
            setSSala(props.sala)
        }
    }, [props] )
    const ubicacion: LatLngExpression = {
        lat: props.dataSede.ubicacion.features[0].geometry.coordinates[1],
        lng: props.dataSede.ubicacion.features[0].geometry.coordinates[0]
    } 

    const bounds: LatLngBounds = geoJson(props.dataSede.m2).getBounds()

    return(
        <>
        { props.dataSede ? 
        //@ts-ignore
        <MapContainer center={ubicacion} zoom={20} style={{height: '100%', width: '100%'}} key={ubicacion.lat.toString()} >
            <TileLayer 
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">Open StreetMap</a> contributors' />
            <GeoJSON data={props.dataSede.m2} style={{color: 'red'}}/>
            {
                props.dataSede.indoorMap && props.floor && bounds && 
                <GeoJSON data={props.dataSede.plantas[props.floor]}/>
            }
            {sSala ?
                sSala.ubicacion.features.map( (f) => (
                    //@ts-ignore
                    <Marker key={f.geometry.coordinates[0].toString()} position={[f.geometry.coordinates[1], f.geometry.coordinates[0]]} icon={iconoSala}>
                        <Popup closeButton>
                            {`Sala: ${sSala.numero}`}
                        </Popup>
                    </Marker>
                ) )
            : null}
            {
                props.entidad && props.entidad.ubicacion ?
                <ReactLeafletDriftMarker duration={500} position={[props.entidad.ubicacion.locations[0].coords.latitude, props.entidad.ubicacion.locations[0].coords.longitude]} icon={miIcono}/>
                : null
            }
        </MapContainer> 
        : null}
        </>
    )
}