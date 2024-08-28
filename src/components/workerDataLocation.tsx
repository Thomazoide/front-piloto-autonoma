import { ingreso } from "@/types/ingreso";
import { sala } from "@/types/sala";
import { sede } from "@/types/sede";
import { worker } from "@/types/worker";
import axios, { AxiosRequestConfig } from "axios";
import {useState, useEffect, ReactElement} from "react";

interface WDLProps{
    entity: worker
    sedes: sede[]
    salas: sala[]
    token: string
    tipo: "docente" | "guardia"
}

export default function WorkerDataLocation(props: Readonly<WDLProps>): ReactElement{
    const [ingresos, setIngresos] = useState<ingreso[]>()
    const [ultimoIngreso, setUltimoIngreso] = useState<ingreso>()
    
    const CONFIG: AxiosRequestConfig = {
        headers: {
            Authorization: `Bearer ${props.token}`
        }
    }
    const INGRESOS_ENDPOINT: string = `${import.meta.env.VITE_API_URL}/ingreso/${props.tipo}`
    const LAST_INGRESO_ENDPOINT: string = `${import.meta.env.VITE_API_URL}/ingreso/${props.tipo}/last`

    const fetchIngresos = async function(){
        const ingresosReq: ingreso[] = (await axios.post<ingreso[]>(INGRESOS_ENDPOINT, props.entity, CONFIG)).data
        const lastIngreso: ingreso = (await axios.post<ingreso>(LAST_INGRESO_ENDPOINT, props.entity, CONFIG)).data
        setIngresos(ingresosReq)
        setUltimoIngreso(lastIngreso)
    }

    useEffect( () => {
        if(!ingresos && !ultimoIngreso){
            fetchIngresos()
        }
        const refetchInterval = setInterval( fetchIngresos, 5000 )
        return () => clearInterval(refetchInterval)
    }, [] )

    return(
        <div className="flex flex-col"></div>
    )
}