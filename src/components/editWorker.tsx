import { ReactElement, useState } from "react";
import { worker } from "@/types/worker";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { CloseButton } from "react-bootstrap";
import { format, validate } from "rut.ts";
import { isEmail, isAlpha, isNumeric } from "validator";

interface EWProps{
    tipo: 'guardia' | 'docente'
    token: string
    entity: worker
}

export default function EditWorker(props: Readonly<EWProps>): ReactElement{

    const [nombre, setNombre] = useState<string>()
    const [rut, setRut] = useState<string>()
    const [email, setEmail] = useState<string>()
    const [celular, setCelular] = useState<string>()
    const [error, setError] = useState<boolean>(false)
    const [success, setSuccess] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>()

    const config: AxiosRequestConfig = {
        headers: {
            Authorization: `Bearer ${props.token}`
        }
    }

    const isFormDataValid = (): boolean => {
        const tempData = {
            nombre: nombre ? isAlpha(nombre, 'es-ES') : undefined,
            rut: rut && rut.split("-") && isNumeric(rut.split("-")[0]) && isNumeric(rut.split("-")[1]) ? (validate(format(rut, {dots: false}))) : undefined,
            email: email ? isEmail(email) : undefined,
            celular: celular ? isNumeric(celular) : undefined,
        }
        const keys = Object.values(tempData)
        for(let key of keys) {
            if(key !== undefined || key !== true) {
                setErrorMessage("Los campos a modificar deben ser validos")
                return false
            }
        } 
        return true
    }

    const handleSubmit = () => {
        setIsLoading(true)
        if(!nombre && !rut && !email && !celular){
            setErrorMessage("Se debe rellenar por lo menos un campo")
            setError(true)
            setIsLoading(false)
            return
        }
        const isValid: boolean = isFormDataValid()
        if(!isValid){
            setError(true)
            setIsLoading(false)
            return
        }
        axios.put(`${import.meta.env.VITE_API_URL}/${props.tipo}`, {
            id: props.entity.id,
            nombre,
            rut: rut ? format(rut, {dots: false}) : undefined,
            email,
            celular: celular ? `+56${celular}` : undefined
        }, config).then( (res: AxiosResponse) => {
            console.log(res.data)
            setSuccess(true)
            setIsLoading(false)
        } ).catch( (err: Error) => {
            setErrorMessage(err.message)
            setError(true)
            setIsLoading(false)
        } )
    }

    return(
        <div className="flex flex-col items-center gap-2 w-full h-fit p-[15px] " >
            <div className="flex justify-center max-w-[75%]">
                <Input color="danger" onValueChange={setNombre} variant="underlined" type="text" size="sm" label="Nombre" placeholder={props.entity.nombre}/>
            </div>
            <div className="flex justify-center max-w-[75%]">
                <Input color="danger" onValueChange={setRut} type="text" size="sm" variant="underlined" label="Rut" placeholder={props.entity.rut}/>
            </div>
            <div className="flex justify-center max-w-[75%]">
                <Input color="danger" onValueChange={setEmail} type="email" size="sm" variant="underlined" label="Email" placeholder={props.entity.email}/>
            </div>
            <div className="flex justify-center max-w-[75%]">
                <Input color="danger" onValueChange={setCelular} type="text" size="sm" variant="underlined" startContent="+56" label="Celular" placeholder={props.entity.celular.slice(3)}/>
            </div>
            {
                success ?
                <div className="flex flex-col gap-2 h-fit w-fit p-[10px] bg-green-500 border-double border-2 border-yellow-300 rounded-lg ">
                    <div className="flex justify-end">
                        <CloseButton onClick={() => setSuccess(false)}/>
                    </div>
                    <div className="flex justify-center">
                        <p className="text-neutral-50">
                            Datos modificados con éxito...
                        </p>
                    </div>
                </div>
                : error ?
                <div className="flex flex-col gap-2 h-fit w-fit p-[10px] bg-red-500 border-double border-2 border-yellow-300 rounded-lg ">
                    <div className="flex justify-end">
                        <CloseButton onClick={() => setError(false)}/>
                    </div>
                    <div className="flex justify-center">
                        <p className="text-neutral-50">
                            { errorMessage ? errorMessage : 'Error en la petición...'}
                        </p>
                    </div>
                </div>
                : null
            }
            <div className="flex justify-center">
                <Button isLoading={isLoading} variant="ghost" size="sm" color="danger" onClick={handleSubmit}>
                    Guardar cambios
                </Button>
            </div>
        </div>
    )
}