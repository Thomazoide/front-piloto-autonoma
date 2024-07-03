import { ingreso } from "@/types/ingreso";
import { worker } from "@/types/worker";
import { Button, ScrollShadow } from "@nextui-org/react";
import axios, { AxiosResponse } from "axios";
import { ReactElement, useState, useEffect, MouseEvent } from "react";
import { getIngresoByWorker } from "./utils/function_lib";


export default function MonitorGuardias(): ReactElement{
    const [guardias, setGuardias] = useState<worker[]>()
    const [selectedGuardia, setSelectedGuardia] = useState<worker>()
    const [ingresos, setIngresos] = useState<ingreso[]>()

    const handleGuardSelect = async (e: MouseEvent<HTMLButtonElement>): Promise<void> => {
        const guardia: worker = JSON.parse(e.currentTarget.value)
        const ingresosGuardia: ingreso[] = (await axios.get(`http://52.201.181.178:3000/api/ingreso/guardia/${guardia.id}`)).data
        setSelectedGuardia(guardia)
        setIngresos(ingresosGuardia)
    }

    useEffect( () => {
        if(!guardias){
            axios.get("http://52.201.181.178:3000/api/guardia").then( (res: AxiosResponse) => setGuardias(res.data) )
        }
        console.log(guardias)
    }, [guardias] )

    return(
        <div className="flex flex-wrap gap-4">
            <div className="items-center flex flex-col">
                <h5>Guardias</h5>
                {guardias ? <ScrollShadow className=" max-w-[370px] h-[200px]" style={{overflowY: "scroll"}}>
                    {
                        guardias.map( (g: worker) => (
                            <div>
                                <Button className="m-[5px] " color="danger" variant="bordered" value={JSON.stringify(g)} onClick={handleGuardSelect}>
                                    {g.nombre} | {g.rut}
                                </Button>
                            </div>
                        ) )
                    }
                </ScrollShadow> : null}
            </div>
            {
                selectedGuardia && ingresos && ingresos[0] ?
                <div></div>
                : selectedGuardia && ingresos && !ingresos[0] ?
                <div></div>
                : null

            }
        </div>
    )
}