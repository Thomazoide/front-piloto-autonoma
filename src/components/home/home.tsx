import { worker } from "@/types/worker";
import { Switch } from "@nextui-org/switch";
import { useState, useEffect, ReactElement } from "react";
import Dashboard from "../charts/dashboardCharts";
import { GetActiveRooms, GetActiveWorkers, GetAllDocentes } from "../utils/function_lib";
import { useAuthContext } from "@/hooks/useLoginContext";
import { ChartMultiple16Regular } from "@fluentui/react-icons";
import HomeMap from "./map";

export default function HomeComponent(): ReactElement {
    const [docentes, setDocentes] = useState<worker[]>()
    const [docentesActivos, setDocentesActivos] = useState<number>()
    const [salasActivas, setSalasActivas] = useState<number>()
    const [seeCharts, setSeeCharts] = useState<boolean>(false)
    const { state } = useAuthContext()

    const classNames1: string = "flex flex-col items-center max-h-[75px gap-1 rounded-xl p-[15px] border-2 border-solid border-danger-300 text-center "

    function fetchData(){
        GetActiveRooms( state.user!.token )
            .then( (value) => setSalasActivas(value) )
        GetAllDocentes( state.user!.token )
            .then( (workers) => setDocentes(workers) )
        GetActiveWorkers("docente", state.user!.token)
            .then( ( workers ) => setDocentesActivos( workers.length ))
    }

    useEffect( () => {
        !docentes && fetchData()
        const refetchInterval = setInterval( fetchData, 15000 )
        return () => clearInterval(refetchInterval)
    }, [] )

    return (
        <div className="flex flex-col w-full items-center gap-3 p-[15px] ">
            <div className="flex flex-row justify-center gap-5 ">
                <div className={classNames1}>
                    <p>
                        Docentes activos
                        <br/>
                        {docentesActivos} de {docentes?.length}
                    </p>
                </div>
                <div className={classNames1}>
                    <p>
                        Salas activas
                        <br/>
                        {salasActivas}
                    </p>
                </div>
                <div className={classNames1}>
                    <p>
                        Ver estadísticas
                    </p>
                    <Switch color="danger" thumbIcon={
                        <ChartMultiple16Regular/>
                    } isSelected={seeCharts} onValueChange={setSeeCharts}/>
                </div>
            </div>
            {
                !seeCharts && docentes ?
                <HomeMap token={state.user!.token} workers={docentes!} />
                : <Dashboard/>
            }
        </div>
    )
}