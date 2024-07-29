import { ChangeEvent, MouseEvent, ReactElement, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { sede } from "@/types/sede";
import axios, { AxiosResponse } from "axios";
import { Accordion, AccordionItem, Button, Select, SelectItem, Spinner } from "@nextui-org/react";
import { ErrorCircle24Regular } from "@fluentui/react-icons";
import { sala } from "@/types/sala";
import { Divider } from "@fluentui/react-components";
import { estuvoUltimaHora, obtenerFechaFormatoI, obtenerHoradeFecha, timeOut } from "./utils/function_lib";
import MapaMultiple from "./mapaMultiple";
import { worker } from "@/types/worker";
import { ingreso } from "@/types/ingreso";
import IconoGuardiaSVG from "./svgComponents/IconoGuardiaSVG";
import IconoDocentes from "./svgComponents/IconoDocentes";
import { useAuthContext } from "@/hooks/useLoginContext";

interface worker_ingreso {
    trabajador: worker
    ultimo_ingreso: ingreso
    estuvo: boolean 
}

export default function DashBoard(): ReactElement{
    //query
    const dataSedes = useQuery({
        queryKey: ['sedes'],
        queryFn: async (): Promise<sede[]> => {
            const response: AxiosResponse = await axios.get(`${import.meta.env.VITE_API_URL}/sedes`, {
                headers: {
                    Authorization: `Bearer ${state.user?.token}`
                }
            })
            const sedes: sede[] = response.data
            return sedes
        }
    })
    const queryIngresos = useQuery({
        queryKey: ['ingresos'],
        queryFn: async (): Promise<worker_ingreso[]> => {
            if(!workerData){
                return []
            }
            let workerAndIngreso: worker_ingreso[] = []
            let salasPresentes: sala[] = []
            workerData.map( (w: worker) => {
                axios.post(`${import.meta.env.VITE_API_URL}/ingreso/${workerType?.slice(0, workerType.length-1)}/last`,{
                    id: w.id
                } ,{
                    headers: {
                        Authorization: `Bearer ${state.user?.token}`
                    }
                })
                .then( async (res: AxiosResponse) => {
                    const result: ingreso = res.data
                    const nuevaData: worker_ingreso = {
                        trabajador: w,
                        ultimo_ingreso: result,
                        estuvo: result ? estuvoUltimaHora(result) : false
                    }
                    
                    const auxSala: sala = (await axios.post(`${import.meta.env.VITE_API_URL}/sala/gateway`, {
                        id: nuevaData.ultimo_ingreso.id_gateway
                    },{
                        headers: {
                            Authorization: `Bearer ${state.user?.token}`
                        }
                    })).data
                    nuevaData.estuvo && (nuevaData.ultimo_ingreso.id_gateway === auxSala.id_gateway) && (selectedSede?.id === auxSala.id_sede) ? workerAndIngreso.push(nuevaData) : null
                    nuevaData.estuvo && selectedSede && (selectedSede.id === auxSala.id_sede) ? salasPresentes.push(auxSala) : null
                } )
            } )
            console.log(workerAndIngreso)
            setSalas(salasPresentes)
            setLista(workerAndIngreso)
            return workerAndIngreso
        },
        enabled: false,
        refetchInterval: 1000
    })
    //atributos
    const [selectedSede, setSelectedSede] = useState<sede>()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [mapLoading, setMapLoading] = useState<boolean>(false)
    const [salas, setSalas] = useState<sala[]>()
    const [workerType, setWorkerType] = useState<'guardias' | 'docentes'>()
    const [workerData, setWorkerData] = useState<worker[]>()
    const [lista, setLista] = useState<worker_ingreso[]>()
    const [isRefetching, setIsRefetching] = useState<boolean>(false)
    const {state} = useAuthContext()
    //metodos
    const handleSedeSelection = (e: ChangeEvent<HTMLSelectElement>): void => {
        setIsLoading(true)
        const selectedValue: sede = e.target.value ? JSON.parse(e.target.value) : undefined
        setSelectedSede(selectedValue)
        setSalas(undefined)
        if(selectedValue){
            handleRefetch()
            timeOut(() => setIsLoading(false), 300)
        } else {
            setSalas(undefined)
            setWorkerType(undefined)
            setWorkerData(undefined)
            timeOut(() => setIsLoading(false), 300)
        }
    }

    const handleWorkerSelection = (e: MouseEvent<HTMLButtonElement> ): void => {
        setMapLoading(true)
        const wt: 'guardias' | 'docentes' | undefined = e.currentTarget.value === 'guardias' || e.currentTarget.value === 'docentes' ? e.currentTarget.value : undefined
        wt === "guardias" ? axios.get(`${import.meta.env.VITE_API_URL}/guardia`, {
            headers: {
                Authorization: `Bearer ${state.user?.token}`
            }
        }).then( (res: AxiosResponse) => setWorkerData(res.data) ).catch( (err) => console.error(err) ) : null
        setWorkerType(wt)
        timeOut(() => setMapLoading(false), 600)
    }

    const handleRefetch = (): void => {
        setIsLoading(true)
        setMapLoading(true)
        setLista(undefined)
        setSalas(undefined)
        queryIngresos.refetch()
        timeOut(() => {
            setIsLoading(false)
            setMapLoading(false)
        }, 800)
    }

    useEffect( () => {
        if(workerData && selectedSede){
            queryIngresos.refetch()
        }
        const intervaloId: NodeJS.Timeout = setInterval( () => {
            if(workerData && selectedSede){
                setIsRefetching(true)
                queryIngresos.refetch()
                timeOut( () => setIsRefetching(false), 800 )
            }
        }, 10000 )
        return () => clearInterval(intervaloId)
    }, [workerData, selectedSede] )

    return(
        <div>
            {
                dataSedes.isLoading || queryIngresos.isLoading ?
                <Spinner color="danger" size="lg"/>
                : null
            }
            {
                dataSedes.isError || queryIngresos.isError ?
                <div className="align-center items-center w-full h-full flex justify-center">
                    <ErrorCircle24Regular/>
                </div>
                : null
            }
            {
                dataSedes.data ? 
                <div className="align-center items-center w-full h-full p-[20px] flex flex-col ">
                    <div className="w-full">
                        <h5>DASHBOARD</h5>
                    </div>
                    <div className="w-fit">
                        <Select className="flex w-[375px]" color="danger" variant="underlined" label="Sede" placeholder="Seleccionar sede" onChange={handleSedeSelection}>
                            {
                                dataSedes.data.map( (s: sede) => (
                                    <SelectItem className="flex justify-center" key={JSON.stringify(s)} value={JSON.stringify(s)}>
                                        {s.nombre}
                                    </SelectItem>
                                )  )
                            }
                        </Select>
                    </div>
                    {
                        (selectedSede) && <div><Divider/></div>
                    }
                    {
                        selectedSede ?
                        <div className="flex flex-row w-full justify-between">
                            <div className="flex m-[15px] ">
                                <Button isDisabled color='danger' variant='flat' value={'docentes'}>
                                    Docentes
                                </Button>
                            </div>
                            <div className="flex m-[15px] ">
                                <Button color='danger' variant="flat" value={'guardias'} onClick={handleWorkerSelection}>
                                    Guardias
                                </Button>
                            </div>
                        </div>
                        : null
                    }
                    
                </div>
                : null
            }
            {
                !isLoading && workerType !== undefined && selectedSede && salas && queryIngresos.data ?
                <>
                    <div className=" p-[20px] ">
                        <Accordion selectionMode="single" isCompact defaultExpandedKeys={"1"}>
                            <AccordionItem key="1" className="shadow-lg border-2 border-solid border-red-200 rounded-md p-[10px] max-h-[400px] overflow-y-scroll "
                            startContent={
                                workerType === "guardias" ?
                                <IconoGuardiaSVG/>
                                : <IconoDocentes/>
                            }
                            title={`${workerType[0].toUpperCase()}${workerType.slice(1)} presentes en la ultima hora`}
                            subtitle={`${new Date().getHours()-1 < 10 ? "0" : ""}${new Date().getHours()-1}:${new Date().getMinutes() < 10 ? "0" : ""}${new Date().getMinutes()} - ${new Date().getHours() < 10 ? "0" : ""}${new Date().getHours()}:${new Date().getMinutes() < 10 ? "0" : ""}${new Date().getMinutes()}`}>
                                <hr className="p-[15px] " />
                                <div className="items-center align-center flex flex-col gap-2 justify-center" >
                                    {
                                        !salas[0] && lista && !lista[0] ?
                                        <>
                                        <ErrorCircle24Regular/>
                                        <h5 className="text-yellow-500">No Hay registros de la ultima hora...</h5>
                                        </>
                                        : salas[0] && lista && lista[0] ? <>
                                        <p><strong className="text-zinc-400">Cantidad de {workerType} detectados la ultima hora: </strong>{lista?.length}</p>
                                        <div className="flex flex-wrap gap-3">
                                        {
                                            lista?.map( (wi: worker_ingreso) => (
                                                <div key={wi.trabajador.id} className="flex flex-col border-solid border-3 border-red-500 rounded-lg p-[5px] max-w-[200px] ">
                                                    <h5>{workerType[0].toUpperCase()}{workerType.slice(1, workerType.length-1)}: {wi.trabajador.nombre}</h5>
                                                    <p>
                                                        <strong className="text-red-500">Sala: </strong>
                                                        {salas.filter( (s: sala) => s.id_gateway === wi.ultimo_ingreso.id_gateway )[0]?.numero}
                                                        <br/>
                                                        <strong className="text-red-500">Fecha: </strong>
                                                        {obtenerFechaFormatoI(new Date(wi.ultimo_ingreso.hora))}
                                                        <br/>
                                                        <strong className="text-red-500">Hora: </strong>
                                                        {obtenerHoradeFecha(new Date(wi.ultimo_ingreso.hora))}
                                                    </p>
                                                </div>
                                            ) )
                                        }
                                        </div>
                                        </>
                                        :
                                        <>
                                        <ErrorCircle24Regular/>
                                        <h5 className="text-yellow-500">No Hay registros de la ultima hora...</h5>
                                        </>
                                    } 
                                </div> 
                            </AccordionItem>
                        </Accordion>
                    </div>
                
                    <div className=" flex justify-center shadow-lg h-[500px] lg:w-[1024px] w-[300px] p-[5px] lg:ml-[0px] ml-[15px] border-3 border-solid border-red-500 rounded-md">
                        
                        { !mapLoading && salas && lista && !isRefetching ? 
                        <MapaMultiple dataSede={selectedSede} tipo={workerType} salas={salas} listaWorkers={lista}/>
                        : isRefetching ? <Spinner color="danger" size="lg" label="Cargando datos nuevos..."/> : null
                        }
                    </div>
                </>
                : isLoading ? <div> <Spinner color="danger" size="lg"/> </div> : null
            }
        </div>
    )
}