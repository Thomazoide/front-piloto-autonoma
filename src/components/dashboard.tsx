import { ChangeEvent, MouseEvent, ReactElement, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { sede } from "@/types/sede";
import axios, { AxiosResponse } from "axios";
import { Button, Select, SelectItem, Spinner } from "@nextui-org/react";
import { ArrowCounterclockwise24Regular, ErrorCircle24Regular } from "@fluentui/react-icons";
import { sala } from "@/types/sala";
import { Divider } from "@fluentui/react-components";
import { estuvoUltimaHora, timeOut } from "./utils/function_lib";
import MapaMultiple from "./mapaMultiple";
import { worker } from "@/types/worker";
import { ingreso } from "@/types/ingreso";

interface worker_ingreso {
    trabajador: worker
    ultimo_ingreso: ingreso
    estuvo: boolean 
}

async function getSedes(): Promise<sede[] | undefined>{
    const response: AxiosResponse = await axios.get(`${import.meta.env.VITE_API_URL}/sedes`)
    if (response.status === 200){
        const sedes: sede[] = response.data
        return sedes
    }
    else return undefined
}

export default function DashBoard(): ReactElement{
    //query
    const dataSedes = useQuery({
        queryKey: ['sedes'],
        queryFn: getSedes
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
                axios.get(`${import.meta.env.VITE_API_URL}/ingreso/${workerType?.slice(0, workerType.length-1)}/last/${w.id}`)
                .then( async (res: AxiosResponse) => {
                    const result: ingreso = res.data
                    const nuevaData: worker_ingreso = {
                        trabajador: w,
                        ultimo_ingreso: result,
                        estuvo: result ? estuvoUltimaHora(result) : false
                    }
                    
                    const auxSala: sala = (await axios.get(`${import.meta.env.VITE_API_URL}/sala/gateway/${nuevaData.ultimo_ingreso.id_gateway}`)).data
                    nuevaData.estuvo && (nuevaData.ultimo_ingreso.id_gateway === auxSala.id_gateway) ? workerAndIngreso.push(nuevaData) : null
                    nuevaData.estuvo && (selectedSede?.id === auxSala.id_sede) ? salasPresentes.push(auxSala) : null
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
    //metodos
    const handleSedeSelection = (e: ChangeEvent<HTMLSelectElement>): void => {
        setIsLoading(true)
        const selectedValue: sede = e.target.value ? JSON.parse(e.target.value) : undefined
        setSelectedSede(selectedValue)
        setSalas(undefined)
        if(selectedValue){
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
        wt === "guardias" ? axios.get(`${import.meta.env.VITE_API_URL}/guardia`).then( (res: AxiosResponse) => setWorkerData(res.data) ).catch( (err) => console.error(err) ) : null
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
                <div className=" flex flex-col shadow-lg h-[500px] lg:w-[1024px] p-[5px] border-3 border-solid border-red-500 rounded-md">
                    <div className="flex justify-end " >
                        <Button className="shadow-lg" isIconOnly onClick={handleRefetch} color="danger"> <ArrowCounterclockwise24Regular/> </Button>
                    </div>
                    { !mapLoading && salas && lista ? 
                    <MapaMultiple dataSede={selectedSede} tipo={workerType} salas={salas} listaWorkers={lista}/>
                    : null
                    }
                </div>
                : isLoading ? <div> <Spinner color="danger" size="lg"/> </div> : null
            }
        </div>
    )
}