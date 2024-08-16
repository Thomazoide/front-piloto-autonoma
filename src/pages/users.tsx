import ManageUsers from "@/components/manageUsers";
import DefaultLayout from "@/layouts/default";
import { ReactElement } from "react";


export default function Users(): ReactElement{
    return(
        <DefaultLayout llave="5">
            <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
                <ManageUsers/>
            </section>
        </DefaultLayout>
    )
}