import MyAccount from "@/components/myAccount";
import DefaultLayout from "@/layouts/default";
import { ReactElement } from "react";

export default function Account(): ReactElement{
    return(
        <DefaultLayout llave="5">
            <section className="flex justify-center items-center gap-4 py-8 md:py-10">
                <MyAccount/>
            </section>
        </DefaultLayout>
    )
}