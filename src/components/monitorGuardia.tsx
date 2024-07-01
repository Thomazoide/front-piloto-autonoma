import { worker } from "@/types/worker";
import axios, { AxiosResponse } from "axios";
import { ReactElement, useState, useEffect } from "react";


export default function MonitorGuardias(): ReactElement{
    const [guardias, setGuardias] = useState<worker[]>()

    useEffect( () => {
        if(!guardias){
            axios.get("http://52.201.181.178:3000/api/guardia").then( (res: AxiosResponse) => setGuardias(res.data) )
        }
        console.log(guardias)
    }, [guardias] )

    return(
        <div className="">
            
        </div>
    )
}