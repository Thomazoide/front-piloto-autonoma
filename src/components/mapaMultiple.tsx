import { ReactElement, useEffect, useState } from "react"
import { MapContainer, GeoJSON, TileLayer, Marker, Popup } from "react-leaflet"
import 'leaflet/dist/leaflet.css'
import { sede } from "@/types/sede"
import { sala } from "@/types/sala"
import { useQuery } from "@tanstack/react-query"
import L from 'leaflet'
import axios, { AxiosResponse } from "axios"
import { ingreso } from "@/types/ingreso"
import { worker } from "@/types/worker"
import { estuvoUltimaHora, timeOut } from "./utils/function_lib"

interface PropsMapa {
    dataSede: sede,
    tipo: 'guardias' | 'docentes'
}

interface worker_ingreso {
    trabajador: worker
    ultimo_ingreso: ingreso
    estuvo: boolean 
}

export default function MapaMultiple(props: Readonly<PropsMapa>): ReactElement {
    const [idSalas, setIdSalas] = useState<number[]>([])
    const [salasFiltradas, setSalasFiltradas] = useState<sala[]>([])
    const [autorizarRefetch, setAutorizarRefetch] = useState<boolean>(true)
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
            let idsparamostrar: number[] = []
            queryGuardias.data.map( (g: worker) => {
                axios.get(`${import.meta.env.VITE_API_URL}/ingreso/guardia/last/${g.id}`).then( (res: AxiosResponse) => {
                    const result: ingreso = res.data
                    
                    const nuevaData: worker_ingreso = {
                        trabajador: g,
                        ultimo_ingreso: result,
                        estuvo: result ? estuvoUltimaHora(result) : false
                    }
                    nuevaData.estuvo ? idsparamostrar.push(nuevaData.ultimo_ingreso.id_gateway) : null
                    workerAndIngreso.push(nuevaData)
                } )
            } )
            console.log(idsparamostrar)
            const listaSalasAuxiliar: sala[] | undefined = querySalas.data?.filter( (s: sala) => idsparamostrar.includes(s.id_gateway) )
            setSalasFiltradas(listaSalasAuxiliar ? listaSalasAuxiliar : [])
            console.log(listaSalasAuxiliar)
            setIdSalas(idsparamostrar)
            return workerAndIngreso
        },
        refetchInterval: 100 
    })

    const filtrarSalas = (): sala[] => {
        if(querySalas.data && idSalas){
            const listaSalasAuxiliar: sala[] = querySalas.data.filter( (s: sala) => idSalas.includes(s.id_gateway) )
            console.log(listaSalasAuxiliar)
            return listaSalasAuxiliar
        }
        return []
    }

    useEffect( () => {
        if(!salasFiltradas[0] && idSalas[0]){
            setSalasFiltradas(filtrarSalas())
        }
    }, [idSalas] )



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
        { props.dataSede && querySalas.data && queryIngresos.data && !queryIngresos.isLoading ?
        //@ts-ignore
        <MapContainer center={[props.dataSede.ubicacion.features[0].geometry.coordinates[1], props.dataSede.ubicacion.features[0].geometry.coordinates[0]]} 
        zoom={20} 
        style={{height: '100%', width: '100%'}}>
            <TileLayer 
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">Open StreetMap</a> contributors' />
            <GeoJSON data={props.dataSede.m2} style={{color: 'red'}}/>
            {
                idSalas[0] && salasFiltradas[0] ?
                salasFiltradas.map( (s: sala) => (
                    //@ts-ignore
                    <Marker key={s.id} position={[s.ubicacion.features[0].geometry.coordinates[1], s.ubicacion.features[0].geometry.coordinates[0]]} icon={props.tipo === "guardias" ? iconoGuardia : iconoDocente}>
                        <Popup closeButton></Popup>
                    </Marker>
                ) )
                : null
            }
        </MapContainer> 
        : null}
        </>
    )
}