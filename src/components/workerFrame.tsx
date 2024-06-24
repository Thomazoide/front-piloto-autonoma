import { worker } from "@/types/worker"
import { ReactElement, useEffect, useState } from "react"
import { Button, Divider, RangeCalendar, ScrollShadow, TimeInput, TimeInputValue } from "@nextui-org/react"
import type { DateValue, RangeValue } from "@nextui-org/react"
import {today, getLocalTimeZone, parseAbsoluteToLocal} from "@internationalized/date"
import { CalendarEdit32Regular } from "@fluentui/react-icons"
import { ingreso } from "@/types/ingreso"
import { getGuardiasXsala, sortDates } from "./utils/function_lib"


type WFProps = {
    tipo: string
    workers: worker[]
    ingresos: ingreso[]
}


export default function WorkerFrame(props: Readonly<WFProps>): ReactElement{
    const [fecha, setFecha] = useState<RangeValue<DateValue>>({
        start: today(getLocalTimeZone()),
        end: today(getLocalTimeZone()).add({days: 1})
    })
    const [verDatePicker, setVerDatePicker]= useState<boolean>(false)
    const [sortedIng, setSortedIng] = useState<ingreso[]>(props.ingresos)
    const [sortedGuards, setSortedGuards] = useState<worker[]>(props.workers)
    const [hora, setHora] = useState<TimeInputValue>(parseAbsoluteToLocal((new Date()).toISOString()))
    const [horaFinal, setHoraFinal] = useState<TimeInputValue>(parseAbsoluteToLocal((new Date()).toISOString()))
    

    const ordenarIngresos = () => {
        const inicio = fecha.start.subtract({days: 1})
        const final = fecha.end.add({days: 1})
        const ingresosOrdenados = sortDates(props.ingresos, new Date(`${inicio.year}/${inicio.month}/${inicio.day}`), new Date(`${final.year}/${final.month}/${final.day}`))
        getGuardiasXsala(ingresosOrdenados).then( (guardias: worker[]) => {
            setSortedGuards(guardias)
        } )
        setSortedIng(ingresosOrdenados)
        console.log(sortedIng)
    }

    useEffect( () => {
        ordenarIngresos()
    }, [fecha] )

    return(
        <>
            <div className="flex justify-center">
                <Button isIconOnly variant="bordered" aria-label="Elegir fecha" onClick={() => setVerDatePicker(!verDatePicker)}>
                    <CalendarEdit32Regular/>
                </Button>
            </div>
            {
                verDatePicker ?
                <div className="flex justify-center">
                    <RangeCalendar
                    aria-label="Fecha"
                    value={fecha}
                    onChange={setFecha}/>
                    <Divider orientation="vertical"/>
                    <Divider orientation="vertical"/>
                    <Divider orientation="vertical"/>
                    <div className="flex flex-row justify-center items-center">
                        <TimeInput 
                        label="Elegir hora de inicio"
                        value={hora}
                        onChange={setHora}/>
                        <span>
                            <p>
                                <strong>
                                    -
                                </strong>
                            </p>
                        </span>
                        <TimeInput
                        label="Elegir hora final"
                        value={horaFinal}
                        onChange={setHoraFinal}/>
                    </div>
                </div>
                : null
            }
            <div className="flex flex-column justify-center border-2 border-faded border-gray-200 rounded-lg m-[15px] p-[15px]">
                <div className=" flex justify-center">
                    <p>
                        <strong>
                            Guardias con ingresos registrados en fecha...
                        </strong>
                    </p>
                </div>
                <div className="flex justify-center">
                    <ScrollShadow className="flex flex-column max-h-[400px] min-h-[100px]">
                        {
                            sortedGuards.map( (g: worker) => (
                                <Button className='m-[15px]' key={g.id} color="danger" variant="bordered">
                                    {`${g.nombre} | ${g.rut}`}
                                </Button>
                            ) )
                        }
                    </ScrollShadow>
                </div>
            </div>
        </>
    )
}