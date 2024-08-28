import NewMonitorGuardia from "@/components/newMonitorGuardia";
import DefaultLayout from "@/layouts/default";
import { ReactElement } from "react";


export default function ManageGuardias(): ReactElement{
    

    return(
        <DefaultLayout llave="4">
            <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
                <NewMonitorGuardia/>
            </section>
        </DefaultLayout>
    )
}