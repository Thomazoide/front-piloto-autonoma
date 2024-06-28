import { ingreso } from "@/types/ingreso"
import { ReactElement } from "react"

type propsVI = {
    ingresos: ingreso[]
    tipo: "min" | "max"
}

export default function VerIngresos(props: Readonly<propsVI>): ReactElement{
    if(props.tipo === "min"){
        return(
            <div className="flex flex-column max-w-[150px]">
                {
                    props.ingresos.map( (Ingreso: ingreso, index: number) => (
                        <>
                        {
                            index >= props.ingresos.length - 6 ?
                            <p>
                                <strong> Ingreso nro: {Ingreso.id} </strong><br/>
                                Fecha: {`${new Date(Ingreso.hora).getDay()}/${new Date(Ingreso.hora).getMonth()}/${new Date(Ingreso.hora).getFullYear()}`}<br/>
                                Hora: {`${new Date(Ingreso.hora).getHours()}:${new Date(Ingreso.hora).getMinutes()}`}
                            </p>
                            : null
                        }
                        </>
                    ) )
                }
            </div>
        )
    }
    return(
        <div className="">
            
        </div>
    )
}