import { ChangeEvent, MouseEvent, ReactElement, useEffect, useState } from "react"
import { sede } from "@/types/sede"
import axios, { AxiosResponse } from "axios"
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
    const { state } = useAuthContext()

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
        axios.post(`${import.meta.env.VITE_API_URL}/sala/sede`, {
            id: e.target.value
        }, {
            headers: {
                Authorization: `Bearer ${state.user?.token}`
            }
        }).then( (res: AxiosResponse) => setSalas(res.data) )
        setIsSedeSelected(true)
        if(sedes) setSelectedSede( sedes.filter( (s: sede) => s.id === Number(e.target.value) )[0] )
        timeOut( () => setIsMapLoading(false), 1500 )
    }

    useEffect( () => {
        if(!sedes){
            axios.get(`${import.meta.env.VITE_API_URL}/sedes`, {
                headers: {
                    Authorization: `Bearer ${state.user?.token}`
                }
            }).then( (res: AxiosResponse) => {setSedes(res.data); setSelectedSede(res.data[0])} )
        }
        if(salas && salas[0]){
            setGwDataLoading(true)
            const gatwayRequest: gateway[] = []
            for(const sala of salas){
                axios.post(`${import.meta.env.VITE_API_URL}/gateway/findOne`, {
                    id: sala.id_gateway
                }, {
                    headers: {
                        Authorization: `Bearer ${state.user?.token}`
                    }
                }).then( (response: AxiosResponse<gateway>) => {
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
                                { !isMapLoading && !selectedSala ? <div className="flex h-[500px] min-w-[350px] lg:w-[500px] p-[5px] border-3 border-solid border-red-500 rounded-md">
                                    <Mapa dataSede={selectedSede}/>
                                </div> : !isMapLoading && selectedSala ?
                                <div className="flex h-[500px] min-w-[350px] lg:w-[500px] p-[5px] border-3 border-solid border-red-500 rounded-md ">
                                    <Mapa dataSede={selectedSede} sala={selectedSala}/>
                                </div> : isMapLoading  && <Spinner size="lg" color="danger"/> }
                            </div> : null}
                            <div className="flex flex-col h-fit w-[200px] ">
                                {
                                    salas ? 
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
                                                            className="shadow-lg border-2 border-solid border-red-200 rounded-md p-[10px] max-h-[400px] overflow-y-scroll mb-[10px] ">
                                                                { gateways && gateways[0] && !gwDataLoading ?
                                                                    `Gateway: ${gateways.filter( gw => gw.id === sala.id_gateway )[0].mac}`
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
                                            verSalaForm && selectedSede ?
                                            <AddSede id_sede={selectedSede?.id}/>
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