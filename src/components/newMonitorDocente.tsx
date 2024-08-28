import { useAuthContext } from "@/hooks/useLoginContext";
import { sala } from "@/types/sala";
import { sede } from "@/types/sede";
import { worker } from "@/types/worker";
import { ErrorCircle48Regular } from "@fluentui/react-icons";
import axios, {AxiosRequestConfig} from "axios";
import { ReactElement, useEffect, useState } from "react";
import { Button, Spinner } from "@nextui-org/react";
import WorkerList from "./workerList";
import WorkerDataLocation from "./workerDataLocation";
import AddWorker from "./addWorker";

export default function NewMonitorDocente(): ReactElement{
    const [docentes, setDocentes] = useState<worker[]>()
    const [selectedDocente, setSelectedDocente] = useState<worker>()
    const [sedes, setSedes] = useState<sede[]>()
    const [salas, setSalas] = useState<sala[]>()
    const [error, setError] = useState<Error>()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [crearDocente, setCrearDocente] = useState<boolean>(false)
    const {state} = useAuthContext()

    const CONFIG: AxiosRequestConfig = {
        headers: {
            Authorization: `Bearer ${state.user?.token}`
        }
    }
    const DOCENTES_ENDPOINT: string = `${import.meta.env.VITE_API_URL}/docente`
    const SEDES_ENDPOINT: string = `${import.meta.env.VITE_API_URL}/sedes`
    const SALAS_ENDPOINT: string = `${import.meta.env.VITE_API_URL}/sala`

    const fetchDocentes = async function(){
        try{
            const docentesReq: worker[] = (await axios.get<worker[]>(DOCENTES_ENDPOINT, CONFIG)).data
            setDocentes(docentesReq)
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
        try{
            const salasReq: sala[] = (await axios.get<sala[]>(SALAS_ENDPOINT, CONFIG)).data
            setSalas(salasReq)
        }catch(err: any){}
    }

    const handleRefetch = function(){
        fetchDocentes()
            .then( () => {
                console.log("REFETCH!")
                if(selectedDocente){
                    const docente: worker | undefined = docentes?.find( (w) => compareIds(w) )
                    if(docente) setSelectedDocente(docente)
                }
            } )
    }

    const compareIds = function(w: worker): boolean{
        return w.id === selectedDocente?.id
    }

    useEffect( () => {
        if(!docentes && !sedes && !salas){
            fetchDocentes()
            fetchSedes()
            fetchSalas()
        }
        const refetchInterval = setInterval( handleRefetch, 5000 )
        return () => clearInterval(refetchInterval)
    }, [] )
    
    if(error){
        return(
            <div className="flex flex-col items-center w-full">
                <ErrorCircle48Regular/>
                <h1 className="text-yellow-500" >Error al obtener datos</h1>
                <hr/>
                <br/>
                <p>
                    <small className="text-red-300">
                        Se recomienda iniciar sesion nuevamente...
                    </small>
                </p>
                <p>
                    <small className="text-italic text-yellow-300">
                        {error.message}
                    </small>
                </p>
            </div>
        )
    }

    return(
        <div className="flex flex-wrap gap-3 w-full justify-center">
            {
                docentes && sedes && salas &&
                <WorkerList workerList={docentes} setSelectedWorker={setSelectedDocente} setIsLoading={setIsLoading}/>
            }
            {
                selectedDocente && sedes && salas && state.user && !isLoading ?
                <WorkerDataLocation key={selectedDocente.id} sedes={sedes} salas={salas} entity={selectedDocente} tipo="docente" token={state.user.token}/>
                : isLoading &&
                <Spinner color="danger"/>
            }
            <div className="flex flex-col gap-3 items-center w-[300px] h-fit">
                <Button color="danger" onClick={
                    () => setCrearDocente(true)
                }>
                    Crear docente
                </Button>
                {
                    crearDocente && state.user &&
                    <AddWorker tipo="docente" token={state.user.token}/>
                }
            </div>
        </div>
    )
}