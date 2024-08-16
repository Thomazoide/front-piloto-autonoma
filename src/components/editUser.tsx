import { user } from "@/types/user"
import { Input } from "@nextui-org/input"
import { Button, Select, SelectItem } from "@nextui-org/react"
import axios, { AxiosRequestConfig, AxiosResponse } from "axios"
import { ChangeEvent, ReactElement, useState } from "react"
import { CloseButton } from "react-bootstrap"


interface EUProps{
    token: string
    entity: user
}

export default function EditUser(props: Readonly<EUProps>): ReactElement{
    const [nombre, setNombre] = useState<string>()
    const [username, setUsername] = useState<string>()
    const [email, setEmail] = useState<string>()
    const [errorMessage, setErrorMessage] = useState<string>()
    const [success, setSuccess] = useState<boolean>(false)
    const [error, setError] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isAdmin, setIsAdmin] = useState<boolean>()
    
    const config: AxiosRequestConfig = {
        headers: {
            Authorization: `Bearer ${props.token}`
        }
    }

    const handleOptionSelect = function(e: ChangeEvent<HTMLSelectElement>){
        setIsAdmin( e.target.value === "1" ? true : false )
    }

    const handleSubmit = function(){
        setIsLoading(true)
        if(!nombre && !username && !email && isAdmin === undefined ){
            setError(true)
            setSuccess(false)
            setErrorMessage("Se debe llenar al menos un campo...")
            setIsLoading(false)
            return
        }
        const usuarioActualizado: Partial<user> = {
            id: props.entity.id,
            nombre,
            email,
            username,
            isAdmin
        }
        axios.post(`${import.meta.env.VITE_API_URL}/user/update`, usuarioActualizado, config).then( (res: AxiosResponse) => {
            console.log(res)
            setSuccess(true)
            setIsLoading(false)
            setError(false)
            setErrorMessage(undefined)
        } ).catch( (err: Error) => {
            setSuccess(false)
            setIsLoading(false)
            setErrorMessage(err.message)
            setError(true)
        } )
    }

    return (
        <div className="flex flex-col gap-3 p-[10px] items-center w-full h-fit" >
            {
                success ?
                <div className="flex flex-col items-center w-fit h-fit bg-green-500 p-[10px] border-double border-2 border-yellow-300 rounded-lg ">
                    <div className="flex justify-end w-full">
                        <CloseButton onClick={() => window.location.reload() } />
                    </div>
                    <div className="flex justify-center">
                        <p className="text-neutral-50">
                            Éxito en la petición...
                        </p>
                    </div>
                </div>
                : error ?
                <div className="flex flex-col items-center w-fit h-fit bg-red-500 p-[10px] border-double border-2 border-yellow-300 rounded-lg ">
                    <div className="flex justify-end w-full">
                        <CloseButton onClick={() => setError(!error)} />
                    </div>
                    <div className="flex justify-center">
                        <p className="text-neutral-50">
                            {
                                errorMessage ? errorMessage : "Error en la petición..."
                            }
                        </p>
                    </div>
                </div>
                : null
            }
            <div className="flex justify-center" >
                <Input type="text" color="danger" variant="underlined" onValueChange={setNombre} label="Nombre" placeholder={props.entity.nombre}/>
            </div>
            <div className="flex justify-center" >
                <Input type="text" color="danger" variant="underlined" onValueChange={setUsername} label="Nombre de usuario" placeholder={props.entity.username}/>
            </div>
            <div className="flex justify-center" >
                <Input type="text" color="danger" variant="underlined" onValueChange={setEmail} label="E-mail" placeholder={props.entity.email}/>
            </div>
            <div className="flex justify-center">
                <Select className="w-[200px]" selectionMode="single" label="Administrador" size="sm" color="danger" variant="bordered" onChange={handleOptionSelect}>
                    <SelectItem key={"1"} value="1">
                        Si
                    </SelectItem>
                    <SelectItem key={"0"} value="0">
                        No
                    </SelectItem>
                </Select>
            </div>
            <div className="flex justify-center">
                <Button variant="flat" color="danger" size="sm" onClick={handleSubmit} isLoading={isLoading}>
                    Modificar
                </Button>
            </div>
        </div>
    )
}