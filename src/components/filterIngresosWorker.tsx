import { ingreso } from "@/types/ingreso";
import { sala } from "@/types/sala";
import { sede } from "@/types/sede";
import { worker } from "@/types/worker";
import { Calendar24Regular, CatchUp24Regular } from "@fluentui/react-icons";
import { parseAbsoluteToLocal, parseDate } from "@internationalized/date";
import { Button, DatePicker, DateValue, ScrollShadow, TimeInput, TimeInputValue } from "@nextui-org/react";
import moment from "moment";
import { ReactElement, useState } from "react";

interface FIWProps{
    sedes: sede[]
    salas: sala[]
    ingresos: ingreso[]
    entity: worker
}

export default function FilterIngresosWorker(props: Readonly<FIWProps>): ReactElement{
    const [ingresosFiltrados, setIngresosFiltrados] = useState<ingreso[]>(props.ingresos)
    const [fecha, setFecha] = useState<DateValue>(parseDate(new Date().toISOString().split("T")[0]))
    const [horaInicial, setHoraInicial] = useState<TimeInputValue>(parseAbsoluteToLocal(moment(new Date().toISOString()).subtract({hours: 1}).toDate().toISOString()))
    const [horaFinal, setHoraFinal] = useState<TimeInputValue>(parseAbsoluteToLocal(new Date().toISOString()))

    const findSala = function(i: ingreso): sala{
        const salaTemp: sala = props.salas.filter( (s) => s.id_gateway === i.id_gateway )[0]
        return salaTemp
    }


    const findSede = function(i: ingreso): sede{
        const sedeTemp: sede = props.sedes.filter( (s) => s.id === findSala(i).id_sede )[0]
        return sedeTemp
    }

    const handleFilters = function(){
        
        const ingresosFiltradosTemp: ingreso[] = props.ingresos.filter( (i) => {
            const fechaHoraInicial = moment(`${fecha.toString()}T${horaInicial.toString().split("T")[1].split("-")[0]}Z`).utc()
            const fechaHoraFinal = moment(`${fecha.toString()}T${horaFinal.toString().split("T")[1].split("-")[0]}Z`).utc()
            const fechaMoment = moment(i.hora).utc()
            return fechaMoment.isBetween(fechaHoraInicial, fechaHoraFinal, null, "(]")
        } )
        setIngresosFiltrados(ingresosFiltradosTemp)
    }

    return(
        <div className="flex flex-col gap-2 items-center w-full h-fit">
            <div className="flex flex-col gap-1 w-full h-fit">
                <DatePicker label="fecha" color="danger" selectorIcon={
                    <Calendar24Regular/>
                } value={fecha} onChange={setFecha} size="sm"/>
            </div>
            <div className="flex flex-row gap-1 w-full h-fit align-center items-center justify-evenly">
                <TimeInput label="Hora inicial" value={horaInicial} onChange={setHoraInicial} color="danger" size="sm"/>
                <CatchUp24Regular/>
                <TimeInput label="Hora final" value={horaFinal} onChange={setHoraFinal} color="danger" size="sm"/>
            </div>
            <Button color="danger" size="sm" variant="solid" onClick={handleFilters}>
                Filtrar
            </Button>
            <p>
                <strong>
                    Registros encontrados:
                </strong>
            </p>
            <div className="flex flex-col gap-1 max-h-[200px] w-full overflow-y-scroll">
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