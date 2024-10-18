import WorkerMonitor from "@/components/workerTables/workerMonitor";
import DefaultLayout from "@/layouts/default";
import { ReactElement } from "react";


export default function ManageGuardias(): ReactElement{
    

    return(
        <DefaultLayout llave="4">
            <div className="flex w-full justify-center ">
                <h1 className="text-red-500 sombra-texto heavitas-text p-[15px] underline">Guardias</h1>
            </div>
            <section className="flex flex-col items-center justify-center gap-4 py-3">
                <WorkerMonitor workerType="guardia"/>
            </section>
        </DefaultLayout>
    )
}