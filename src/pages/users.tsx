import ManageUsers from "@/components/manageUsers";
import DefaultLayout from "@/layouts/default";
import { ReactElement } from "react";


export default function Users(): ReactElement{
    return(
        <DefaultLayout llave="5">
            <div className="flex w-full justify-center ">
                <h1 className="text-red-500 sombra-texto heavitas-text p-[15px] rounded-lg border-2 border-solid border-red-500">Gestión de usuarios</h1>
            </div>
            <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
                <ManageUsers/>
            </section>
        </DefaultLayout>
    )
}