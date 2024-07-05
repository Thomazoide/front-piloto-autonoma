import { ReactElement, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { sede } from "@/types/sede";
import axios, { AxiosResponse } from "axios";
import { Spinner } from "@nextui-org/react";
import { ErrorCircle24Regular } from "@fluentui/react-icons";

async function getSedes(): Promise<sede[] | undefined>{
    const response: AxiosResponse = await axios.get(`${import.meta.env.VITE_API_URL}/sedes`)
    if (response.status === 200){
        const sedes: sede[] = response.data
        console.log(sedes)
        return sedes
    }
    else return undefined
}

export default function DashBoard(): ReactElement{
    const dataSedes = useQuery({
        queryKey: ['sedes'],
        queryFn: getSedes,
    })

    useEffect( () => {
        console.log(import.meta.env.API_URL)
    }, [] )

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
        </div>
    )
}