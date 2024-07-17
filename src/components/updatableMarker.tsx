import { sala } from "@/types/sala";
import { ReactElement } from "react";
import { Marker, Popup } from "react-leaflet";
import L from 'leaflet'
import { worker } from "@/types/worker";
import { ingreso } from "@/types/ingreso";
import InfoPresentWorkers from "./infoPresentWorker";

interface worker_ingreso {
    trabajador: worker
    ultimo_ingreso: ingreso
    estuvo: boolean 
}

interface UMProps {
    sala: sala
    icono: L.Icon
    workers: worker_ingreso[]
    tipo: "guardias" | "docentes"
}

export default function UpdatableMarker(props: Readonly<UMProps>):ReactElement{
    //@ts-ignore
    const position: any = [props.sala.ubicacion.features[0].geometry.coordinates[1], props.sala.ubicacion.features[0].geometry.coordinates[0]]
    return(
        <Marker key={props.sala.id} position={position} icon={props.icono}>
            <Popup className="min-h-[100px]" closeButton>
                <InfoPresentWorkers tipo={props.tipo} workers={props.workers} />
            </Popup>
        </Marker>
    )
} 