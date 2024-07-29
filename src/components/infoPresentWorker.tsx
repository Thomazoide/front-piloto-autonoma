import { ingreso } from "@/types/ingreso";
import { worker } from "@/types/worker";
import { ReactElement } from "react";

interface worker_ingreso {
    trabajador: worker
    ultimo_ingreso: ingreso
    estuvo: boolean 
}

interface IPWProps {
    workers: worker_ingreso[]
    tipo: "guardias" | "docentes"
}

export default function InfoPresentWorkers(props: Readonly<IPWProps>): ReactElement{
    console.log(props.workers)
    return(
        <div className="content-center items-center align-center flex flex-col p-[5px] w-[200px] h-[100px] overflow-y-scroll ">
            <h5> {props.tipo[0].toUpperCase()}{props.tipo.slice(1)} </h5>
            {
                props.workers.map( (wi: worker_ingreso, index: number) => (
                    <div key={index+1} className="flex max-h-[25px] text-start justify-center ">
                        <p>
                            {index+1}: {wi.trabajador.nombre}
                            <br/>
                            Ultimo ingreso: <br/>
                            Fecha: {new Date(wi.ultimo_ingreso.hora).getDate()}/{new Date(wi.ultimo_ingreso.hora).getMonth()}/{new Date(wi.ultimo_ingreso.hora).getFullYear()} <br/>
                            Hora: {new Date(wi.ultimo_ingreso.hora).getHours()+4 < 10 ? `0${new Date(wi.ultimo_ingreso.hora).getHours()+4}` : new Date(wi.ultimo_ingreso.hora).getHours()+4}:{new Date(wi.ultimo_ingreso.hora).getMinutes() < 10 ? `0${new Date(wi.ultimo_ingreso.hora).getMinutes()}` : new Date(wi.ultimo_ingreso.hora).getMinutes()}
                        </p>
                    </div>
                ) )
            }
        </div>
    )
}