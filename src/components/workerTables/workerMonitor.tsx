import { ReactElement, useEffect, useState } from "react";
import { useAuthContext } from "@/hooks/useLoginContext";
import GuardiaTable from "./guardiaTable";
import { getAllSalas, GetAllSedes, getWorkersAndAttendances, worker_ingreso } from "../utils/function_lib";
import { Spinner } from "@nextui-org/react";
import { sala } from "@/types/sala";
import { sede } from "@/types/sede";

interface WMProps{
    workerType: "guardia" | "docente"
}

export default function WorkerMonitor(props: Readonly<WMProps>): ReactElement{
    const [workersAndAttendances, setWorkersAndAttendances] = useState<worker_ingreso[]>()
    const [salas, setSalas] = useState<sala[]>()
    const [sedes, setSedes] = useState<sede[]>()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const {state} = useAuthContext()
    async function fetchWorkersAndAttendances(){
        setIsLoading(true)
        setSalas(await getAllSalas(state.user!.token))
        setSedes(await GetAllSedes(state.user!.token))
        setWorkersAndAttendances(await getWorkersAndAttendances(state.user!.token, props.workerType))
        setIsLoading(false)
    }
    useEffect( () => {
        fetchWorkersAndAttendances()
    }, [] )
    return (
        <div className="flex flex-col gap-3 p-[15px] items-center w-fit h-fit bg-default-300 bg-opacity-25 rounded-xl border-double border-2 border-danger-300 shadow-xl shadow-danger-200">
            {!isLoading ? <GuardiaTable listaGuardias={workersAndAttendances!} workerType={props.workerType} salas={salas!} sedes={sedes!} refetch={fetchWorkersAndAttendances} token={state.user!.token} isAdmin={state.user!.data.isAdmin}/> : <Spinner color="danger" label="Cargando datos..." size="lg"/>}
        </div>
    )
}