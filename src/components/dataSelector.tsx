import { Divider, Select } from "@nextui-org/react"
import { useState, useRef, ReactElement, useEffect } from "react"
import { Container } from "react-bootstrap"
import { sede } from "@/types/sede"
import axios, { AxiosResponse } from "axios"

export default function DataSelector(): ReactElement{
    const [isSedeSelected, setIsSedeSelected] = useState<boolean>(false)
    const [isWorkerTypeSelected, setIsWorkerTypeSelected] = useState<boolean>(false)
    const [isWorkerSelected, setIsWorkerSelected] = useState<boolean>(false)
    const [dataSedes, setDataSedes] = useState<sede[]>([])
    const sede = useRef<string>(null)
    const workerType = useRef<any>(null)
    const worker = useRef<string>(null)
    useEffect( () => {
        axios.get('http://localhost:3000/api/sedes').then( (res: AxiosResponse) => {
            const temp: sede[] = res.data
            setDataSedes(temp)
        } )
    }, [] )

    return(
        <Container>
            <div className="d-flex flex-row justify-content-between">
                
                <Divider orientation="vertical"/>

            </div>
        </Container>
        
    )
}

