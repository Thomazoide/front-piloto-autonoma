import { ingreso } from "@/types/ingreso";
import { sala } from "@/types/sala";
import { sede } from "@/types/sede";
import { ScrollShadow } from "@nextui-org/react";
import moment from "moment";
import { ReactElement } from "react";
import { worker_ingreso } from "./utils/function_lib";

interface FIWProps{
    entity: worker_ingreso
    salas: sala[]
    sedes: sede[]
}

export default function FilterIngresosWorker(props: Readonly<FIWProps>): ReactElement{
    const ingresosFiltrados = props.entity.ingresos

    const findSala = function(i: ingreso): sala{
        const salaTemp: sala = props.salas.filter( (s) => s.id_gateway === i.id_gateway )[0]
        return salaTemp
    }


    const findSede = function(i: ingreso): sede{
        const sedeTemp: sede = props.sedes.filter( (s) => s.id === findSala(i).id_sede )[0]
        return sedeTemp
    }

    return(
        <div className="flex flex-col gap-2 items-center w-full h-fit">
            <div className="flex flex-col gap-1 max-h-[200px] w-full ">
                <ScrollShadow className="w-full max-h-[200px] p-[10px] ">
                    {
                    ingresosFiltrados[0] ?
                        ingresosFiltrados.map( (i) => (
                            <p key={i.id} className="bg-red-300 rounded-xl p-[5px] shadow-md " >
                                Fecha: {moment(i.hora).utc().format("DD-MM-YYYY")}
                                <br/>
                                Hora: {moment(i.hora).utc().format("HH:mm:ss")}
                                <br/>
                                Sede: { findSede(i).nombre }
                                <br/>
                                Sala: { findSala(i).numero }
                            </p>
                        ) )
                    : <p>
                        <small>
                            No se encontraron coincidencias...
                        </small>
                    </p>
                    }
                </ScrollShadow>
            </div>
        </div>
    )
}