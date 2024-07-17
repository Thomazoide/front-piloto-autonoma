import { ReactElement } from "react"
import { MapContainer, GeoJSON, TileLayer } from "react-leaflet"
import 'leaflet/dist/leaflet.css'
import { sede } from "@/types/sede"
import { sala } from "@/types/sala"
import L from 'leaflet'
import UpdatableMarker from "./updatableMarker"
import { worker } from "@/types/worker"
import { ingreso } from "@/types/ingreso"

interface worker_ingreso {
    trabajador: worker
    ultimo_ingreso: ingreso
    estuvo: boolean 
}

interface PropsMapa {
    dataSede: sede
    tipo: 'guardias' | 'docentes'
    salas: sala[]
    listaWorkers: worker_ingreso[]
}

export default function MapaMultiple(props: Readonly<PropsMapa>): ReactElement {

    const iconoGuardia = L.icon({
        iconSize: [32, 32],
        iconUrl: 'https://hipic-vet-soft-backend.s3.us-west-1.amazonaws.com/autonoma/PeopleIcons-16-1024.webp',
        iconAnchor: [16, 32],
        popupAnchor: [0, -24]
    })

    const iconoDocente = L.icon({
        iconSize: [32, 32],
        iconUrl: 'https://hipic-vet-soft-backend.s3.us-west-1.amazonaws.com/autonoma/teacher-icon-png-11.jpg',
        iconAnchor: [16, 32],
        popupAnchor: [0, -24]
    })

    return(
        <>
        { props.dataSede && props.salas ?
        //@ts-ignore
        <MapContainer center={[props.dataSede.ubicacion.features[0].geometry.coordinates[1], props.dataSede.ubicacion.features[0].geometry.coordinates[0]]} 
        zoom={20} 
        style={{height: '100%', width: '100%'}}>
            <TileLayer 
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">Open StreetMap</a> contributors' />
            <GeoJSON data={props.dataSede.m2} style={{color: 'red'}}/>
            { 
                props.salas.map( (s: sala) => <UpdatableMarker key={s.id} workers={props.listaWorkers} sala={s} icono={props.tipo === 'guardias' ? iconoGuardia : iconoDocente} tipo={props.tipo}/> )
              
            }
        </MapContainer> 
        : null}
        </>
    )
}