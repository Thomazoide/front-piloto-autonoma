import { Divider } from "@fluentui/react-components"
import { Button } from "@nextui-org/button"
import { Input } from "@nextui-org/input"
import { ChangeEvent, ReactElement, useEffect, useState } from "react"
import { timeOut } from "./utils/function_lib"
import { worker } from "@/types/worker"
import { beacon } from "@/types/beacon"
import axios, { AxiosRequestConfig, AxiosResponse } from "axios"
import { Select, SelectItem, Spinner } from "@nextui-org/react"
import { CloseButton } from "react-bootstrap"
import { format } from 'rut.ts'
import validator from 'validator'


interface AWProps {
    tipo: "docente" | "guardia"
    token: string
}

export default function AddWorker(props: Readonly<AWProps>): ReactElement{
    //ATRIBUTOS
    const [nombre, setNombre] = useState<string>()
    const [apellido, setApellido] = useState<string>()
    const [rut, setRut] = useState<string>()
    const [email, setEmail] = useState<string>()
    const [celular, setCelular] = useState<string>()
    const [idBeacon, setIdBeacon] = useState<number>()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [success, setSuccess] = useState<boolean>(false)
    const [error, setError] = useState<Error>()
    const [beacons, setBeacons] = useState<beacon[]>()

    const CONFIG: AxiosRequestConfig = {
        headers: {
            Authorization: `Bearer ${props.token}`
        }
    }

    const ADD_WORKER_ENDPOINT: string = `${import.meta.env.VITE_API_URL}/${props.tipo}`
    const GET_FREE_BEACONS_ENDPOINT: string = `${import.meta.env.VITE_API_URL}/beacon/free`

    //METODOS
    
    const handleBeaconSelect = (e: ChangeEvent<HTMLSelectElement>) => {
        const id: number = Number(e.target.value)
        setIdBeacon(id)
    }

    const isFormDataValid = (): boolean => {
        if(nombre && apellido && rut && email && celular && idBeacon){
            if((validator.isAlpha(nombre, "es-ES") && validator.isAlpha(apellido, "es-ES")) && (format(rut, {dots: false})) && validator.isEmail(email) && (celular.length === 9 && validator.isNumeric(celular))){
                return true
            } else {
                setError(new Error("Debe ingresar datos validos"))
                return false
            }
        }
        return false
    }

    const handleButton = (): void => {
        setIsLoading(true)
        if((nombre && apellido && rut && email && celular && idBeacon)){
            const isValid: boolean = isFormDataValid()
            if(!isValid){
                setIsLoading(false)
                return
            }
            const newWorker: Partial<worker> = {
                nombre: `${nombre} ${apellido}`,
                rut,
                email,
                celular,
                id_beacon: idBeacon
            }
            axios.post(ADD_WORKER_ENDPOINT, newWorker, CONFIG).then( (res: AxiosResponse<worker>) => {
                console.log(res.data)
                setSuccess(true)
                setError(undefined)
                setIsLoading(false)
            } ).catch( (err: Error) => {
                setError(err)
                setSuccess(false)
                setIsLoading(false)
            } )
            console.log(isFormDataValid())
        } else {
            setError(new Error('Se deben llenar todos los campos...'))
        }
        
        timeOut( () => setIsLoading(false), 300 )
    }

    useEffect( () => {
        if(!beacons){
            axios.get(GET_FREE_BEACONS_ENDPOINT, CONFIG).then( (res: AxiosResponse<beacon[]>) => {
                setBeacons(res.data)
            } )
        }
    }, [] )

    return(
        <div className="flex flex-col gap-6 min-w-[300px] min-h-[300px] max-w-[500px] border-double border-2 border-red-300 rounded-lg p-[15px] ">
            {
                isLoading ?
                <Spinner color="danger" size="sm"/>
                : null
            }
            <Input type="text" size="sm" label="Nombre" color="danger" placeholder="nombre" onValueChange={setNombre}/>
            <Input type="text" size="sm" label="Apellido" color="danger" placeholder="apellido" onValueChange={setApellido}/>
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
            {
                success ?
                <div className="flex w-fit h-fit p-[10px] bg-green-300 border-2 border-double border-yellow-300 rounded-lg">
                    <div className="flex justify-end">
                        <CloseButton onClick={ () => window.location.reload() } />
                    </div>
                    <p className="text-neutral-50" >
                        Éxito al guardar nuevo {props.tipo}
                    </p>
                </div>
                : error ?
                <div className="flex w-fit h-fit p-[10px] bg-red-300 border-2 border-double border-yellow-300 rounded-lg">
                    <div className="flex justify-end">
                        <CloseButton onClick={ () => setError(undefined) } />
                    </div>
                    {error.message}
                </div>
                : null
            }
            <Button color="danger" variant="solid" size="sm" isLoading={isLoading} onClick={handleButton}>
                Agregar {props.tipo}
            </Button>
        </div>
    )
}