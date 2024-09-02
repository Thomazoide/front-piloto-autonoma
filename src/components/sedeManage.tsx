import { ChangeEvent, MouseEvent, ReactElement, useEffect, useState } from "react"
import { sede } from "@/types/sede"
import axios, { AxiosRequestConfig, AxiosResponse } from "axios"
import { Accordion, AccordionItem, Button, ScrollShadow, Select, SelectItem, Spinner } from "@nextui-org/react"
import { sala } from "@/types/sala"
import { ConferenceRoom24Regular, Map24Regular } from "@fluentui/react-icons"
import Mapa from "./mapa"
import { timeOut } from "./utils/function_lib"
import { useAuthContext } from "@/hooks/useLoginContext"
import { gateway } from "@/types/gateway"
import AddSede from "./addSede"
import { Divider } from "@fluentui/react-components"


export default function SedeManage(): ReactElement {
    const [sedes, setSedes] = useState<sede[]>()
    const [selectedSede, setSelectedSede] = useState<sede>()
    const [salas, setSalas] = useState<sala[]>()
    const [gateways, setGateways] = useState<gateway[]>()
    const [gwDataLoading, setGwDataLoading] = useState<boolean>(false)
    const [isSedeSelected, setIsSedeSelected] = useState<boolean>(false)
    const [isMapLoading, setIsMapLoading] = useState<boolean>(false)
    const [selectedSala, setSelectedSala] = useState<sala>()
    const [verSalaForm, setVerSalaForm] = useState<boolean>(false)
    const [selectedFloor, setSelectedFloor] = useState<number>()
    const [verMapaIndoor, setVerMapaIndoor] = useState<boolean>(false)
    const { state } = useAuthContext()

    const CONFIG: AxiosRequestConfig = {
        headers: {
            Authorization: `Bearer ${state.user?.token}`
        }
    }

    const SALAS_ENDPOINT: string = `${import.meta.env.VITE_API_URL}/sala`
    const GATEWAYS_ENDPOINT: string = `${import.meta.env.VITE_API_URL}/gateway`
    const SEDES_ENDPOINT: string = `${import.meta.env.VITE_API_URL}/sedes`


    const handleSalaButton = (e: MouseEvent<HTMLButtonElement>) => {
        setIsMapLoading(true)
        const valor: sala = JSON.parse(e.currentTarget.value)
        setSelectedSala(valor)
        timeOut( () => setIsMapLoading(false), 800 )
    }

    const handleSedeSelection = function(e: ChangeEvent<HTMLSelectElement>): void{
        setIsSedeSelected(false)
        setIsMapLoading(true)
        setSalas(undefined)
        setGateways(undefined)
        setSelectedSala(undefined)
        axios.post(`${SALAS_ENDPOINT}/sede`, {
            id: e.target.value
        }, CONFIG).then( (res: AxiosResponse<sala[]>) => setSalas(res.data) )
        setIsSedeSelected(true)
        if(sedes) setSelectedSede( sedes.filter( (s: sede) => s.id === Number(e.target.value) )[0] )
        timeOut( () => setIsMapLoading(false), 1500 )
    }

    const handleFloorSelection = function(e: ChangeEvent<HTMLSelectElement>){
        setSelectedFloor(Number(e.target.value))
        console.log(selectedSede?.m2.features[0].geometry.coordinates[0])
    }


    const LoadIndoorMap = function(){
        setIsMapLoading(true)
        const loadingTimeOut = setTimeout( () => setIsMapLoading(false), 800 )
        return () => clearTimeout(loadingTimeOut)
    }

    useEffect( () => {
        if(!sedes){
            axios.get(`${SEDES_ENDPOINT}`, CONFIG).then( (res: AxiosResponse<sede[]>) => {setSedes(res.data); setSelectedSede(res.data[0])} )
        }
        if(salas && salas[0]){
            setGwDataLoading(true)
            const gatwayRequest: gateway[] = []
            for(const sala of salas){
                axios.post(`${GATEWAYS_ENDPOINT}/findOne`, {
                    id: sala.id_gateway
                }, CONFIG).then( (response: AxiosResponse<gateway>) => {
                    if(response.data){
                        gatwayRequest.push(response.data)
                    }
                } )
            }
            console.log(gatwayRequest)
            setGateways(gatwayRequest)
            timeOut( () => setGwDataLoading(false), 500 )
        }
    }, [salas] )

    return(
        <>
            {
                sedes ?
                <div className="flex flex-col w-[100%] ">
                    <div className="flex h-5 items-center justify-center space-x-4 text-small m-[30px]">
                        <Select
                        label="Sede"
                        variant="bordered"
                        color="danger"
                        placeholder="Seleccionar sede"
                        className="max-w-[250px] "
                        onChange={handleSedeSelection}>
                            {
                                sedes.map( (s: sede) => (
                                    <SelectItem key={s.id} value={s.id}>
                                        {s.nombre}
                                    </SelectItem>
                                ) )
                            }
                        </Select>
                    </div>
                    <div className="flex flex-wrap gap-3 justify-center min-h-[500px] w-full ">
                        {selectedSede && isSedeSelected ? 
                            <div className="flex">
                                <Map24Regular/>
                                { !isMapLoading && !selectedSala ? <div className="flex flex-col items-center h-[500px] min-w-[350px] lg:w-[500px] p-[5px] border-3 border-solid border-red-500 rounded-md">
                                    {
                                        selectedSede.indoorMap &&
                                        <div className="flex flex-col gap-2 items-center justify-evenly p-[10px] w-full">
                                            <Button color="danger" size="sm" variant="flat" onClick={ () => {
                                                LoadIndoorMap()
                                                setVerMapaIndoor(!verMapaIndoor)
                                            } }>
                                                {!verMapaIndoor ? "Ver mapa indoor" : "Ver mapa satelital"}
                                            </Button>
                                            {
                                                verMapaIndoor &&
                                                <Select label="Piso" variant="bordered" size="sm" color="danger" placeholder="Seleccionar piso" defaultSelectedKeys="0" onChange={handleFloorSelection} className="w-[90%]" >
                                                    {
                                                        selectedSede.indoorMap.pisos.map( (floor ,index) => (
                                                            <SelectItem key={index} value={floor} className="w-full" >
                                                                {`Piso ${index+1}`}
                                                            </SelectItem>
                                                        ) )
                                                    }
                                                </Select>
                                            }
                                        </div>
                                    }
                                    <Mapa dataSede={selectedSede} showIndoor={verMapaIndoor} floor={selectedFloor}/>
                                </div> : !isMapLoading && selectedSala && !verMapaIndoor ?
                                <div className="flex h-[500px] min-w-[350px] lg:w-[500px] p-[5px] border-3 border-solid border-red-500 rounded-md ">
                                    <Mapa dataSede={selectedSede} sala={selectedSala}/>
                                </div> : isMapLoading  && <Spinner size="lg" color="danger"/> }
                            </div> : null}
                            <div className="flex flex-col h-fit w-fit ">
                                {
                                    salas && selectedSede && !verMapaIndoor ? 
                                    <>
                                        <div className=" flex max-h-[400px] min-h-[200px] w-full p-[10px] border-double border-2 border-red-300 rounded-lg " >
                                            <ScrollShadow>
                                                <Accordion
                                                title="Salas de la sede"
                                                selectionMode="single"
                                                defaultExpandedKeys={'0'}
                                                isCompact>
                                                    {
                                                        salas.map( (sala, index) => (
                                                            <AccordionItem
                                                            key={index}
                                                            isCompact
                                                            startContent={ <ConferenceRoom24Regular/> }
                                                            title={ `Sala ${sala.numero}` }
                                                            className="shadow-lg border-1 border-solid border-red-200 rounded-md p-[10px] h-fit w-fit mb-[10px] ">
                                                                { gateways && gateways[0] && !gwDataLoading ?
                                                                    `Gateway: ${gateways.filter( gw => gw.id === sala.id_gateway && gw.mac )[0].mac}`
                                                                : gwDataLoading ?
                                                                <Spinner size="sm" color="danger" label="Cargando datos..." labelColor="warning"/> : gateways && !gateways[0] ?
                                                                "Sin gateway asignado..." : null }
                                                                <br/>
                                                                <Button className=" m-[10px] " color='danger' size="sm" value={JSON.stringify(sala)} onClick={handleSalaButton} >
                                                                    Ver en el mapa
                                                                </Button>
                                                            </AccordionItem>
                                                        ) )
                                                    }
                                                </Accordion> 
                                            </ScrollShadow>
                                        </div>
                                        <Divider className="mt-[10px] mb-[10px] " />
                                        <Button color="danger" variant="flat" onClick={ () => setVerSalaForm(!verSalaForm) } >
                                            Crear sala
                                        </Button>
                                        <Divider className="mt-[10px] mb-[10px] " />
                                        {
                                            verSalaForm && selectedSede && state.user ?
                                            <AddSede id_sede={selectedSede?.id} token={state.user.token}/>
                                            : null
                                        } 
                                    </>
                                : null} 
                                      
                            </div>
                            
                    </div>
                    
                </div>
                : <Spinner color="danger" size="lg" />
            }
        </>
    )
}