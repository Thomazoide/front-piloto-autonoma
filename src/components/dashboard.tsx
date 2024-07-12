import { ChangeEvent, MouseEvent, ReactElement, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { sede } from "@/types/sede";
import axios, { AxiosResponse } from "axios";
import { Button, Select, SelectItem, Spinner } from "@nextui-org/react";
import { ErrorCircle24Regular } from "@fluentui/react-icons";
import { sala } from "@/types/sala";
import { Divider } from "@fluentui/react-components";
import { timeOut } from "./utils/function_lib";
import MapaMultiple from "./mapaMultiple";

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
    //atributos
    const [selectedSede, setSelectedSede] = useState<sede>()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [mapLoading, setMapLoading] = useState<boolean>(false)
    const [salas, setSalas] = useState<sala[]>()
    const [workerType, setWorkerType] = useState<'guardias' | 'docentes'>()
    //metodos
    const handleSedeSelection = (e: ChangeEvent<HTMLSelectElement>): void => {
        setIsLoading(true)
        const selectedValue: sede = e.target.value ? JSON.parse(e.target.value) : undefined
        setSelectedSede(selectedValue)
        if(selectedValue){
            axios.get(`${import.meta.env.VITE_API_URL}/sala/sede/${selectedValue.id}`).then( (res: AxiosResponse) => {
                if(res.status === 200){
                    const resData: sala[] = res.data
                    setSalas(resData)
                }
            } )
            timeOut(() => setIsLoading(false), 300)
        } else {
            setSalas(undefined)
            setWorkerType(undefined)
            timeOut(() => setIsLoading(false), 300)
        }
    }

    const handleWorkerSelection = (e: MouseEvent<HTMLButtonElement> ): void => {
        setMapLoading(true)
        const wt: 'guardias' | 'docentes' | undefined = e.currentTarget.value === 'guardias' || e.currentTarget.value === 'docentes' ? e.currentTarget.value : undefined
        console.log(wt)
        setWorkerType(wt)
        timeOut(() => setMapLoading(false), 600)
    }

    return(
        <div>
            {
                dataSedes.isLoading ?
                <Spinner color="danger" size="lg"/>
                : null
            }
            {
                dataSedes.isError ?
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
                        (selectedSede && salas) && <div><Divider/></div>
                    }
                    {
                        selectedSede && salas ?
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
                !isLoading && workerType !== undefined && selectedSede && salas ?
                <div className="flex shadow-lg h-[500px] lg: w-[1024px] p-[5px] border-3 border-solid border-red-500 rounded-md">
                    { !mapLoading ? 
                    <MapaMultiple dataSede={selectedSede} tipo={workerType}/>
                    : null
                    }
                </div>
                : isLoading ? <div> <Spinner color="danger" size="lg"/> </div> : null
            }
        </div>
    )
}