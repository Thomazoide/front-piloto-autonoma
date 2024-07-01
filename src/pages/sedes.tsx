import SedeManage from "@/components/sedeManage";
import DefaultLayout from "@/layouts/default";


export default function Sedes(){
    return(
        <DefaultLayout llave="2">
            <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
                <SedeManage />
            </section>
        </DefaultLayout>
    )
}