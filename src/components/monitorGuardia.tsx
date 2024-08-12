import { ingreso } from "@/types/ingreso";
import { worker } from "@/types/worker";
import { Button, DatePicker, DateValue, Input, ScrollShadow, Spinner, TimeInput, TimeInputValue } from "@nextui-org/react";
import axios, { AxiosResponse } from "axios";
import { ReactElement, useState, useEffect, MouseEvent } from "react";
import { getIngresoByDate, timeOut, sortIngresosByHoras, obtenerHoradeFecha, getSalasByIngresos, getSedesBySalas, getSedeNameBySala } from "./utils/function_lib";
import { sala } from "@/types/sala";
import { sede } from "@/types/sede";
import Mapa from "./mapa";
import { ArrowCounterclockwise32Regular, CatchUp24Regular, EditPerson24Regular, ErrorCircle24Regular, Filter32Regular, PeopleSearch20Regular } from "@fluentui/react-icons";
import { Divider } from "@fluentui/react-components";
import { parseAbsoluteToLocal, parseDate } from "@internationalized/date";
import AddWorker from "./addWorker";
import { useAuthContext } from "@/hooks/useLoginContext";
import EditWorker from "./editWorker";

export default function MonitorGuardias(): ReactElement{
    const [fechaExacta, setFechaExacta] = useState<DateValue>(parseDate(new Date().toISOString().slice(0,10)))
    const [filter, setFilter] = useState<string>()
    const [guardias, setGuardias] = useState<worker[]>()
    const [filteredGuards, setFilteredGuards] = useState<worker[]>()
    const [selectedGuardia, setSelectedGuardia] = useState<worker>()
    const [ingresos, setIngresos] = useState<ingreso[]>()
    const [ingresosFiltrados, setIngresosFiltrados] = useState<ingreso[]>()
    const [salas, setSalas] = useState<sala[]>()
    const [sedes, setSedes] = useState<sede[]>()
    const [selectedSede, setSelectedSede] = useState<sede>()
    const [selectedSala, setSelectedSala] = useState<sala>()
    const [ultimoIngreso, setUltimoIngreso] = useState<ingreso>()
    const [verGuardiaForm, setVerGuardiaForm] = useState<boolean>(false)
    const [workerLoading, setWorkerLoading] = useState<boolean>(false)
    const [verFiltros, setVerFiltros] = useState<boolean>(false)
    const [refreshMap, setRefreshMap] = useState<boolean>(false)
    const [loadingFilters, setLoadingFilters] = useState<boolean>(false)
    const [editarGuardia, setEditarGuardia] = useState<boolean>(false)
    const [horaInicial, setHoraInicial] = useState<TimeInputValue>(parseAbsoluteToLocal(new Date().toISOString()))
    const [horaFinal, setHoraFinal] = useState<TimeInputValue>(parseAbsoluteToLocal(new Date().toISOString()).add({hours: 1}))
    const {state} = useAuthContext()

    const handleGuardSelect = async (e: MouseEvent<HTMLButtonElement>): Promise<void> => {
        setWorkerLoading(true)
        const guardia: worker = JSON.parse(e.currentTarget.value)
        localStorage.setItem("id_worker", String(guardia.id))
        const ingresosGuardia: ingreso[] = (await axios.post(`${import.meta.env.VITE_API_URL}/ingreso/guardia`, guardia, {
            headers: {
                Authorization: `Bearer ${state.user?.token}`
            },
        })).data
        const ultimoIngresoR: ingreso = (await axios.post(`${import.meta.env.VITE_API_URL}/ingreso/guardia/last`, guardia ,{
            headers: {
                Authorization: `Bearer ${state.user?.token}`
            }
        })).data
        const salaIngreso: sala = ultimoIngresoR ? (await axios.post(`${import.meta.env.VITE_API_URL}/sala/gateway`, {
            id: ultimoIngresoR.id_gateway
        }, {
            headers: {
                Authorization: `Bearer ${state.user?.token}`
            }
        })).data : undefined
        const sedeIngreso: sede = salaIngreso ? (await axios.post(`${import.meta.env.VITE_API_URL}/sedes/findOne`, {
            id: salaIngreso.id_sede
        }, {
            headers: {
                Authorization: `Bearer ${state.user?.token}`
            }
        })).data : undefined
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
        const ingresosGuardia: ingreso[] = (await axios.post(`${import.meta.env.VITE_API_URL}/ingreso/guardia`,{
            id: id_worker
        } ,{
            headers: {
                Authorization: `Bearer ${state.user?.token}`
            }
        })).data
        const ultimoIngresoR: ingreso = (await axios.post(`${import.meta.env.VITE_API_URL}/ingreso/guardia/last`,selectedGuardia ,{
            headers: {
                Authorization: `Bearer ${state.user?.token}`
            }
        })).data
        const salaIngreso: sala = ultimoIngresoR ? (await axios.post(`${import.meta.env.VITE_API_URL}/sala/gateway`,{
            id: ultimoIngresoR.id_gateway
        } ,{
            headers: {
                Authorization: `Bearer ${state.user?.token}`
            }
        })).data : undefined
        const sedeIngreso: sede = salaIngreso ? (await axios.post(`${import.meta.env.VITE_API_URL}/sedes/findOne`,{
            id: salaIngreso.id_sede
        } ,{
            headers: {
                Authorization: `Bearer ${state.user?.token}`
            }
        })).data : undefined
        console.log(ultimoIngreso)
        setIngresos(ingresosGuardia)
        setSelectedSala(salaIngreso)
        setSelectedSede(sedeIngreso)
        setUltimoIngreso(ultimoIngresoR)
        timeOut( () => {
            setRefreshMap(false)
        }, 300 )
    }

    const handleGuardFilter = (e: string) => {
        setFilter(e)
        console.log(e)
        setFilteredGuards( guardias?.filter( (w) => ( w.nombre.toLowerCase().includes(e) || w.rut.includes(e) || w.email.toLowerCase().includes(e))))
    }

    const handleFilterState = () => {
        setVerFiltros(!verFiltros)
        setWorkerLoading(true)
        timeOut( () => setWorkerLoading(false), 100 )
    }

    const handleFilters = async () => {
        setLoadingFilters(true)
        const ingresosEnFecha: ingreso[] = ingresos ? getIngresoByDate(ingresos, new Date(fechaExacta.toString())) : []
        const ingresosEnHoras: ingreso[] = sortIngresosByHoras(ingresosEnFecha, [horaInicial.hour, horaInicial.minute], [horaFinal.hour, horaFinal.minute])
        const salasDeIngreso: sala[] = state.user ? await getSalasByIngresos(ingresosEnHoras, state.user.token) : []
        const sedesDeIngreso: sede[] = state.user ? await getSedesBySalas(salasDeIngreso, state.user.token) : []
        setIngresosFiltrados(ingresosEnHoras)
        setSalas(salasDeIngreso)
        setSedes(sedesDeIngreso)
        timeOut( () => setLoadingFilters(false), 300 )
    }

    useEffect( () => {
        
        if(!guardias){
            state.user ? axios.get(`${import.meta.env.VITE_API_URL}/guardia`, {
                headers: {
                    Authorization: `Bearer ${state.user?.token}`
                }
            }).then( (res: AxiosResponse<worker[]>) => {
                setGuardias(res.data)
                setFilteredGuards(res.data)
            } )
            : null
        }
        if(!verFiltros){
            const idIntervalo: NodeJS.Timeout = setInterval(() => {
                if(guardias && selectedGuardia){
                    handleRefetch()
                    console.log('REFETCH')
                } 
            }, 10000)
            return () => clearInterval(idIntervalo)
        }
    }, [selectedGuardia, filter] )

    

    return(
        <div className="flex justify-center flex-wrap gap-4">
            <div className="items-center flex flex-col shadow-lg border-double border-2 border-red-300 rounded-lg p-[15px] max-h-[200px] lg:max-h-[700px]">
                <h5>Guardias</h5>
                {guardias && filteredGuards ? <ScrollShadow className=" max-w-[370px] h-full" style={{overflowY: "scroll"}}>
                    <Input isClearable onClear={ () => setFilteredGuards(guardias) } type="text" color="danger" variant="bordered" size="sm" label="Buscar" startContent={ <PeopleSearch20Regular/> } placeholder="nombre | rut | email" onValueChange={ handleGuardFilter }  />
                    <Divider className=" my-[10px] " />
                    { filteredGuards[0] ?
                        filteredGuards.map( (g: worker) => (
                            <div key={g.id}>
                                <Button className="m-[5px] " color="danger" variant="bordered" value={JSON.stringify(g)} onClick={handleGuardSelect}>
                                    {g.nombre} | {g.rut}
                                </Button>
                            </div>
                        ) )
                    : <div>
                        <p>
                            <strong>
                                <ErrorCircle24Regular/> No hay datos que coincidan con la busqueda...
                            </strong>
                        </p>
                    </div> }
                </ScrollShadow> : null}
                
            </div>
            {
                selectedGuardia && ingresos && ingresos[0] && selectedSede && selectedSede && !workerLoading && ultimoIngreso && selectedSala ?
                <div className="items-center flex flex-col shadow-lg p-[15px] border-double border-2 border-red-300 rounded-lg">
                    <div className="flex w-[100%] justify-around">
                        <div className="w-fit h-fit ">
                            <Button color="danger" variant="flat" isIconOnly onClick={handleFilterState}>
                                <Filter32Regular />
                            </Button>
                        </div>
                        <div className="w-fit h-fit">
                            <Button color="danger" variant="flat" isIconOnly onClick={ () => setEditarGuardia(!editarGuardia) }>
                                <EditPerson24Regular/>
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
                            <hr className="p-[5px]"/>
                            <div>
                                <DatePicker color="danger" label="Seleccionar fecha" value={fechaExacta} onChange={setFechaExacta}/>
                            </div>
                            <div className="mt-[10px] flex flex-row align-center items-center justify-center gap-2" >
                                <TimeInput color="danger" label="Hora inicial" value={horaInicial} onChange={setHoraInicial}/>
                                <span>
                                    <CatchUp24Regular/>
                                </span>
                                <TimeInput color="danger" label="Hora final" value={horaFinal} onChange={setHoraFinal}/>
                            </div>
                            <hr className="p-[5px]"/>
                            <div className="flex justify-center align-center items-center">
                                <Button color="danger" variant="bordered" onClick={handleFilters}>
                                    Filtrar
                                </Button>
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
                    </div> : verFiltros && ingresosFiltrados && !loadingFilters && salas && salas[0] && sedes && sedes[0] ? <div>
                        <h5>ingresos filtrados:</h5>
                        <ScrollShadow className="w-[100%] h-[250px] overflow-y-scroll">
                            {
                                ingresosFiltrados.map( (i: ingreso, index: number) => (
                                    <div key={i.id} className="p-[10px]">
                                        <p>
                                            Fecha: {`${new Date(i.hora).getDate()}/${new Date(i.hora).getMonth()}/${new Date(i.hora).getFullYear()}`}
                                            <br/>
                                            Hora: {obtenerHoradeFecha(new Date(i.hora))}
                                            <br/>
                                            Sede: {getSedeNameBySala(sedes, salas.find( (s: sala) => s.id_gateway === i.id_gateway ))}
                                            <br/>
                                            Sala: {salas.find( (s: sala) => s.id_gateway === i.id_gateway )?.numero}
                                        </p>
                                        { index < ingresosFiltrados.length ? <hr/> : null }
                                    </div>
                                ) )
                            }
                        </ScrollShadow> 
                    </div> : loadingFilters ? <Spinner color="danger" size="sm"/> : salas && !salas[0] && sedes && !sedes[0] ? <div>
                        <p><ErrorCircle24Regular/> No existen datos para los filtros solicitados...</p>
                    </div> : !verFiltros && editarGuardia && state.user ?
                    <EditWorker token={state.user.token} entity={selectedGuardia} tipo="guardia" />
                    : null
                    }
                    <div className="flex justify-center min-w-[300px] min-h-[300px] border-double border-2 border-red-300 rounded-lg p-[5px] ">
                        {!refreshMap ? <Mapa dataSede={selectedSede} sala={selectedSala} tipo="guardia" /> : <Spinner color="danger" size="lg"/>}
                    </div>
                    
                </div>
                : selectedGuardia && ingresos && !ingresos[0] && !workerLoading ?
                <div className="items-center flex flex-col justify-center min-w-[300px] min-h-[300px] border-solid border-2 border-red-300 rounded-lg p-[15px] ">
                    <div className="flex flex-col items-center justify-center" >
                        <Button color="danger" variant="flat" isIconOnly onClick={ () => setEditarGuardia(!editarGuardia) } >
                            <EditPerson24Regular/>
                        </Button>
                        {
                            editarGuardia && state.user ?
                            <EditWorker token={state.user.token} entity={selectedGuardia} tipo='guardia'/>
                            : null
                        }
                        <Divider className="my-[15px] "/>
                        <div className="flex flex-col gap-2 items-center p-[15px] text-start">
                            <p className="">
                                Nombre: {selectedGuardia.nombre}
                                <br/>
                                Rut: {selectedGuardia.rut}
                                <br/>
                                Email: {selectedGuardia.email}
                                <br/>
                                Celular: {selectedGuardia.celular}
                                <br/>
                            </p>
                        </div> 
                    </div>
                    <h4>
                        Sin ingresos registrados...
                    </h4>
                </div>
                : workerLoading ?
                <Spinner color="danger" size="sm" />
                : null

            }
            <div className=" flex item-center flex-col gap-2 " >
                <Button variant="solid" color="danger" size="sm" onClick={ () => setVerGuardiaForm(!verGuardiaForm) } >Agregar guardia</Button>
                { verGuardiaForm && state.user ?
                <>
                    <AddWorker tipo="guardia" token={state.user.token}/>
                </>
                : null
                }
            </div>
        </div>
    )
}