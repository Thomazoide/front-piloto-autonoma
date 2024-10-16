import { useState, useEffect, ReactElement, ChangeEvent } from "react";
import { Select, SelectItem, SelectSection, Spinner } from "@nextui-org/react"
import { GetAllSedes } from "@/components/utils/function_lib"
import { GeoJson, sede } from "@/types/sede";
import { useAuthContext } from "@/hooks/useLoginContext";
import MapComponent from "./mapComponent";

export default function SedeMonitor(): ReactElement{
    const [sedes, setSedes] = useState<sede[]>()
    const [selectedSede, setSelectedSede] = useState<sede>()
    const {state} = useAuthContext()
    const [selectedFloor, setSelectedFloor] = useState<GeoJson<number[][][]>>()
    const [isLoading, setIsLoading] = useState<boolean>(false)

    async function getSedes(){
        if(state.user){
            setIsLoading(true)
            setSedes(await GetAllSedes(state.user.token))
            setIsLoading(false)
        }
    }

    function handleSedeSelection(e: ChangeEvent<HTMLSelectElement>){
        const id: number = Number(e.target.value)
        const item: sede | undefined = sedes?.find( (sede) => sede.id === id )
        setSelectedSede(item)
        
    }
    
    useEffect( () => {
        getSedes()
    }, [] )

    return(
        <div className="flex flex-col gap-3 items-center p-[15px] ">
            <div className="flex max-w-[800px] min-w-[380px] justify-center" >
                {
                    sedes && !isLoading ?
                    <Select color="danger" variant="underlined" size="lg" label="Seleccionar sede" onChange={handleSedeSelection}>
                        <SelectSection>
                            {
                                sedes.map( (sede, index) => (
                                    <SelectItem key={sede.id} value={index}>
                                        {sede.nombre}
                                    </SelectItem>
                                ) )
                            }
                        </SelectSection>
                    </Select>
                    : isLoading && <Spinner color="danger" label="Cargando..."/>
                }
            </div>
            { selectedSede &&
                <div className="flex flex-col gap-3 p-[15px] items-center sm:w-[380px] sm:h-[800px] lg: bg-default-300 bg-opacity-25 rounded-xl border-double border-2 border-danger-300 shadow-xl shadow-danger-200 ">
                    <div className="flex justify-end w-full">
                        <Select color="danger" variant="underlined" size="md" label="Seleccionar planta" defaultSelectedKeys={['-1']}>
                            <SelectSection>
                                <SelectItem key="-1" value="-1">
                                    Vista general
                                </SelectItem>
                            </SelectSection>
                            { selectedSede && selectedSede.plantas &&
                                <SelectSection>
                                {
                                    selectedSede.plantas.map( (planta, index) => (
                                        <SelectItem textValue={`Piso ${index+1}`} key={index+1} value={JSON.stringify(planta)}>
                                            Piso: {index+1}
                                        </SelectItem>
                                    ) )
                                }
                                </SelectSection>
                            }
                        </Select>
                    </div>
                    <div className="flex justify-center w-full h-full" >
                        <MapComponent planta={selectedFloor} sede={selectedSede}/>
                    </div>
                </div>
            }
        </div>
    )
}