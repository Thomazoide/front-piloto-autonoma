import { ReactElement } from "react"
import { MapContainer, GeoJSON, TileLayer, Marker, Popup } from "react-leaflet"
import 'leaflet/dist/leaflet.css'
import { sede } from "@/types/sede"
import { sala } from "@/types/sala"
import { useQuery } from "@tanstack/react-query"
import L from 'leaflet'
import axios, { AxiosResponse } from "axios"
import { ingreso } from "@/types/ingreso"
import { worker } from "@/types/worker"
import { getLocalTimeZone, today } from "@internationalized/date"
import { sortIngresosByHoras } from "./utils/function_lib"

interface PropsMapa {
    dataSede: sede,
    tipo: 'guardias' | 'docentes'
}

interface worker_ingreso {
    trabajador: worker
    ultimo_ingreso: ingreso
}

export default function MapaMultiple(props: Readonly<PropsMapa>): ReactElement {
    const querySalas = useQuery({
        queryKey: ['salas'],
        queryFn: async function(): Promise<sala[]>{
            if(!props.dataSede){
                return []
            }
            const response: sala[] = (await axios.get(`${import.meta.env.VITE_API_URL}/sala/sede/${props.dataSede.id}`)).data
            return response
        }
    })

    const queryGuardias = useQuery({
        queryKey: ['guardias'],
        queryFn: async function(): Promise<worker[]>{
            const response: worker[] = (await axios.get(`${import.meta.env.VITE_API_URL}/guardia`)).data
            return response
        }
    })

    const queryIngresos = useQuery({
        queryKey: ['ingresos'],
        queryFn: async function(): Promise<worker_ingreso[]>{
            if(!queryGuardias.data){
                return []
            }
            const workerAndIngreso: worker_ingreso[] = []
            queryGuardias.data.map( (g: worker) => {
                axios.get(`${import.meta.env.VITE_API_URL}/ingreso/guardia/last/${g.id}`).then( (res: AxiosResponse) => {
                    const result: ingreso = res.data
                    
                    const nuevaData: worker_ingreso = {
                        trabajador: g,
                        ultimo_ingreso: result
                    }
                    workerAndIngreso.push(nuevaData)
                } )
            } )
            return workerAndIngreso
        },
        refetchInterval: 1000
    })

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
                querySalas.data && queryIngresos.data ?
                querySalas.data.map( (s: sala) => {
                    //@ts-ignore
                    const ubicacion: any = [s.ubicacion.features[0].geometry.coordinates[1], s.ubicacion.features[0].geometry.coordinates[0]]
                    const fechaActual: Date = new Date()
                    const horaInicial: number[] = [fechaActual.getHours(), fechaActual.getMinutes()]
                    const horaFinal: number[] = [fechaActual.getHours()-1, fechaActual.getMinutes()]
                    const ingresos: ingreso[] = queryIngresos.data.map((wi: worker_ingreso) => wi.ultimo_ingreso)
                    const ingresosOrdenados: ingreso[] = sortIngresosByHoras(ingresos, horaInicial, horaFinal)
                    console.log(ingresosOrdenados)
                    return !ubicacion  ? null : (
                        <Marker key={s.id} position={ubicacion} icon={props.tipo === "guardias" ? iconoGuardia : iconoDocente}>
                            <Popup closeButton>
                                {`Sala ${s.numero}`}
                            </Popup>
                        </Marker>
                    )
                } )
                : null
            }
        </MapContainer> 
        : null}
        </>
    )
}