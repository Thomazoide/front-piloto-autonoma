import NewMonitorDocente from "@/components/newMonitorDocente";
import DefaultLayout from "@/layouts/default";
import { ReactElement } from "react";


export default function Docentes(): ReactElement{
    return(
        <DefaultLayout llave="3">
            <div className="flex w-full justify-center ">
                <h1 className="text-red-500 sombra-texto heavitas-text p-[15px] underline">Docentes</h1>
            </div>
            <section className="flex flex-col items-center justify-center gap-4 py-3">
                <NewMonitorDocente/>
            </section>
        </DefaultLayout>
    )
}