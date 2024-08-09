import { useAuthContext } from "@/hooks/useLoginContext";
import { gateway } from "@/types/gateway";
import { sala } from "@/types/sala";
import { Input } from "@nextui-org/input";
import { Button, Link, Select, SelectItem, Spinner } from "@nextui-org/react";
import axios, { AxiosResponse } from "axios";
import { ChangeEvent, ReactElement, useEffect, useState } from "react";
import { timeOut } from "./utils/function_lib";

interface AddSedeProps{
    id_sede: number
}

export default function AddSede(props: Readonly<AddSedeProps>): ReactElement{
    const [gateways, setGateways] = useState<gateway[]>()
    const [nuevaSala, setNuevaSala] = useState<sala>()
    const [selectedGateway, setSelectedGateway] = useState<number>()
    const [nombreSala, setNombreSala] = useState<string>()
    const [geoJson, setGeoJson] = useState<string>()
    const [errorMsg, setErrorMsg] = useState<string>()
    const [success, setSuccess] = useState<boolean>(false)
    const [error, setError] = useState<boolean>(false)
    const {state} = useAuthContext()

    const handleGwSelect = (e: ChangeEvent<HTMLSelectElement>): void =>{
        console.log(e.target.value)
        const gw: number = Number(e.target.value)
        setSelectedGateway(gw)
    }

    const handleCrear = (): void => {
        if(!selectedGateway || !nombreSala || !geoJson){
            setErrorMsg("SE DEBEN LLENAR TODOS LOS CAMPOS...")
            return
        }
        const nuevaSala: Partial<sala> = {
            numero: nombreSala,
            ubicacion: JSON.parse(geoJson),
            id_gateway: selectedGateway,
            id_sede: props.id_sede
        }
        axios.post(`${import.meta.env.VITE_API_URL}/sala`, nuevaSala, {
            headers: {
                Authorization: `${state.user?.token}`
            }
        }).then(
            (res: AxiosResponse<sala>) => {
                setError(false)
                setSuccess(true)
                setNuevaSala(res.data)
            }
        ).catch( (err: Error) => {
            setSuccess(false)
            setError(true)
            console.log(err.message)
        } )
    }

    useEffect( () => {
        if(!gateways){
            axios.get(`${import.meta.env.VITE_API_URL}/gateway/free`, {
                headers: {
                    Authorization: `Bearer ${state.user?.token}`
                }
            }).then( (res: AxiosResponse<gateway[]>) => {
                setGateways(res.data)
                console.log(res.data)
            })
        }
    }, [] )

    return(
        <div className="flex flex-col items-center gap-1 p-[10px] border-double border-2 border-red-300 rounded-lg " >
            { gateways ?
            <> 
                <div>
                    <Input variant="bordered" color="danger" size="sm" label="Nombre/numero de sala" onValueChange={setNombreSala}/>
                </div>
                <div>
                    <Input variant="bordered" color="danger" size="sm" label="Ubicación (GeoJson)" description={ <Link isExternal className="flex items-center gap-1 text-current" href="https://geojson.io" >
                        <p className="text-xs text-primary" > 
                            <small>Puedes ir al sitio de GeoJson haciendo click aquí </small>
                        </p>
                    </Link> } onValueChange={setGeoJson}/>
                </div>
                <div className="flex w-full" >
                    <Select className="w-full" size="sm" color="danger" variant="bordered" label="Gateway" placeholder="Seleccionar gateway" selectionMode="single" onChange={handleGwSelect}>
                        {
                            gateways.map( (gw: gateway) => (
                                <SelectItem key={gw.id} value={JSON.stringify(gw)}>
                                    {gw.mac}
                                </SelectItem>
                            ) )
                        }
                    </Select>
                </div>
                <div>
                    <Button color="danger" size="sm" variant="solid" onClick={handleCrear}>
                        Crear
                    </Button>
                </div>
            </> 
            : <Spinner color="danger" size="sm"/> }
        </div>
    )
}