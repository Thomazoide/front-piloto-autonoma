import { Divider } from "@fluentui/react-components"
import { Button } from "@nextui-org/button"
import { Input } from "@nextui-org/input"
import { ChangeEvent, ReactElement, useEffect, useState } from "react"
import { timeOut } from "./utils/function_lib"
import { worker } from "@/types/worker"
import { beacon } from "@/types/beacon"
import axios, { AxiosResponse } from "axios"
import { Select, SelectItem, Spinner } from "@nextui-org/react"
import { CloseButton } from "react-bootstrap"


interface AWProps {
    tipo: "docente" | "guardia"
    token: string
}

export default function AddWorker(props: Readonly<AWProps>): ReactElement{
    //ATRIBUTOS
    const [nombre, setNombre] = useState<string>()
    const [rut, setRut] = useState<string>()
    const [email, setEmail] = useState<string>()
    const [celular, setCelular] = useState<string>()
    const [idBeacon, setIdBeacon] = useState<number>()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [success, setSuccess] = useState<boolean>(false)
    const [error, setError] = useState<Error>()
    const [beacons, setBeacons] = useState<beacon[]>()

    //METODOS
    
    const handleBeaconSelect = (e: ChangeEvent<HTMLSelectElement>) => {
        const id: number = Number(e.target.value)
        setIdBeacon(id)
    }

    const handleButton = (): void => {
        setIsLoading(true)
        if(nombre && rut && email && celular && idBeacon){
            const newWorker: Partial<worker> = {
                nombre,
                rut,
                email,
                celular,
                id_beacon: idBeacon
            }
            axios.post(`${import.meta.env.VITE_API_URL}/${props.tipo}`, newWorker, {
                headers: {
                    Authorization: `Bearer ${props.token}`
                }
            }).then( (res: AxiosResponse<worker>) => {
                console.log(res.data)
                setSuccess(true)
                setError(undefined)
                setIsLoading(false)
            } ).catch( (err: Error) => {
                setError(err)
                setSuccess(false)
                setIsLoading(false)
            } )
        } else {
            setError(new Error('Se deben llenar todos los campos...'))
        }
        
        timeOut( () => setIsLoading(false), 300 )
    }

    useEffect( () => {
        if(!beacons){
            axios.get(`${import.meta.env.VITE_API_URL}/beacon/free`, {
                headers: {
                    Authorization: `Bearer ${props.token}`
                }
            }).then( (res: AxiosResponse<beacon[]>) => {
                setBeacons(res.data)
            } )
        }
    }, [] )

    return(
        <div className="flex flex-col gap-6 min-w-[300px] min-h-[300px] max-w-[500px] border-double border-2 border-red-300 rounded-lg p-[15px] ">
            {
                success ?
                <div className="flex w-fit h-fit p-[10px] bg-green-300 border-double border-2 border-double border-yellow-300 rounded-lg">
                    <div className="flex justify-end">
                        <CloseButton onClick={ () => window.location.reload() } />
                    </div>
                    <p className="text-neutral-50" >
                        Éxito al guardar nuevo {props.tipo}
                    </p>
                </div>
                : error ?
                <div className="flex w-fit h-fit p-[10px] bg-red-300 border-double border-2 border-double border-yellow-300 rounded-lg">
                    <div className="flex justify-end">
                        <CloseButton onClick={ () => setError(undefined) } />
                    </div>
                    {error.message}
                </div>
                : isLoading ?
                <Spinner color="danger" size="sm"/>
                : null
            }
            <Input type="text" size="sm" label="Nombre" color="danger" placeholder="nombre apellido" onValueChange={setNombre}/>
            <Input type="text" size="sm" label="Rut" color="danger" placeholder="sin puntos y con guion" onValueChange={setRut}/>
            <Input type="email" size="sm" label="Email" color="danger" placeholder="ejemplo@mail.com" onValueChange={setEmail}/>
            <Input startContent={"+56"} size="sm" type="text" label="Celular" color="danger" placeholder="8 digitos" onValueChange={setCelular}/>
            { beacons ? <Select className="w-full" size="sm" color="danger" variant="bordered" selectionMode="single" label="Beacon" placeholder="Seleccionar beacon" onChange={handleBeaconSelect}>
                {
                    beacons.map( (b) => (
                        <SelectItem key={b.id}>
                            {b.mac}
                        </SelectItem>
                    ) )
                }
            </Select> : <Spinner color="danger" size="sm"/>}
            <Divider />
            <Button color="danger" variant="solid" size="sm" isLoading={isLoading} onClick={handleButton}>
                Agregar {props.tipo}
            </Button>
        </div>
    )
}