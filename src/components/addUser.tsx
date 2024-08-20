import { Eye16Regular } from "@fluentui/react-icons";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/react";
import { AxiosRequestConfig } from "axios";
import { ChangeEvent, ReactElement, useState } from "react";

interface AUProps{
    token: string
}

export default function AddUser(props: Readonly<AUProps>): ReactElement{
    const [nombre, setNombre] = useState<string>()
    const [apellido, setApellido] = useState<string>()
    const [email, setEmail] = useState<string>()
    const [isAdmin, setIsAdmin] = useState<boolean>()
    const [password, setPassword] = useState<string>()
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
        
    }

    return(
        <div className="flex flex-col gap-2 items-center border-double border-2 border-red-300 rounded-xl shadow-xl p-[15px] w-[300px] h-fit" >
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
                <Button color="danger" variant="solid" size="sm" isLoading={isLoading}>
                    Crear
                </Button>
            </div>
        </div>
    )
}