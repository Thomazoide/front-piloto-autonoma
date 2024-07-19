import { ingreso } from "@/types/ingreso";
import { worker } from "@/types/worker";
import { Button, DatePicker, DateRangePicker, DateValue, RangeValue, ScrollShadow, Select, SelectItem, Spinner } from "@nextui-org/react";
import axios, { AxiosResponse } from "axios";
import { ReactElement, useState, useEffect, MouseEvent, ChangeEvent } from "react";
import { timeOut } from "./utils/function_lib";
import { sala } from "@/types/sala";
import { sede } from "@/types/sede";
import Mapa from "./mapa";
import { ArrowCounterclockwise32Regular, Filter32Regular } from "@fluentui/react-icons";
import { Divider } from "@fluentui/react-components";
import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
import AddWorker from "./addWorker";


export default function MonitorGuardias(): ReactElement{
    const [fecha, setFecha] = useState<RangeValue<DateValue>>({
        start: today(getLocalTimeZone()),
        end: today(getLocalTimeZone()).add({days: 1})
    })
    const [fechaExacta, setFechaExacta] = useState<DateValue>(parseDate(new Date().toISOString().slice(0,10)))
    const [guardias, setGuardias] = useState<worker[]>()
    const [selectedGuardia, setSelectedGuardia] = useState<worker>()
    const [ingresos, setIngresos] = useState<ingreso[]>()
    const [selectedSede, setSelectedSede] = useState<sede>()
    const [selectedSala, setSelectedSala] = useState<sala>()
    const [ultimoIngreso, setUltimoIngreso] = useState<ingreso>()
    const [tipoDatePicker, setTipoDatePicker] = useState<"1" | "2">()
    const [workerLoading, setWorkerLoading] = useState<boolean>(false)
    const [verFiltros, setVerFiltros] = useState<boolean>(false)
    const [refreshMap, setRefreshMap] = useState<boolean>(false)

    const handleGuardSelect = async (e: MouseEvent<HTMLButtonElement>): Promise<void> => {
        setWorkerLoading(true)
        const guardia: worker = JSON.parse(e.currentTarget.value)
        localStorage.setItem("id_worker", String(guardia.id))
        const ingresosGuardia: ingreso[] = (await axios.get(`${import.meta.env.VITE_API_URL}/ingreso/guardia/${guardia.id}`)).data
        const ultimoIngresoR: ingreso = (await axios.get(`${import.meta.env.VITE_API_URL}/ingreso/guardia/last/${guardia.id}`)).data
        const salaIngreso: sala = ultimoIngresoR ? (await axios.get(`${import.meta.env.VITE_API_URL}/sala/gateway/${ultimoIngresoR.id_gateway}`)).data : undefined
        const sedeIngreso: sede = salaIngreso ? (await axios.get(`${import.meta.env.VITE_API_URL}/sedes/${salaIngreso.id_sede}`)).data : undefined
        console.log(ultimoIngreso)
        setSelectedGuardia(guardia)
        setIngresos(ingresosGuardia)
        setSelectedSala(salaIngreso)
        setSelectedSede(sedeIngreso)
        setUltimoIngreso(ultimoIngresoR)
        timeOut( () => {
            setWorkerLoading(false)
        }, 300 )
    }

    const handleRefetch = async (): Promise<void> => {
        setRefreshMap(true)
        const id_worker: number = Number(localStorage.getItem("id_worker"))
        const ingresosGuardia: ingreso[] = (await axios.get(`${import.meta.env.VITE_API_URL}/ingreso/guardia/${id_worker}`)).data
        const ultimoIngresoR: ingreso = (await axios.get(`${import.meta.env.VITE_API_URL}/ingreso/guardia/last/${selectedGuardia?.id}`)).data
        const salaIngreso: sala = ultimoIngresoR ? (await axios.get(`${import.meta.env.VITE_API_URL}/sala/gateway/${ultimoIngresoR.id_gateway}`)).data : undefined
        const sedeIngreso: sede = salaIngreso ? (await axios.get(`${import.meta.env.VITE_API_URL}/sedes/${salaIngreso.id_sede}`)).data : undefined
        console.log(ultimoIngreso)
        setIngresos(ingresosGuardia)
        setSelectedSala(salaIngreso)
        setSelectedSede(sedeIngreso)
        setUltimoIngreso(ultimoIngresoR)
        timeOut( () => {
            setRefreshMap(false)
        }, 300 )
    }

    const handleSelectTipoDate = (e: ChangeEvent<HTMLSelectElement>) => {
        if(e.target.value === "1" || e.target.value === "2") setTipoDatePicker(e.target.value); else setTipoDatePicker(undefined)
    }

    useEffect( () => {
        if(!guardias){
            axios.get("http://52.201.181.178:3000/api/guardia").then( (res: AxiosResponse) => setGuardias(res.data) )
        }
        
        const idIntervalo: NodeJS.Timeout = setInterval(() => {
            if(guardias && selectedGuardia){
                handleRefetch()
                console.log('REFETCH')
            }
        }, 10000)
        
        return () => clearInterval(idIntervalo)
    }, [selectedGuardia] )

    return(
        <div className="flex justify-center flex-wrap gap-4">
            <div className="items-center flex flex-col shadow-lg border-double border-3 border-ua-gray rounded-lg p-[15px] max-h-[200px] lg:max-h-[400px]">
                <h5>Guardias</h5>
                {guardias ? <ScrollShadow className=" max-w-[370px] h-[200px] lg:max-h-[400px]" style={{overflowY: "scroll"}}>
                    {
                        guardias.map( (g: worker) => (
                            <div key={g.id}>
                                <Button className="m-[5px] " color="danger" variant="bordered" value={JSON.stringify(g)} onClick={handleGuardSelect}>
                                    {g.nombre} | {g.rut}
                                </Button>
                            </div>
                        ) )
                    }
                </ScrollShadow> : null}
            </div>
            {
                selectedGuardia && ingresos && ingresos[0] && selectedSede && selectedSede && !workerLoading && ultimoIngreso && selectedSala ?
                <div className="items-center flex flex-col shadow-lg p-[15px] border-double border-3 border-ua-gray rounded-lg">
                    <div className="flex w-[100%] justify-around">
                        <div className="w-fit h-fit ">
                            <Button color="danger" variant="flat" isIconOnly onClick={() => setVerFiltros(!verFiltros)}>
                                <Filter32Regular />
                            </Button>
                        </div>
                        <div className="w-fit h-fit ">
                            <Button color="danger" variant="flat" isIconOnly value={JSON.stringify(selectedGuardia)} onClick={handleGuardSelect} >
                                <ArrowCounterclockwise32Regular/>
                            </Button>
                        </div>
                    </div>
                    {
                        verFiltros ?
                        <div>
                            <div>
                                <Select
                                    label="Fecha unica o rango"
                                    color="danger"
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
                            </div>
                            <div>
                                {
                                    tipoDatePicker === "1" ?
                                    <DatePicker color="danger" label="Seleccionar fecha" value={fechaExacta} onChange={setFechaExacta}/>
                                    : tipoDatePicker === "2" ?
                                    <DateRangePicker color="danger" label="Seleccionar rango de fechas" value={fecha} onChange={setFecha}/>
                                    : null
                                }
                            </div>
                        </div>
                        : null
                    }
                    <Divider className="mt-[10px] mb-[10px] "/>
                    <p>
                        <strong className="text-ua-grey">
                            Guardia: {selectedGuardia.nombre}
                        </strong>
                    </p>
                    {!verFiltros ? <div className="flex">
                        <p>
                            <br/>
                            Rut: {selectedGuardia.rut}
                            <br/>
                            <strong>
                                Ultimo ingreso registrado:
                            </strong>
                            <br/>
                            Fecha: {(new Date(ultimoIngreso.hora).getDate() < 10) ? "0" : null}{new Date(ultimoIngreso.hora).getDate()}/{(new Date(ultimoIngreso.hora).getMonth()+1) < 10 ? "0" : null}{new Date(ultimoIngreso.hora).getMonth()+1}/{new Date(ultimoIngreso.hora).getFullYear()}
                            <br/>
                            Hora: {(new Date(ultimoIngreso.hora).getUTCHours() < 10) ? "0" : null}{new Date(ultimoIngreso.hora).getUTCHours()}:{(new Date(ultimoIngreso.hora).getMinutes()) < 10 ? "0" : null}{new Date(ultimoIngreso.hora).getMinutes()}
                            <br/>
                            Sede: {selectedSede.nombre}
                            <br/>
                            Sala: {selectedSala.numero}
                        </p>
                    </div> : null}
                    <div className="flex justify-center min-w-[300px] min-h-[300px] border-double border-2 border-red-300 rounded-lg p-[5px] ">
                        {!refreshMap ? <Mapa dataSede={selectedSede} sala={selectedSala} /> : <Spinner color="danger" size="lg"/>}
                    </div>
                    
                </div>
                : selectedGuardia && ingresos && !ingresos[0] && !workerLoading ?
                <div className="items-center align-center flex justify-center min-w-[300px] min-h-[300px] border-solid border-2 border-red-300 rounded-lg p-[15px] ">
                    <h4>
                        Sin ingresos registrados...
                    </h4>
                </div>
                : workerLoading ?
                <Spinner color="danger" size="sm" />
                : null

            }
            <AddWorker tipo="guardia"/>
        </div>
    )
}