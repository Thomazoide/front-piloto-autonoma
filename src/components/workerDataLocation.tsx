import { ingreso } from "@/types/ingreso";
import { sala } from "@/types/sala";
import { sede } from "@/types/sede";
import { worker } from "@/types/worker";
import { Delete24Regular, Edit24Regular, ErrorCircle24Regular, Filter24Regular } from "@fluentui/react-icons";
import { Button } from "@nextui-org/button";
import axios, { AxiosRequestConfig } from "axios";
import moment from "moment";
import {useState, useEffect, ReactElement} from "react";
import Mapa from "./mapa";
import { Spinner } from "@nextui-org/react";
import EditWorker from "./editWorker";
import FilterIngresosWorker from "./filterIngresosWorker";

interface WDLProps{
    entity: worker
    sedes: sede[]
    salas: sala[]
    token: string
    tipo: "docente" | "guardia"
}

export default function WorkerDataLocation(props: Readonly<WDLProps>): ReactElement{
    const [ingresos, setIngresos] = useState<ingreso[]>()
    const [ultimoIngreso, setUltimoIngreso] = useState<ingreso>()
    const [mostrarFiltros, setMostrarFiltros] = useState<boolean>(false)
    const [editWorker, setEditWorker] = useState<boolean>(false)
    const [dataSede, setDataSede] = useState<sede>()
    const [dataSala, setDataSala] = useState<sala>()
    
    const CONFIG: AxiosRequestConfig = {
        headers: {
            Authorization: `Bearer ${props.token}`
        }
    }
    const INGRESOS_ENDPOINT: string = `${import.meta.env.VITE_API_URL}/ingreso/${props.tipo}`
    const LAST_INGRESO_ENDPOINT: string = `${import.meta.env.VITE_API_URL}/ingreso/${props.tipo}/last`

    const fetchIngresos = async function(){
        const ingresosReq: ingreso[] = (await axios.post<ingreso[]>(INGRESOS_ENDPOINT, props.entity, CONFIG)).data
        const lastIngreso: ingreso = (await axios.post<ingreso>(LAST_INGRESO_ENDPOINT, props.entity, CONFIG)).data
        console.log(lastIngreso.hora)
        setIngresos(ingresosReq)
        setUltimoIngreso(lastIngreso)
    }

    const findSala = function(): sala{
        const dataSalaTemp: sala = props.salas.filter( (s) => s.id_gateway === ultimoIngreso?.id_gateway )[0]
        return dataSalaTemp
    }

    const findSede = function(): sede{
        const dataSedeTemp: sede = props.sedes.filter( (s) => s.id === findSala().id_sede )[0]
        return dataSedeTemp
    }

    useEffect( () => {
        if(ingresos && ingresos[0] && ultimoIngreso){
            setDataSala(findSala())
            setDataSede(findSede())
        }
        if(!ingresos && !ultimoIngreso){
            fetchIngresos()
            return
        } else {
            const refetchInterval = setInterval( fetchIngresos, 5000 )
            return () => clearInterval(refetchInterval)
        }
    }, [ingresos, ultimoIngreso] )


    if(ingresos && !ingresos[0]){
        return(
            <div className="flex flex-col items-center gap-3 w-[375px] h-fit border-2 border-double border-red-300 rounded-xl shadow-lg p-[15px]">
                <div className="flex justify-evenly w-full h-fit">
                    <Button isIconOnly startContent={
                        <Edit24Regular/>
                    } onClick={ () => setEditWorker(!editWorker) } variant="flat" color="danger"/>
                    <Button isIconOnly startContent={
                        <Delete24Regular/>
                    } variant="flat" color="danger" />
                </div>
                {
                    !editWorker ?
                    <div className="flex flex-col items-center">
                        <h5>
                            {`${props.tipo[0].toUpperCase()}${props.tipo.slice(1)}: ${props.entity.nombre}`}
                        </h5>
                        <hr/>
                        <div className="flex justify-center">
                            <ErrorCircle24Regular/>
                            <p className="text-yellow-300 text-italic">
                                Sin registros...
                            </p>
                        </div>
                    </div>
                    : <EditWorker entity={props.entity} tipo={props.tipo} token={props.token}/>
                }
            </div>
        )
    }

    return(
        <>
            {
                ingresos && ultimoIngreso &&
                <div className="flex flex-col gap-3 items-center w-[375px] h-fit border-2 border-double border-red-300 rounded-xl shadow-lg p-[15px] ">
                    <div className="flex w-full justify-evenly">
                        <div className="flex w-fit h-fit">
                            <Button color="danger" variant="flat" isIconOnly startContent={
                                <Filter24Regular/>
                            } onClick={ () => {
                                setEditWorker(false)
                                setMostrarFiltros(!mostrarFiltros)
                            } } />
                        </div>
                        <div className="flex w-fit h-fit">
                            <Button color="danger" variant="flat" isIconOnly startContent={
                                <Edit24Regular/>
                            } onClick={ () => {
                                setMostrarFiltros(false)
                                setEditWorker(!editWorker)
                            } }/>
                        </div>
                        <div className="flex w-fit h-fit">
                            <Button color="danger" variant="flat" isIconOnly startContent={
                                <Delete24Regular/>
                            }/>
                        </div>
                    </div>
                    <div className="flex flex-col items-center gap-1 ">
                        <h5>
                            {
                                `${props.tipo[0].toUpperCase()}${props.tipo.slice(1)}: ${props.entity.nombre}`
                            }
                        </h5>
                        { !editWorker && !mostrarFiltros ?
                            <p>
                                <strong>
                                    Ultimo registro en sala:
                                </strong>
                                <br/>
                                Fecha: { moment(ultimoIngreso.hora).utc().format("DD-MM-YYYY") }
                                <br/>
                                Hora: { moment(ultimoIngreso.hora).utc().format("HH:mm:ss") }
                                <br/>
                                Sala: { props.salas.find( (s) => s.id_gateway === ultimoIngreso.id_gateway )?.numero}
                            </p>
                        : !mostrarFiltros && editWorker ?
                            <EditWorker entity={props.entity} tipo={props.tipo} token={props.token}/>
                        : !editWorker && mostrarFiltros &&
                            <FilterIngresosWorker entity={props.entity} ingresos={ingresos} sedes={props.sedes} salas={props.salas}/>
                        }
                    </div>
                    <div className="flex justify-center h-[300px] w-full border-1 border-solid border-red-300 p-[3px] ">
                        {
                            dataSede && dataSala ?
                            <Mapa dataSede={dataSede} sala={dataSala} entidad={props.entity} tipo={props.tipo} key={new Date(ultimoIngreso.hora).getTime().toString()} />
                            : <Spinner color="danger" label="Cargando..." size="sm"/>
                        }
                    </div>
                </div>
            }
        </>
    )
}