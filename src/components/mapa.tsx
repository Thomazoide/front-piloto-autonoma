import { ReactElement, useState, useEffect } from "react"
import { MapContainer, GeoJSON, TileLayer, Marker, Popup, ImageOverlay } from "react-leaflet"
import 'leaflet/dist/leaflet.css'
import { sede } from "@/types/sede"
import { sala } from "@/types/sala"
import { icon, LatLngBounds, LatLngExpression } from 'leaflet'
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
        iconUrl: "https://hipic-vet-soft-backend.s3.us-west-1.amazonaws.com/autonoma/opened-door-aperture.png",
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -34]
    })

    const miIcono = icon({
        iconUrl: props.tipo === "guardia" ? 'https://hipic-vet-soft-backend.s3.us-west-1.amazonaws.com/autonoma/PeopleIcons-16-1024.webp' : 'https://hipic-vet-soft-backend.s3.us-west-1.amazonaws.com/autonoma/teacher-icon-png-11.jpg',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
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

    const bounds = props.dataSede.indoorMap && new LatLngBounds(props.dataSede.indoorMap.bounds[1], props.dataSede.indoorMap.bounds[0])

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
                props.dataSede.indoorMap && props.showIndoor && props.floor && bounds && 
                <ImageOverlay
                url={`${props.dataSede.indoorMap.pisos[props.floor]}`}
                bounds={bounds}
                />
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
                <ReactLeafletDriftMarker duration={500} key={props.entidad.ubicacion.locations[0].coords.latitude.toString()} position={[props.entidad.ubicacion.locations[0].coords.latitude, props.entidad.ubicacion.locations[0].coords.longitude]} icon={miIcono}/>
                : null
            }
        </MapContainer> 
        : null}
        </>
    )
}