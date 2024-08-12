import { gateway } from "@/types/gateway";
import { sala } from "@/types/sala";
import { ErrorCircle24Filled } from "@fluentui/react-icons";
import { Input } from "@nextui-org/input";
import { Button, Link, Select, SelectItem, Spinner } from "@nextui-org/react";
import axios, { AxiosResponse } from "axios";
import { ChangeEvent, ReactElement, useEffect, useState } from "react";
import { CloseButton } from "react-bootstrap";

interface AddSedeProps{
    id_sede: number
    token: string
}

export default function AddSede(props: Readonly<AddSedeProps>): ReactElement{
    const [gateways, setGateways] = useState<gateway[]>()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [selectedGateway, setSelectedGateway] = useState<number>()
    const [nombreSala, setNombreSala] = useState<string>()
    const [geoJson, setGeoJson] = useState<string>()
    const [errorMsg, setErrorMsg] = useState<string>()
    const [success, setSuccess] = useState<boolean>(false)
    const [error, setError] = useState<Error>()
    const [loadingGateways, setLoadingGateways] = useState<boolean>(false)

    const refreshPage = () => {
        window.location.reload()
    }

    const handleGwSelect = (e: ChangeEvent<HTMLSelectElement>): void =>{
        console.log(e.target.value)
        const gw: number = Number(e.target.value)
        setSelectedGateway(gw)
    }

    const handleCrear = (): void => {
        setIsLoading(true)
        if(!selectedGateway || !nombreSala || !geoJson){
            setErrorMsg("SE DEBEN LLENAR TODOS LOS CAMPOS...")
            setIsLoading(false)
            return
        }
        const nuevaSala: Partial<sala> = {
            numero: nombreSala,
            ubicacion: JSON.parse(geoJson),
            id_gateway: selectedGateway,
            id_sede: props.id_sede
        }
        console.log(nuevaSala)
        axios.request({
            url: `${import.meta.env.VITE_API_URL}/sala`,
            method: 'POST',
            data: nuevaSala,
            headers: {
                Authorization: `Bearer ${props.token}`
            }
        }).then(
            (res: AxiosResponse<sala>) => {
                if(res.status === 201){
                    setErrorMsg(undefined)
                    setError(undefined)
                    setSuccess(true)
                    setIsLoading(false)
                }
            }
        ).catch( (err: Error) => {
            setErrorMsg(undefined)
            setSuccess(false)
            setError(err)
            setIsLoading(false)
            console.log(err)
        } )
    }

    useEffect( () => {
        if(!gateways){
            setLoadingGateways(true)
            axios.get(`${import.meta.env.VITE_API_URL}/gateway/free`, {
                headers: {
                    Authorization: `Bearer ${props.token}`
                }
            }).then( (res: AxiosResponse<gateway[]>) => {
                setGateways(res.data)
                setLoadingGateways(false)
                console.log(res.data)
            })
        }
    }, [gateways] )

    return(
        <div className="flex flex-col items-center gap-1 p-[10px] border-double border-2 border-red-300 rounded-lg " >
            { gateways ?
            <> 
                {
                    errorMsg ?
                    <div className="flex p-[10px] h-fit w-fit border-solid border-2 border-double border-yellow-300 bg-red-500 rounded-lg " >
                        <div className="flex justify-end" >
                            <CloseButton onClick={ () => {setErrorMsg(undefined); setGateways(undefined)} } />
                        </div>
                        <p className="text-neutral-50">
                            {
                                errorMsg
                            }
                        </p>
                    </div>
                    : error ?
                    <div className="flex p-[10px] h-fit w-fit border-solid border-2 border-double border-yellow-300 bg-red-500 rounded-lg" >
                        <div className="flex justify-end" >
                            <CloseButton onClick={refreshPage} />
                        </div>
                        <p className="text-neutral-50">
                            {
                                error.message
                            }
                        </p>
                    </div>
                    : success ?
                    <div className="flex p-[10px] h-fit w-fit border-solid border-2 border-double border-yellow-300 bg-green-500 rounded-lg " >
                        <div className="flex justify-end" >
                            <CloseButton onClick={refreshPage} />
                        </div>
                        <p className="text-neural-50">
                            Éxito al crear elemento...
                        </p>
                    </div>
                    : null
                }
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
                    {!loadingGateways ? <Select className="w-full" size="sm" color="danger" variant="bordered" label="Gateway" placeholder="Seleccionar gateway" selectionMode="single" onChange={handleGwSelect}>
                        {
                            gateways.map( (gw: gateway) => (
                                <SelectItem key={gw.id} value={JSON.stringify(gw)}>
                                    {gw.mac}
                                </SelectItem>
                            ) )
                        }
                    </Select> : <Spinner color="danger" size="sm"/>}
                </div>
                <div>
                    <Button color="danger" size="sm" variant="solid" onClick={handleCrear} isLoading={isLoading} >
                        Crear
                    </Button>
                    <Button color="primary" onClick={() => setIsLoading(false)} isIconOnly startContent={ <ErrorCircle24Filled/> }/>
                </div>
            </> 
            : <Spinner color="danger" size="sm"/> }
        </div>
    )
}