import { Divider, Listbox, ListboxItem, Select, SelectItem, Spinner } from "@nextui-org/react"
import { useState, ReactElement, useEffect, ChangeEvent, MouseEvent } from "react"
import { Button, Container, ListGroup } from "react-bootstrap"
import { sede } from "@/types/sede"
import { sala } from "@/types/sala"
import { worker } from "@/types/worker"
import { ingreso } from "@/types/ingreso"
import axios, { AxiosResponse } from "axios"
import './../styles/generic_styles.css'

export default function DataSelector(): ReactElement{
    const [isSedeSelected, setIsSedeSelected] = useState<boolean>(false)
    const [isWorkerSelected, setIsWorkerSelected] = useState<boolean>(false)
    const [error, setError] = useState<boolean>(false)
    const [dataSedes, setDataSedes] = useState<sede[]>([])
    const [selectedSede, setSelectedSede] = useState<string>('')
    const [dataSalas, setDataSalas] = useState<sala[]>([])
    const [isSalaSelected, setIsSalaSelected] = useState<boolean>(false)
    const [selectedSala, setSelectedSala] = useState<string>('')
    const [selectedWorker, setSelectedWorker] = useState<string>()
    const [dataWorkers, setDataWorkers] = useState<worker[]>([])
    const [ingresos, setIngresos] = useState<ingreso[]>([])

    const handleSedeSelection = (e: ChangeEvent<HTMLSelectElement>) => {
        setSelectedSede(e.target.value)
        setIsSedeSelected(true)
        axios.get(`http://localhost:3000/api/sala/sede/${e.target.value}`).then( (res: AxiosResponse) => {
            if(res.status == 200){
                const temp: sala[] = res.data
                console.log(temp)
                setDataSalas(temp)
            }
        } )
    }

    const handleSalaSelection = (e: MouseEvent<HTMLButtonElement>) => {
        setSelectedSala(e.currentTarget.value)
        setIsSalaSelected(true)
        axios.get(`http://localhost:3000/api/ingreso/sala/${e.currentTarget.value}`).then( (res: AxiosResponse) => {
            if(res.status == 200){
                const temp: ingreso[] = res.data
                console.log(temp)
            }

        } )

    }

    useEffect( () => {
        axios.get('http://localhost:3000/api/sedes').then( (res: AxiosResponse) => {
            if(res.status == 200){
                const temp: sede[] = res.data
                setDataSedes(temp)
                console.log(temp)
            } else {
                setError(true)
            }
        } )
    }, [] )


    return(
        <Container>
            <div className="flex h-5 items-center space-x-4 text-small">
                { dataSedes[0] ?
                    <Select
                    label='Sede'
                    variant="bordered"
                    placeholder="seleccionar sede"
                    className="max-w-xs"
                    onChange={handleSedeSelection}>
                        {
                            dataSedes.map( (s: sede) => (
                                <SelectItem key={s.id} value={s.id}>
                                    {s.nombre}
                                </SelectItem>
                            ) )
                        }
                    </Select>
                    : <Spinner color="danger"/>
                }
                <Divider orientation="vertical"/>
                { isSedeSelected && selectedSede ?
                    (
                        dataSalas[0] ? <div className="caja-lista flex flex-col gap-2">
                            <ListGroup variant="flush">
                                {
                                    dataSalas.map( (s: sala) => (
                                        <ListGroup.Item key={s.id}>
                                            <Button variant="light" value={s.id} onClick={handleSalaSelection}>
                                                sala {s.numero}
                                            </Button>
                                        </ListGroup.Item>
                                    ) )
                                }
                            </ListGroup>
                        </div> : <Spinner color="danger"/>
                    )
                : null}
                
            </div>
        </Container>
        
    )
}

