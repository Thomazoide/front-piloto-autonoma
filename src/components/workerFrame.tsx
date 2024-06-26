import { worker } from "@/types/worker"
import { ReactElement, useEffect, useState, MouseEvent, ChangeEvent } from "react"
import { Button, DateRangePicker, TimeInput, TimeInputValue, Checkbox, Accordion, AccordionItem, Select, SelectItem, DatePicker } from "@nextui-org/react"
import type { DateValue, RangeValue } from "@nextui-org/react"
import {today, getLocalTimeZone, parseAbsoluteToLocal, parseDate} from "@internationalized/date"
import { CalendarEdit32Regular, CatchUp24Regular, Filter16Regular, VideoPerson32Regular } from "@fluentui/react-icons"
import { ingreso } from "@/types/ingreso"
import { getGuardiasXsala, sortDates, getIngresoByWorker, getIngresoByDate} from "./utils/function_lib"


type WFProps = {
    tipo: string
    workers: worker[]
    ingresos: ingreso[]
}


export default function WorkerFrame(props: Readonly<WFProps>): ReactElement{

    //ATRIBUTOS
    const [fecha, setFecha] = useState<RangeValue<DateValue>>({
        start: today(getLocalTimeZone()),
        end: today(getLocalTimeZone()).add({days: 1})
    })
    const [fechaExacta, setFechaExacta] = useState<DateValue>(parseDate(new Date().toISOString().slice(0,10)))
    const [tipoDatePicker, setTipoDatePicker] = useState<"2" | "1">()
    const [sortedIng, setSortedIng] = useState<ingreso[]>(props.ingresos)
    const [sortedGuards, setSortedGuards] = useState<worker[]>(props.workers)
    const [hora, setHora] = useState<TimeInputValue>(parseAbsoluteToLocal((new Date()).toISOString()))
    const [horaFinal, setHoraFinal] = useState<TimeInputValue>(parseAbsoluteToLocal((new Date()).toISOString()).add({hours: 1}))
    const [considerTime, setConsiderTime] = useState<boolean>(false)
    
    //METODOS
    const filtrarIngresos = (): void => {
        if(!considerTime && tipoDatePicker === "2"){
            const inicio = fecha.start.subtract({days: 1})
            const final = fecha.end.add({days: 1})
            const ingresosOrdenados: ingreso[] = sortDates(props.ingresos, new Date(`${inicio.year}/${inicio.month}/${inicio.day}`), new Date(`${final.year}/${final.month}/${final.day}`))
            setSortedIng(ingresosOrdenados)
            getGuardiasXsala(ingresosOrdenados).then( (workers: worker[]) => {
                setSortedGuards(workers)
            } )
        } else if(considerTime && tipoDatePicker === "2"){
            const inicio = fecha.start.subtract({days: 1})
            const final = fecha.end.add({days: 1})
            
        }
    }

    

    const ordenarIngresosPorWorker = (e: MouseEvent<HTMLButtonElement>): void => {
        const idWorker: number = Number(e.currentTarget.value)
        const listaWorker: worker[] = sortedGuards
        const selectedWorker: worker | undefined = listaWorker.find( (w: worker) => w.id === idWorker )
        if(selectedWorker) setSortedIng(getIngresoByWorker(props.ingresos, selectedWorker))
    }

    const handleSelectTipoDate = (e: ChangeEvent<HTMLSelectElement>) => {
        if(e.target.value === "1" || e.target.value === "2") setTipoDatePicker(e.target.value); else setTipoDatePicker(undefined)
    }

    //EFECTOS
    useEffect( () => {
    }, [sortedIng] )

    //RENDERIZADO
    return(
        
        <div className="flex justify-center">
            <Accordion selectionMode="multiple">
                <AccordionItem
                    className="border-2 border-solid border-red-200 rounded-md p-[10px]"
                    key="1"
                    aria-label={props.tipo}
                    startContent={
                        <VideoPerson32Regular/>
                    }
                    title={props.tipo === "guardias" ? "Guardias" : "Docentes"}
                    subtitle={`${props.tipo} con ingresos registrados...`}>
                    <hr className="p-[15px]" />
                    <div className="flex flex-wrap gap-3 justify-center">
                    {
                        sortedGuards.map( (g: worker) => (
                            <Button color="danger" variant="bordered" value={g.id} key={g.id} onClick={ordenarIngresosPorWorker}>
                                {`${g.nombre} | ${g.rut}`}
                            </Button>
                        ) )
                    }
                    </div>
                </AccordionItem>
                <AccordionItem
                    className="border-2 border-solid border-red-200 rounded-md p-[10px]"
                    key="2"
                    aria-label="Filtros por fecha y hora"
                    startContent={
                        <CalendarEdit32Regular/>
                    }
                    title="Filtrar"
                    subtitle="Filtrar ingresos por fecha y hora">
                    <hr className="p-[15px]" />
                    <div className="flex flex-wrap gap-2 justify-evenly">
                        <div className="flex flex-column justify-center align-center items-center">
                            <Select
                                label="Fecha unica o rango"
                                variant="bordered"
                                placeholder="Seleccionar tipo de filtro"
                                className="max-w-xs m-[10px]"
                                onChange={handleSelectTipoDate}>
                                <SelectItem key="1" value={1}>
                                    Por fecha exacta
                                </SelectItem>
                                <SelectItem key="2" value={2}>
                                    Por rango de fechas
                                </SelectItem>
                            </Select>
                            {
                                tipoDatePicker === "1" ?
                                <DatePicker label="Seleccionar fecha" value={fechaExacta} onChange={setFechaExacta}/>
                                : tipoDatePicker === "2" ?
                                <DateRangePicker label="Seleccionar rango de fechas" value={fecha} onChange={setFecha}/>
                                : null
                            }
                        </div>
                        <div className="flex flex-column align-center justify-center items-center">
                            <div className="flex flex-row gap-2 justify-evenly items-center">
                                <TimeInput label="Hora inicial" value={hora} onChange={setHora} />
                                <span>
                                    <CatchUp24Regular/>
                                </span>
                                <TimeInput label="Hora final" value={horaFinal} onChange={setHoraFinal} />
                            </div>
                            <Checkbox color="danger" size="sm" onValueChange={setConsiderTime} >Considerar rango de horas?</Checkbox>
                        </div>
                    </div>
                    <div className="flex justify-center p-15px mt-[10px]">
                        <Button startContent={<Filter16Regular/>} variant="bordered" color="danger">
                            Filtrar ingresos
                        </Button>
                    </div>
                </AccordionItem>
            </Accordion>
        </div>
        
    )
}