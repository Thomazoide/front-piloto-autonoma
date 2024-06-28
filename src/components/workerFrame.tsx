import { worker } from "@/types/worker"
import { ReactElement, useEffect, useState, MouseEvent, ChangeEvent } from "react"
import { Button, DateRangePicker, TimeInput, TimeInputValue, Checkbox, Accordion, AccordionItem, Select, SelectItem, DatePicker, Spinner } from "@nextui-org/react"
import type { DateValue, RangeValue } from "@nextui-org/react"
import {today, getLocalTimeZone, parseAbsoluteToLocal, parseDate} from "@internationalized/date"
import { CalendarEdit32Regular, CatchUp24Regular, Filter16Regular, VideoPerson32Regular } from "@fluentui/react-icons"
import { ingreso } from "@/types/ingreso"
import { getGuardiasXsala, sortDates, getIngresoByWorker, getIngresoByDate, sortIngresosByHoras, timeOut} from "./utils/function_lib"
import VerIngresos from "./verIngresos"


type WFProps = {
    tipo: string
    workers: worker[]
    ingresos: ingreso[]
}

type ingresosWorker = {
    id: string
    index: number
    mostrar: boolean
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
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isIngresoLoading, setIsIngresoLoading] = useState<boolean>(false)
    const [verIngresos, setVerIngresos] = useState<boolean>(false)
    const [revealIn, setRevealIn] = useState<ingresosWorker[]>([])
    
    //METODOS
    const filtrarIngresos = (): void => {
        if(!considerTime && tipoDatePicker === "2"){
            setIsLoading(true)
            const inicio = fecha.start.subtract({days: 1})
            const final = fecha.end.add({days: 1})
            const ingresosOrdenados: ingreso[] = sortDates(props.ingresos, inicio.toDate(getLocalTimeZone()), final.toDate(getLocalTimeZone()))
            setSortedIng(ingresosOrdenados)
            getGuardiasXsala(ingresosOrdenados).then( (workers: worker[]) => setSortedGuards(workers) )
        } else if(considerTime && tipoDatePicker === "2"){
            setIsLoading(true)
            const inicio = fecha.start.subtract({days: 1})
            const final = fecha.end.add({days: 1})
            const ingresosOrdenadosFecha: ingreso[] = sortDates(props.ingresos, inicio.toDate(getLocalTimeZone()), final.toDate(getLocalTimeZone()))
            const horas: number[][] = [[hora.hour, hora.minute], [horaFinal.hour, horaFinal.minute]]
            const ingresosFinal: ingreso[] = sortIngresosByHoras(ingresosOrdenadosFecha, horas[0], horas[1])
            setSortedIng(ingresosFinal)
            getGuardiasXsala(ingresosFinal).then( (ws: worker[]) => setSortedGuards(ws) )
        } else if(!considerTime && tipoDatePicker === "1"){
            setIsLoading(true)
            const ingresosPorFecha: ingreso[] = getIngresoByDate(props.ingresos, fechaExacta.toDate(getLocalTimeZone()))
            setSortedIng(ingresosPorFecha)
            getGuardiasXsala(ingresosPorFecha).then( (ws: worker[]) => {
                setSortedGuards(ws)
            } )
        } else if(considerTime && tipoDatePicker == "1"){
            setIsLoading(true)
            const ingresosPorFecha: ingreso[] = getIngresoByDate(props.ingresos, fechaExacta.toDate(getLocalTimeZone()))
            const horas: number[][] = [[hora.hour, hora.minute], [horaFinal.hour, horaFinal.minute]]
            const ingresosFinal: ingreso[] = sortIngresosByHoras(ingresosPorFecha, horas[0], horas[1])
            setSortedIng(ingresosFinal)
            getGuardiasXsala(ingresosFinal).then( (ws: worker[]) => setSortedGuards(ws) )
        } else if(considerTime && tipoDatePicker === undefined){
            const horas: number[][] = [[hora.hour, hora.minute], [horaFinal.hour, horaFinal.minute]]
            const ingresosFinal: ingreso[] = sortIngresosByHoras(props.ingresos, horas[0], horas[1])
            setSortedIng(ingresosFinal)
            getGuardiasXsala(ingresosFinal).then( (ws: worker[]) => setSortedGuards(ws) )
        }
    }

    const ordenarIngresosPorWorker = (e: MouseEvent<HTMLButtonElement>): void => {
        setIsIngresoLoading(true)
        setVerIngresos(true)
        const idWorker: number = Number(e.currentTarget.value)
        const listaWorker: worker[] = sortedGuards
        const selectedWorker: worker | undefined = listaWorker.find( (w: worker) => w.id === idWorker )
        if(selectedWorker) setSortedIng(getIngresoByWorker(props.ingresos, selectedWorker))
        const listaMostrar: ingresosWorker[] = revealIn
        
        timeOut(() => {
            setIsIngresoLoading(false)
        }, 1500)
    }

    const handleSelectTipoDate = (e: ChangeEvent<HTMLSelectElement>) => {
        if(e.target.value === "1" || e.target.value === "2") setTipoDatePicker(e.target.value); else setTipoDatePicker(undefined)
    }

    //EFECTOS
    useEffect( () => {
        timeOut(() => {
            setIsLoading(false)
        }, 1000)
        if(props.workers[0]){
            const lista: ingresosWorker[] = []
            props.workers.forEach( (w: worker, indice: number) => {
                const wk: ingresosWorker = {
                    id: String(w.id),
                    index: indice,
                    mostrar: false
                }
                lista.push(wk)
            } )
            setRevealIn(lista)
        }
    }, [sortedIng, props.workers] )

    //RENDERIZADO
    return(
        
        <div className="flex justify-center">
            <Accordion selectionMode="multiple" defaultExpandedKeys={"2"} isCompact>
                <AccordionItem
                    isCompact
                    className="border-2 border-solid border-red-200 rounded-md p-[10px]"
                    key="1"
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
                        <Button startContent={<Filter16Regular/>} variant="bordered" color="danger" onClick={filtrarIngresos} isDisabled={tipoDatePicker ? false : true}>
                            Filtrar ingresos
                        </Button>
                    </div>
                </AccordionItem>
                <AccordionItem
                    isCompact
                    className="border-2 border-solid border-red-200 rounded-md p-[10px]"
                    key="2"
                    aria-label={props.tipo}
                    startContent={
                        <VideoPerson32Regular/>
                    }
                    title={props.tipo === "guardias" ? "Guardias" : "Docentes"}
                    subtitle={`${props.tipo} con ingresos registrados...`}>
                    <hr className="p-[15px]" />
                    { !isLoading ? <div className="flex flex-wrap gap-3 justify-center">
                    { revealIn &&
                        revealIn.map( (w: ingresosWorker) => (
                            <>
                                <Button color="danger" variant="bordered" value={w.id} key={w.id} onClick={ordenarIngresosPorWorker}>
                                    {`${sortedGuards[w.index].nombre} | ${sortedGuards[w.index].rut}`}
                                </Button>
                            </>
                        ) )
                    }
                    </div> : isLoading ? <div className="flex justify-center items-center align-center">
                         <Spinner color="danger" size="lg"/> </div> : null}
                </AccordionItem>
            </Accordion>
        </div>
        
    )
}