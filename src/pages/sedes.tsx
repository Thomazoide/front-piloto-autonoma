import SedeManage from "@/components/sedeManage";
import DefaultLayout from "@/layouts/default";


export default function Sedes(){
    return(
        <DefaultLayout llave="2">
            <div className="flex w-full justify-center ">
                <h1 className="text-red-500 sombra-texto heavitas-text p-[15px] rounded-lg border-2 border-solid border-red-500">Sedes</h1>
            </div>
            <section className="flex flex-col items-center justify-center gap-4 py-3">
                <SedeManage />
            </section>
        </DefaultLayout>
    )
}