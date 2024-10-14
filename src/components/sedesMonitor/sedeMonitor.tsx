import { useState, useEffect, ReactElement } from "react";
import { Select, SelectItem, SelectSection, Spinner } from "@nextui-org/react"
import { GetAllSedes } from "@/components/utils/function_lib"
import { sede } from "@/types/sede";
import { useAuthContext } from "@/hooks/useLoginContext";

export default function SedeMonitor(): ReactElement{
    const [sedes, setSedes] = useState<sede[]>()
    const [selectedSede, setSelectedSede] = useState<sede>()
    const {state} = useAuthContext()
    const [selectedFloor, setSelectedFloor] = useState<number>()
    const [isLoading, setIsLoading] = useState<boolean>(false)

    async function getSedes(){
        if(state.user){
            setIsLoading(true)
            setSedes(await GetAllSedes(state.user.token))
            setIsLoading(false)
        }
    }
    
    useEffect( () => {
        getSedes()
    }, [] )

    return(
        <div className="flex flex-col gap-3 items-center p-[15px] ">
            <div className="flex max-w-[800px] min-w-[380px] justify-center" >
                {
                    sedes && !isLoading ?
                    <Select color="danger" variant="underlined" size="lg" label="Seleccionar sede">
                        <SelectSection>
                            {
                                sedes.map( (sede, index) => (
                                    <SelectItem key={index} value={index}>
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
                <div className="flex flex-col items-center min-w-[380px] max-w-[800px] min-h-[400px] bg-default-900 bg-opacity-25 rounded-xl border-double border-2 border-danger-300 shadow-xl shadow-danger-200 ">
                    { selectedSede.plantas &&
                        <div className="flex justify-end w-full">
                        
                        </div>
                    }
                </div>
            }
        </div>
    )
}