import MonitorDocentes from "@/components/monitorDocente";
import DefaultLayout from "@/layouts/default";
import { ReactElement } from "react";


export default function Docentes(): ReactElement{
    return(
        <DefaultLayout llave="3">
            <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
                <MonitorDocentes/>
            </section>
        </DefaultLayout>
    )
}