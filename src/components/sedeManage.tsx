import { ChangeEvent, ReactElement, useEffect, useState } from "react"
import { sede } from "@/types/sede"
import axios, { AxiosResponse } from "axios"
import { Accordion, AccordionItem, Button, ScrollShadow, Select, SelectItem, Spinner } from "@nextui-org/react"
import { sala } from "@/types/sala"
import { ConferenceRoom24Regular, Map24Regular } from "@fluentui/react-icons"
import Mapa from "./mapa"
import { timeOut } from "./utils/function_lib"
import { useAuthContext } from "@/hooks/useLoginContext"


export default function SedeManage(): ReactElement {
    const [sedes, setSedes] = useState<sede[]>()
    const [selectedSede, setSelectedSede] = useState<sede>()
    const [salas, setSalas] = useState<sala[]>()
    const [isSedeSelected, setIsSedeSelected] = useState<boolean>(false)
    const [isMapLoading, setIsMapLoading] = useState<boolean>(false)
    const { state } = useAuthContext()

    const handleSedeSelection = function(e: ChangeEvent<HTMLSelectElement>): void{
        setIsMapLoading(true)
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
        axios.get(`${import.meta.env.VITE_API_URL}/sedes`, {
            headers: {
                Authorization: `Bearer ${state.user?.token}`
            }
        }).then( (res: AxiosResponse) => {setSedes(res.data); setSelectedSede(res.data[0])} )
    }, [] )

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
                                { !isMapLoading ? <div className="flex h-[500px] min-w-[350px] lg:w-[500px] p-[5px] border-3 border-solid border-red-500 rounded-md">
                                    <Mapa dataSede={selectedSede}/>
                                </div> : <Spinner color="danger" size="lg" />}
                            </div> : null}
                            <div className="flex flex-col lg:h-[400px] h-[200px]">
                                {
                                    salas ? 
                                    <>
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
                                                            gateway
                                                            <br/>
                                                            <Button className=" m-[10px] " color='danger' size="sm">
                                                                Ver en el mapa
                                                            </Button>
                                                        </AccordionItem>
                                                    ) )
                                                }
                                            </Accordion> 
                                        </ScrollShadow>
                                    </>
                                : null} 
                                <Button color="danger" variant="flat">
                                    Crear sala
                                </Button>       
                            </div>
                            
                    </div>
                    
                </div>
                : <Spinner color="danger" size="lg" />
            }
        </>
    )
}