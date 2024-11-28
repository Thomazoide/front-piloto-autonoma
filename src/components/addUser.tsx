import { user } from "@/types/user";
import { Eye16Regular } from "@fluentui/react-icons";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/react";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { ChangeEvent, ReactElement, useState } from "react";
import { CloseButton } from "react-bootstrap";

interface AUProps{
    token: string
}

export default function AddUser(props: Readonly<AUProps>): ReactElement{
    const [nombre, setNombre] = useState<string>()
    const [apellido, setApellido] = useState<string>()
    const [email, setEmail] = useState<string>()
    const [isAdmin, setIsAdmin] = useState<boolean>()
    const [password, setPassword] = useState<string>()
    const [usuario, setUsuario] = useState<user>()
    const [verPass, setVerPass] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [success, setSuccess] = useState<boolean>(false)
    const [error, setError] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>()

    const config: AxiosRequestConfig = {
        headers: {
            Authorzation: `${props.token}`
        }
    }

    const handleSubmit = () => {
        setIsLoading(true)
        if(!nombre && !email && !apellido && !password && (isAdmin === undefined)){
            setIsLoading(false)
            setError(true)
            setErrorMessage('Se deben llenar todos los campos...')
            setSuccess(false)
            return
        }
        const nuevoUsuario: Partial<user> = {
            nombre: `${nombre} ${apellido}`,
            email,
            password,
            isAdmin
        }
        axios.post(`${import.meta.env.VITE_API_URL}/user/registrar`, nuevoUsuario, config).then( (res: AxiosResponse<user>) => {
            console.log(res.statusText)
            setUsuario(res.data)
            setIsLoading(false)
            setSuccess(true)
            setError(false)
            setErrorMessage(undefined)
        } ).catch( (err: Error) => {
            setError(true)
            setErrorMessage(err.message)
            setSuccess(false)
            setIsLoading(false)
        } )
    }

    return(
        <div className="flex flex-col gap-2 items-center bg-white border-double border-2 border-red-300 rounded-xl shadow-xl p-[15px] w-[300px] h-fit" >
            {
                success && usuario ?
                <div className="flex flex-col w-fit h-fit p-[10px] bg-green-500 border-double border-2 border-yellow-300 rounded-xl">
                    <div className="flex justify-end">
                        <CloseButton onClick={() => window.location.reload()} />
                    </div>
                    <div className="flex justify-center">
                        <p className="text-neutral-50">
                            Éxito en la creación...
                            <br/>
                            Nombre de usuario: {usuario.username}
                        </p>
                    </div>
                </div>
                : error ?
                <div className="flex flex-col w-fit h-fit p-[10px] bg-red-500 border-double border-2 border-yellow-300 rounded-xl">
                    <div className="flex justify-end">
                        <CloseButton onClick={ () => {setError(false);setErrorMessage(undefined)} }/>
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
            <div className="flex justify-center w-[275px]">
                <Input type="text" color="danger" variant="flat" label="Nombre" size="sm" onValueChange={setNombre}/>
            </div>
            <div className="flex justify-center w-[275px]">
                <Input type="text" color="danger" variant='flat' label='Apellido' size='sm' onValueChange={setApellido}/>
            </div>
            <div className="flex justify-center w-[275px]">
                <Input type="email" color="danger" variant="flat" label="E-mail" size='sm' onValueChange={setEmail}/>
            </div>
            <div className="flex justify-center w-[275px]">
                <Select selectionMode="single" size="sm" color="danger" variant="flat" label="Administrador" onChange={(e: ChangeEvent<HTMLSelectElement>) => setIsAdmin(e.target.value === "1")} >
                    <SelectItem key="1" value="1">Si</SelectItem>
                    <SelectItem key="0" value="0">No</SelectItem>
                </Select>
            </div>
            <div className='flex justify-center w-[275px]'>
                <Input type={verPass ? 'text' : 'password'} color="danger" variant="flat" label="Contraseña" size="sm" onValueChange={setPassword} endContent={ <Button onClick={() => setVerPass(!verPass)} color="danger" variant="light" size="sm" isIconOnly>
                    <Eye16Regular/>
                </Button> }/>
            </div>
            <div className="flex justify-center">
                <Button color="danger" variant="solid" size="sm" isLoading={isLoading} onClick={handleSubmit}>
                    Crear
                </Button>
            </div>
        </div>
    )
}