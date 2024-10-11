import { ReactElement, useEffect, useState } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, Legend, XAxis, YAxis, CartesianGrid } from "recharts";
import { MonthAndAttendanceChartData, MONTHS, SortAttendanceData } from "../utils/function_lib";
import { sede } from "@/types/sede";
import { Spinner } from "@nextui-org/react";

interface DCProps{
    sede: sede
    token: string
}

export default function DataChart(props: Readonly<DCProps>): ReactElement{
    const [data, setData] = useState<MonthAndAttendanceChartData[]>()
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const sortData = async function(){
        setIsLoading(true)
        const temp: MonthAndAttendanceChartData[] = []
        for(let y = 0 ; y < MONTHS.length ; y++){
            temp.push(await SortAttendanceData(props.sede, props.token, y))
        }
        setData(temp)
        setIsLoading(false)
    }

    useEffect( () => {
        if(!data){
            sortData()
        }
    }, [] )

    return(
        <div className="flex justify-start">
            {  isLoading ? <Spinner color="danger" label="Generando estadísticas..."/> : data &&
            <ResponsiveContainer minWidth={window.innerWidth < 1024 ? 375 : 750} minHeight={300}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray={"3 3"}/>
                    <Legend/>
                    <Tooltip/>
                    <XAxis dataKey={"month"}/>
                    <YAxis/>
                    <Line name="Número de asistencias" dataKey="attendances" color="red"/>
                    <Line name="Cantidad de docentes con asistencias" dataKey="numberOfWorkers"/>
                </LineChart>
            </ResponsiveContainer>
            }
        </div>
    )
}