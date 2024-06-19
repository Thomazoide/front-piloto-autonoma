import { worker } from "@/types/worker"
import { ReactElement } from "react"


type WFProps = {
    tipo: "guardias" | "docentes"
    workers: worker[]
}


export default function WorkerFrame(props: Readonly<WFProps>): ReactElement{
    
    return(<></>)
}