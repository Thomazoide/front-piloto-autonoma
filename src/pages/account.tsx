import MyAccount from "@/components/myAccount";
import DefaultLayout from "@/layouts/default";
import { ReactElement } from "react";

export default function Account(): ReactElement{
    return(
        <DefaultLayout llave="5">
            <div className="flex w-full justify-center ">
                <h1 className="text-red-500 sombra-texto heavitas-text p-[15px] underline">Mi cuenta</h1>
            </div>
            <section className="flex justify-center items-center gap-4 my-3">
                <MyAccount/>
            </section>
        </DefaultLayout>
    )
}