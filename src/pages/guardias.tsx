import MonitorGuardias from "@/components/monitorGuardia";
import { useAuthContext } from "@/hooks/useLoginContext";
import DefaultLayout from "@/layouts/default";
import { ReactElement, useEffect } from "react";
import { useNavigate } from "react-router-dom";


export default function ManageGuardias(): ReactElement{
    

    return(
        <DefaultLayout llave="4">
            <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
                <MonitorGuardias/>
            </section>
        </DefaultLayout>
    )
}