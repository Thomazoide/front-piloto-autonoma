import { useAuthContext } from '@/hooks/useLoginContext'
import { ingreso } from '@/types/ingreso'
import { sala } from '@/types/sala'
import { sede } from '@/types/sede'
import { useEffect, useState, ReactElement } from 'react'
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { Spinner } from '@nextui-org/react'
import "@/styles/charts.css"
import DataChart from './dataChart'

export default function Dashboard(): ReactElement{
    const {state} = useAuthContext()
    const [sedes, setSedes] = useState<sede[]>()
    const [salas, setSalas] = useState<sala[]>()
    const [selectedSede, setSelectedSede] = useState<string>()
    const [ingresos, setIngresos] = useState<ingreso[]>()
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const CONFIG: AxiosRequestConfig = {
        headers: {
            Authorization: `Bearer ${state.user?.token}`
        }
    }
    const SEDES_ENDPOINT: string = `${import.meta.env.VITE_API_URL}/sedes`
    const SALAS_ENDPOINT: string = `${import.meta.env.VITE_API_URL}/sala`
    const INGRESOS_ENDPOINT: string = `${import.meta.env.VITE_API_URL}/ingreso`

    const fetchSedesAndSalas = async function(){
        try{
            if(!sedes || !salas){
                setIsLoading(true)
            }
            const sedesResponse: AxiosResponse<sede[]> = await axios.get(SEDES_ENDPOINT, CONFIG)
            const salasResponse: AxiosResponse<sala[]> = await axios.get(SALAS_ENDPOINT, CONFIG)
            setSedes(sedesResponse.data)
            setSalas(salasResponse.data)
            setSelectedSede(JSON.stringify(sedesResponse.data[0]))
        }catch(err: any){
            console.log(err)
        }finally{
            setIsLoading(false)
        }
    }

    const fetchIngresos = async function(){
        try{
            if(sedes){
                const response: AxiosResponse<ingreso[]> = await axios.get(INGRESOS_ENDPOINT, CONFIG)
                setIngresos(response.data)
            }
        }catch(err: any){
            console.log(err)
        }
    }

    useEffect( () => {
        if(!sedes || !salas){
            fetchSedesAndSalas()
        }
        if(sedes && salas && !ingresos){
            fetchIngresos()
        }
    }, [sedes, salas, ingresos] )

    return(
        <div className="flex flex-col items-center gap-2  ">
            {
                !isLoading ?
                <div className="flex flex-wrap w-full h-full justify-evenly gap-3 items-center ">
                    { sedes && state.user && selectedSede && 
                    <>
                        {
                            sedes.map( (sede) => (
                                <div key={sede.id} className="flex flex-col items-center gap-3  w-[380px] min-h-[450px] p-[15px] bg-default-200 rounded-xl shadow-xl shadow-danger-300 border-double border-3 border-red-500">
                                    <h3>{sede.nombre}</h3>
                                    {state.user && <DataChart sede={sede} token={state.user.token}/>}
                                </div>
                            ) )
                        }
                    </>
                    }
                </div>
                : isLoading && <Spinner color="danger"/>
            }
        </div>
    )
}