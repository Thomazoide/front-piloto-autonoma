import { ReactElement, useState, useEffect } from "react"
import { MapContainer, GeoJSON, TileLayer, Marker, Popup } from "react-leaflet"
import 'leaflet/dist/leaflet.css'
import { sede } from "@/types/sede"
import { sala } from "@/types/sala"
import L from 'leaflet'

interface PropsMapa {
    dataSede: sede,
    sala: sala[],
    tipo: 'guardias' | 'docentes'
}

export default function MapaMultiple(props: Readonly<PropsMapa>): ReactElement {
    const [sSala, setSSala] = useState<sala[] | undefined>(props.sala)
    useEffect( () => {
        if(props.sala){
            setSSala(props.sala)
        }
    }, [props] )

    const miIcono = L.divIcon({
        className: 'MiIcono',
        iconSize: [38, 95],
        iconUrl: props.tipo === "guardias" ? 'https://hipic-vet-soft-backend.s3.us-west-1.amazonaws.com/autonoma/PeopleIcons-16-1024.webp' : 'https://hipic-vet-soft-backend.s3.us-west-1.amazonaws.com/autonoma/teacher-icon-png-11.jpg'
    })

    return(
        <>
        { props.dataSede ? 
        //@ts-ignore
        <MapContainer center={[props.dataSede.ubicacion.features[0].geometry.coordinates[1], props.dataSede.ubicacion.features[0].geometry.coordinates[0]]} zoom={20} style={{height: '100%', width: '100%'}}>
            <TileLayer 
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">Open StreetMap</a> contributors' />
            <GeoJSON data={props.dataSede.m2} style={{color: 'red'}}/>
            {
                sSala ?
                sSala.map( (s: sala, i: number) => (
                    //@ts-ignore
                    <Marker key={i+1} position={s.ubicacion.features[0].geometry.coordinates[1], s.ubicacion.features[0].geometry.coordinates[0]} icon={miIcono}>
                        <Popup closeButton>
                            {`Sala: ${s.numero}`}
                        </Popup>
                    </Marker>
                ) )
                : null
            }
        </MapContainer> 
        : null}
        </>
    )
}