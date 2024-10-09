import { useAuthContext } from '@/hooks/useLoginContext'
import { ingreso } from '@/types/ingreso'
import { sala } from '@/types/sala'
import { sede } from '@/types/sede'
import { useEffect, useState, ReactElement, MouseEvent } from 'react'
import { BarChart, Bar, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Rectangle, Legend, Tooltip } from 'recharts'
import { MonthAndAttendanceChartData, SortAttendanceData, MONTHS, MONTHS_NAMES, GetActiveWorkers } from '@/components/utils/function_lib'
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { Dropdown, DropdownMenu, DropdownItem, DropdownTrigger, Button, Spinner } from '@nextui-org/react'
import "@/styles/charts.css"
import { ArrowDown16Regular, Calendar16Regular } from '@fluentui/react-icons'
import { worker } from '@/types/worker'
import IconoGuardiaSVG from '../svgComponents/IconoGuardiaSVG'
import IconoDocentes from '../svgComponents/IconoDocentes'

export default function Dashboard(): ReactElement{
    const {state} = useAuthContext()
    const [sedes, setSedes] = useState<sede[]>()
    const [salas, setSalas] = useState<sala[]>()
    const [ingresos, setIngresos] = useState<ingreso[]>()
    const [activeGuardias, setActiveGuardias] = useState<worker[]>()
    const [activeDocentes, setActiveDocentes] = useState<worker[]>()
    const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth())
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
                setIsLoading(true)
            }
            const sedesResponse: AxiosResponse<sede[]> = await axios.get(SEDES_ENDPOINT, CONFIG)
            const salasResponse: AxiosResponse<sala[]> = await axios.get(SALAS_ENDPOINT, CONFIG)
            setSedes(sedesResponse.data)
            setSalas(salasResponse.data)
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

    const fetchActiveWorkers = async function(){
        if(state.user){
            setActiveDocentes(await GetActiveWorkers("docente", state.user.token))
            setActiveGuardias(await GetActiveWorkers("guardia", state.user.token))
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

    const handleMonthSelector = async function(e: MouseEvent<HTMLLIElement>){
        if(sedes && state.user){
            setIsLoading(true)
            const value = e.currentTarget.value
            setSelectedMonth(value)
            const attendanceData: MonthAndAttendanceChartData[] = []
            for(let i = 0 ; i < sedes.length ; i++){
                attendanceData.push(await SortAttendanceData(sedes[i], state.user.token, value))
            }
            fetchActiveWorkers()
            setIngersosSorted(attendanceData)
            setIsLoading(false)
        }
    }

    

    useEffect( () => {
        fetchActiveWorkers()
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
        <div className="flex flex-wrap gap-4 justify-center ">
            { activeDocentes && activeGuardias && <div className="flex flex-col gap-1 items-center w-fit text-center bg-default-200 p-[15px] rounded-xl shadow-xl shadow-danger-300 border-double border-3 border-red-500">
                <div className="flex flex-col gap-1">
                    <div className="flex flex-col gap-1 items-center ">
                        <IconoGuardiaSVG/>
                        <p>
                            Guardias activos: {activeGuardias.length}
                        </p>
                    </div>
                    <div className="flex flex-col gap-1 items-center">
                        <IconoDocentes/>
                        <p>
                            Docentes activos: {activeDocentes.length}
                        </p>
                    </div>
                </div>
            </div>}
            <div className="flex flex-col gap-1 items-center w-fit text-center bg-default-200 p-[15px] rounded-xl shadow-xl shadow-danger-300 border-double border-3 border-red-500">
                <div className="flex justify-center text-center">
                    <h4>
                        Seleccionar mes
                    </h4>
                </div>
                <div className="flex flex-col items-center gap-1 ">
                    <Dropdown title='Seleccionar mes' aria-label='Seleccionar mes' backdrop='blur' >
                        <DropdownTrigger>
                            <Button isLoading={isLoading} color="danger" variant='flat' endContent={
                                <ArrowDown16Regular/>
                            }>
                                Click aquí para seleccionar
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                        className="flex justify-start max-h-[250px] overflow-y-scroll"
                        variant="bordered">
                            {
                                MONTHS.map( (month, index) => (
                                    <DropdownItem startContent={
                                        <Calendar16Regular/>
                                    } onClick={ handleMonthSelector } color="danger" variant="flat" className="text-start" key={month} value={index}>
                                        {MONTHS_NAMES[index]}
                                    </DropdownItem>
                                ) )
                            }
                        </DropdownMenu>
                    </Dropdown>
                    <p className="italic">
                        <small>
                            Mes seleccionado: {MONTHS_NAMES[selectedMonth]}
                        </small>
                    </p>
                </div>
            </div>
            {
                ingresosSorted &&
                <div className="flex flex-col gap-3 items center">
                    <div className="flex flex-column items-center gap-3 justify-between p-[15px] bg-default-200 w-full h-fit rounded-xl shadow-xl shadow-danger-300 border-double border-3 border-red-500  ">
                        <div className="text-center">
                            <h1 className="italic font-semibold max-w-[800px]" >
                                Numero de trabajadores con asistencia por sede
                            </h1>
                            <p className="italic">
                                <small>
                                    Mes seleccionado: {MONTHS_NAMES[selectedMonth]}
                                </small>
                            </p>
                        </div>
                        { !isLoading ? <div className="flex justify-center min-h-[200px] min-w-[800px]  ">
                            <ResponsiveContainer width={"100%"} height={"100%"}>
                                <BarChart
                                data={ingresosSorted}>
                                    <CartesianGrid strokeDasharray={"3 3"}/>
                                    <Legend />
                                    <Tooltip/>
                                    <XAxis dataKey={"sede"}/>
                                    <YAxis/>
                                    <Bar dataKey={"numberOfWorkers"} fill="#8884d8" activeBar={
                                        <Rectangle fill="gold" stroke="purple"/>
                                    }/>
                                </BarChart>
                            </ResponsiveContainer>
                        </div> : <Spinner color="danger" size="sm" label='Generando estadísticas...' labelColor='warning'/> }
                    </div>
                    <div className="flex flex-col items-center gap-3 w-fit h-fit p-[15px] bg-default-200 rounded-xl shadow-xl shadow-danger-300 border-double border-3 border-red-500 ">
                        <div className="text-center">
                            <h1 className="italic font-semibold" >
                                Asistencias marcadas por sede
                            </h1>
                            <p className="italic">
                                <small>
                                    Mes seleccionado: {MONTHS_NAMES[selectedMonth]}
                                </small>
                            </p>
                        </div>
                        { !isLoading ? <div className="flex justify-center m-[15px] min-h-[200px] min-w-[800px] ">
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
                        </div> : <Spinner color="danger" size="sm" label='Generando estadísticas...' labelColor='warning'/>}
                    </div>
                </div>
            }
        </div>
    )
}