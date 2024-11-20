import { MapContainer, GeoJSON, TileLayer, Popup } from "react-leaflet";
import { ReactElement } from "react";
import { GeoJson, sede } from "@/types/sede";
import { Content, icon, LatLngExpression, PopupOptions } from "leaflet";
import { worker } from "@/types/worker";
import ReactLeafletDriftMarker from 'react-leaflet-drift-marker'
import 'leaflet/dist/leaflet.css'
import { sala } from "@/types/sala";

type coordinates = number[][][]

interface MCProps{
    planta?: GeoJson<coordinates>
    workers?: worker[]
    salas?: sala[]
    sede: sede
    workerType: "guardia" | "docente"
    showWorkers: boolean
    showSalas?: boolean
}

export default function MapComponent( props: Readonly<MCProps> ): ReactElement{

    const centro: LatLngExpression = {
        lat: props.sede.ubicacion.features[0].geometry.coordinates[1],
        lng: props.sede.ubicacion.features[0].geometry.coordinates[0]
    }

    const icono = icon({
        iconUrl: props.workerType === "guardia" ? 'https://hipic-vet-soft-backend.s3.us-west-1.amazonaws.com/autonoma/PeopleIcons-16-1024.webp' : 'https://hipic-vet-soft-backend.s3.us-west-1.amazonaws.com/autonoma/teacher-icon-png-11.jpg',
        iconAnchor: [16, 16],
        iconSize: [32, 32]
    })

    const iconoSalas = icon({
        iconUrl: "https://hipic-vet-soft-backend.s3.us-west-1.amazonaws.com/autonoma/opened-door-aperture.png",
        iconAnchor: [16, 16],
        iconSize: [32, 32]
    })

    return(
        props.sede &&
        <MapContainer dragging={false} zoomControl={false} minZoom={15} center={centro} zoom={20} style={{height: "100%", width: "100%"}} key={ props.planta ? JSON.stringify(props.planta) : JSON.stringify(props.sede.m2) }>
            <TileLayer 
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />
            <GeoJSON data={props.sede.m2}/>
            {
                props.planta ?
                <GeoJSON onEachFeature={ (feature, layer) => {
                    const options: PopupOptions = {
                        minWidth: 100,
                        className: "feature-popup"
                    }
                    layer.bindPopup( (): Content => {
                        return `${feature.properties.name || feature.properties["name "]}`
                    }, options )
                }}
                data={props.planta} />
                : null
            }
            {
                props.workers && props.showWorkers &&
                props.workers.map( (w) => {
                    if(w.ubicacion) return(
                        <ReactLeafletDriftMarker key={w.id} position={{
                            lat: w.ubicacion.locations[0].coords.latitude,
                            lng: w.ubicacion.locations[0].coords.longitude
                        }}
                        duration={1000}
                        icon={icono}>
                            <Popup closeButton>
                                {w.nombre}
                            </Popup>
                        </ReactLeafletDriftMarker>
                    )
                } )
            }
            {
                props.salas && props.showSalas &&
                props.salas.map( (s) => (
                    <ReactLeafletDriftMarker key={s.id} position={{
                        //@ts-ignore
                        lat: s.ubicacion.features[0].geometry.coordinates[1],
                        //@ts-ignore
                        lng: s.ubicacion.features[0].geometry.coordinates[0]
                    }}
                    duration={1000}
                    icon={iconoSalas}></ReactLeafletDriftMarker>
                ) )
            }
        </MapContainer>
    )
}