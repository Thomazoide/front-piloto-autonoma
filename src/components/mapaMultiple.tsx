import { ReactElement, useState, useEffect } from "react"
import { MapContainer, GeoJSON, TileLayer, Marker, Popup } from "react-leaflet"
import 'leaflet/dist/leaflet.css'
import { sede } from "@/types/sede"
import { sala } from "@/types/sala"
import L, { LatLngExpression } from 'leaflet'

interface PropsMapa {
    dataSede: sede,
    sala: sala[],
    tipo: 'guardias' | 'docentes'
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
        iconUrl: 'https://hipic-vet-soft-backend.s3.us-west-1.amazonaws.com/autonoma/PeopleIcons-16-1024.webp',
        iconAnchor: [16, 32],
        popupAnchor: [0, -24]
    })

    return(
        <>
        { props.dataSede ? 
        //@ts-ignore
        <MapContainer center={[props.dataSede.ubicacion.features[0].geometry.coordinates[1], props.dataSede.ubicacion.features[0].geometry.coordinates[0]]} 
        zoom={20} 
        style={{height: '100%', width: '100%'}}>
            <TileLayer 
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">Open StreetMap</a> contributors' />
            <GeoJSON data={props.dataSede.m2} style={{color: 'red'}}/>
            {
                props.sala.map( (s: sala) => {
                    //@ts-ignore
                    const ubicacion: any = [s.ubicacion.features[0].geometry.coordinates[1], s.ubicacion.features[0].geometry.coordinates[0]]
                    return !ubicacion ? null : (
                        <Marker key={s.id} position={ubicacion} icon={props.tipo === "guardias" ? iconoGuardia : iconoDocente}>
                            <Popup closeButton>
                                {`Sala ${s.numero}`}
                            </Popup>
                        </Marker>
                    )
                } )
            }
        </MapContainer> 
        : null}
        </>
    )
}