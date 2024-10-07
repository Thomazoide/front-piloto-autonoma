import { useAuthContext } from '@/hooks/useLoginContext'
import { ingreso } from '@/types/ingreso'
import { sala } from '@/types/sala'
import { sede } from '@/types/sede'
import { useEffect, useState, ReactElement } from 'react'
import { BarChart, Bar, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Rectangle, Legend, Tooltip } from 'recharts'
import { MonthAndAttendanceChartData, SortAttendanceData, MONTHS, MONTHS_NAMES } from '@/components/utils/function_lib'
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { Spinner, Dropdown, DropdownMenu, DropdownItem } from '@nextui-org/react'
import "@/styles/charts.css"

export default function Dashboard(): ReactElement{
    const {state} = useAuthContext()
    const [sedes, setSedes] = useState<sede[]>()
    const [salas, setSalas] = useState<sala[]>()
    const [ingresos, setIngresos] = useState<ingreso[]>()
    const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth())
    const [isLoadingSedesAndSalas, setIsLoadingSedesAndSalas] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [ingresosSorted, setIngersosSorted] = useState<MonthAndAttendanceChartData[]>()

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
                setIsLoadingSedesAndSalas(true)
            }
            const sedesResponse: AxiosResponse<sede[]> = await axios.get(SEDES_ENDPOINT, CONFIG)
            const salasResponse: AxiosResponse<sala[]> = await axios.get(SALAS_ENDPOINT, CONFIG)
            setSedes(sedesResponse.data)
            setSalas(salasResponse.data)
        }catch(err: any){
            console.log(err)
        }finally{
            setIsLoadingSedesAndSalas(false)
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

    const resolvePromise = async function(){
        if(sedes && salas && ingresos && state.user){
            setIsLoading(true)
            const attendanceData: MonthAndAttendanceChartData[] = []
            for(let i = 0 ; i < sedes.length ; i++){
                attendanceData.push(await SortAttendanceData(sedes[i], state.user.token))
            }
            console.log(attendanceData)
            setIngersosSorted(attendanceData)
            setIsLoading(false)
        }
    }

    

    const handleButton = function(){
        resolvePromise()
    }

    useEffect( () => {
        if(!sedes || !salas){
            fetchSedesAndSalas()
        }
        if(sedes && salas && !ingresos){
            fetchIngresos()
        }
        if(ingresos && !ingresosSorted){
            resolvePromise()
        }
    }, [sedes, salas, ingresos] )

    return(
        <div className="flex flex-wrap gap-4 ">
            {
                isLoadingSedesAndSalas || isLoading &&
                <Spinner color="danger" size="lg" onClick={handleButton} />
            }
            {
                ingresosSorted &&
                <div className="flex flex-col gap-3 items center">
                    <div className="flex flex-row justify-between p-[15px] bg-ua-gray bg-opacity-25 w-full h-fit rounded-xl shadow-xl  ">
                        <div className="flex justify-center text-center ">
                            <p>
                                <strong>
                                    Asistencia de personal
                                </strong>
                                <br/>
                            </p>
                            {
                                ingresosSorted.map( (i, index) => (
                                    <p key={index+1}>
                                        <strong>
                                            {i.sede}
                                        </strong>
                                        <br/>
                                        Numero de trabajadores con asistencia: {i.numberOfWorkers}
                                    </p>
                                ) )
                            }
                        </div>
                        <div className="flex justify-center items-center w-fit text-center">
                            <h1 className="italic font-semibold" >
                                Asistencia de sedes en el mes de {MONTHS_NAMES[selectedMonth]}
                            </h1>
                        </div>
                    </div>
                    <div className="flex justify-center m-[15px] min-h-[200px] min-w-[800px] ">
                        <ResponsiveContainer width={"100%"} height={"100%"} >
                            <BarChart
                            data={ingresosSorted}>
                                <CartesianGrid strokeDasharray={"3 3"}/>
                                <Legend/>
                                <Tooltip/>
                                <XAxis dataKey={"sede"} />
                                <YAxis />
                                <Bar dataKey={"attendances"} fill='#8884d8' activeBar={
                                    <Rectangle fill="gold" stroke="purple"/>
                                }/>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            }
        </div>
    )
}