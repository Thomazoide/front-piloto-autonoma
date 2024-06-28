import { Divider, Select, SelectItem, Button, Spinner } from "@nextui-org/react"
import { useState, ReactElement, useEffect, ChangeEvent, MouseEvent } from "react"
import { Container } from "react-bootstrap"
import { sede } from "@/types/sede"
import { sala } from "@/types/sala"
import { worker } from "@/types/worker"
import { ingreso } from "@/types/ingreso"
import { ErrorCircle48Filled } from "@fluentui/react-icons"
import axios, { AxiosResponse } from "axios"
import { getGuardiasXsala, timeOut } from "./utils/function_lib"
import Mapa from "./mapa"
import WorkerFrame from "./workerFrame"
import './../styles/generic_styles.css'

export default function DataSelector(): ReactElement{
    //atributos
    const [isSedeSelected, setIsSedeSelected] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<boolean>(false)
    const [dataSedes, setDataSedes] = useState<sede[]>([])
    const [selectedSede, setSelectedSede] = useState<string>('')
    const [sSede, setSSede] = useState<sede>()
    const [sSala, setSSala] = useState<sala>()
    const [dataSalas, setDataSalas] = useState<sala[]>([])
    const [isSalaSelected, setIsSalaSelected] = useState<boolean>(false)
    const [selectedSala, setSelectedSala] = useState<string>('')
    const [dataWorkers, setDataWorkers] = useState<worker[]>([])
    const [dataDocentes, setDataDocentes] = useState<worker[]>([])
    const [ingresos, setIngresos] = useState<ingreso[]>([])
    const [wType, setWType] = useState<string>()

    //metodos
    const handleSedeSelection = (e: ChangeEvent<HTMLSelectElement>) => {
        setSelectedSede(e.target.value)
        dataSedes.forEach( (s: sede) => {
            if(String(s.id) === e.target.value){
                setSSede(s)
            }
        } )
        setIsSedeSelected(true)
        axios.get(`http://52.201.181.178:3000/api/sala/sede/${e.target.value}`).then( (res: AxiosResponse) => {
            if(res.status == 200){
                const temp: sala[] = res.data
                setDataSalas(temp)
            }
        } )
    }

    const setSSandIL = (): void => {
        setIsSedeSelected(true)
        setIsLoading(false)
    }

    const handleSalaSelection = (e: ChangeEvent<HTMLSelectElement>): void => {
        setIsLoading(true)
        setIsSedeSelected(false)
        setIsSalaSelected(false)
        setSelectedSala(e.target.value)
        dataSalas.forEach( (s: sala) => {
            if(String(s.id) === e.target.value){
                setSSala(s)
            }
        } )
        axios.get(`http://52.201.181.178:3000/api/ingreso/sala/${e.target.value}`).then( (res: AxiosResponse) => {
            if(res.status == 200){
                const temp: ingreso[] = res.data
                setIngresos(temp)
            }
        } )
        setIsSalaSelected(true)
    }

    const onWTypeSelect = (e: MouseEvent<HTMLButtonElement>) => {
        setWType(e.currentTarget.value)
    }

    //Efectos
    useEffect( () => {
        if(!dataSedes[0]){
            axios.get('http://52.201.181.178:3000/api/sedes').then( (res: AxiosResponse) => {
                if(res.status == 200){
                    const temp: sede[] = res.data
                    setDataSedes(temp)
                } else {
                    setError(true)
                }
            } )
        }
        if(ingresos[0]){
            getGuardiasXsala(ingresos).then( (wks: worker[]) => {
                setDataWorkers(wks)
            } )
            timeOut(setSSandIL, 500)
        }
        if(selectedSala != localStorage.getItem("idSala")){
            setWType(undefined)
            localStorage.setItem("idSala", selectedSala)
        }
    }, [ingresos, selectedSala] )


    //Renderizado del componente
    if(error){
        return(
            <>
                <ErrorCircle48Filled />
                <p> <strong className='color-danger'>Error al cargar datos...</strong> </p>
            </>
        )
    }

    return(
        <Container>
            <div className="flex h-5 items-center justify-center space-x-4 text-small m-[30px]">
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
                { selectedSede && dataSalas[0] ?
                    <Select
                    label="Sala"
                    variant="bordered"
                    placeholder="seleccionar sala"
                    className="max-w-xs"
                    onChange={handleSalaSelection}>
                        {
                            dataSalas.map( (s: sala) => (
                                <SelectItem key={s.id} value={s.id}>
                                    {`Sala ${s.numero}`}
                                </SelectItem>
                            ) )
                        }
                    </Select>
                : null}
                
            </div>
            
            {
                isSalaSelected && dataWorkers[0] ?
                <div className="flex flex-wrap m-[10px] gap-4 justify-evenly max-w-[100%]" >
                    <Button isDisabled color="danger" variant="shadow" value="docentes">
                        Docentes
                    </Button>
                    <Button color="danger" variant="shadow" value="guardias" onClick={onWTypeSelect}>
                        Guardias
                    </Button>
                </div>
                : null
            }
            {
                dataWorkers[0] && ingresos[0] && wType && !isLoading && selectedSala ? 
                <WorkerFrame tipo={wType} workers={dataWorkers} ingresos={ingresos}/>
                : isLoading ? <div className="flex justify-center align-center items-center"> <Spinner color="danger" size="sm" /> </div> : null
            }
            <hr/>
            { isSedeSelected && sSede ? <div className="flex h-[500px] min-w-[200px] p-[5px] border-3 border-solid border-red-500 rounded-md">
                
                <Mapa dataSede={sSede} sala={sSala}/>
                
            </div> : null}
            { isLoading &&
            <div className="flex justify-center align-center h-[500px] min-w-[200px] p-[5px] border-3 border-solid border-red-500 rounded-md">
                <Spinner color="danger" label="Cargando mapa" labelColor="warning" size="lg" />
            </div>  }
        </Container>
        
    )
}

