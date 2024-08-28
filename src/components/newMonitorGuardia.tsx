import { useAuthContext } from "@/hooks/useLoginContext";
import { sala } from "@/types/sala";
import { sede } from "@/types/sede";
import { worker } from "@/types/worker";
import { ErrorCircle48Regular } from "@fluentui/react-icons";
import axios, { AxiosRequestConfig } from "axios";
import { ReactElement, useEffect, useState } from "react";
import WorkerList from "./workerList";

export default function NewMonitorGuardia(): ReactElement{
    const [guardias, setGuardias] = useState<worker[]>()
    const [selectedGuardia, setSelectedGuardia] = useState<worker>()
    const [sedes, setSedes] = useState<sede[]>()
    const [salas, setSalas] = useState<sala[]>()
    const [error, setError] = useState<Error>()
    const {state} = useAuthContext()

    const CONFIG: AxiosRequestConfig = {
        headers: {
            Authorization: `Bearer ${state.user?.token}`
        }
    }
    const GUARDIAS_ENDPOINT: string = `${import.meta.env.VITE_API_URL}/guardia`
    const SEDES_ENDPOINT: string = `${import.meta.env.VITE_API_URL}/sedes`
    const SALAS_ENDPOINT: string = `${import.meta.env.VITE_API_URL}/sala`

    const fetchGuardias = async function(){
        try{
            const guardiasReq: worker[] = (await axios.get<worker[]>(GUARDIAS_ENDPOINT, CONFIG)).data
            setGuardias(guardiasReq)
        }catch(err: any){
            setError(err)
        }
    }

    const fetchSedes = async function(){
        try{
            const sedesReq: sede[] = (await axios.get<sede[]>(SEDES_ENDPOINT, CONFIG)).data
            setSedes(sedesReq)
        }catch(err: any){
            setError(err)
        }
    }

    const fetchSalas = async function(){
        try {
            const salasReq: sala[] = (await axios.get<sala[]>(SALAS_ENDPOINT, CONFIG)).data
            setSalas(salasReq)
        } catch (err: any) {
            setError(err)
        }
    }

    const handleRefetch = function(){
        fetchGuardias()
            .then( () => {
                console.log("REFETCH!")
                if(selectedGuardia){
                    const guardia: worker | undefined = guardias?.find( (w) => compareIds(w) )
                    if(guardia) setSelectedGuardia(guardia)
                }
            })
    }

    const compareIds = function(w: worker): boolean{
        return w.id === selectedGuardia?.id
    }

    useEffect( () => {
        if(!guardias && !sedes && !salas){
            fetchGuardias()
            fetchSedes()
            fetchSalas()
        }
        const refetchInterval = setInterval( handleRefetch, 5000 )
        return () => clearInterval(refetchInterval)
    }, [] )

    if(error){
        return(
            <div className="flex justify-center w-full">
                <ErrorCircle48Regular/>
                <h1 className="text-yellow-500" >Error al obtener datos</h1>
                <hr/>
                <br/>
                <p>
                    <small className="text-red-300">
                        Se recomienda iniciar sesion nuevamente...
                    </small>
                </p>
            </div>
        )
    }

    return(
        <div className="flex flex-wrap gap-3 w-full justify-center">
            {
                guardias && sedes && salas &&
                <WorkerList workerList={guardias} setSelectedWorker={setSelectedGuardia}/>
            }
        </div>
    )
}