import { Image } from "@fluentui/react-components"
import { KeyboardEvent, ReactElement, useEffect, useState } from "react"
import { Input } from "@nextui-org/input"
import { Button } from "@nextui-org/button"
import { loginPayload, useLogin } from "@/hooks/useLogin"
import { useAuthContext } from "@/hooks/useLoginContext"
import { NavigateFunction, useNavigate } from "react-router-dom"
import { Chip, Spinner } from "@nextui-org/react"

export default function Landing(): ReactElement{
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const {login, error, loading, successMessage} = useLogin()
    const {state} = useAuthContext()
    const navegar: NavigateFunction = useNavigate()
    const background: string = "https://hipic-vet-soft-backend.s3.us-west-1.amazonaws.com/autonoma/edificio-nuevo-providencia-autonoma-1.png"

    const handleSubmit = async (e: KeyboardEvent<HTMLButtonElement | HTMLInputElement>) => {
        
        if(e.code === "Enter"){
            handleLogin()
        }
    }

    const handleLogin = async () => {
        const payload: loginPayload = {
            username,
            password
        }
        await login(payload)
    }

    useEffect( () => {
        if(state.user){
            navegar(state.user.page)
        }
    }, [state] )

    return(
        <div className=" justify-center h-full" style={{
            backgroundImage: `url(${background})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            width: '100%',
            height: '100vh'
        }}>
            <div className="flex justify-center align-center items-center">
                <Image className="" src="https://hipic-vet-soft-backend.s3.us-west-1.amazonaws.com/autonoma/autonoma-logo.png" alt="logo-uautonoma" shadow shape="rounded"/>
            </div>
            <div className="w-full p-[15px]">
                <div className="flex justify-center">
                    <h3>Sistema de ingreso docentes/guardias</h3>
                </div>
            </div>
            <div className="flex justify-center">
                <div className="w-full  shadow-lg lg:ml-[250px] lg:mr-[250px] p-[15px] bg-zinc-300 flex flex-col border-solid border-2 border-red-300 rounded-lg">
                    <div className="flex justify-center">
                        <Input color="danger" onValueChange={setUsername} label="Nombre de usuario" placeholder="usuario" className="max-w-[1024px]"/>
                    </div>
                    <div className="flex justify-center mt-[15px] ">
                        <Input color="danger" onValueChange={setPassword} label="Contraseña" placeholder="******" type="password" className="max-w-[1024px]" onKeyDown={handleSubmit} />
                    </div>
                    <div className="flex justify-center">
                        <Button className="mt-[15px] " color="danger" onClick={handleLogin}>
                            Iniciar sesión
                        </Button>
                    </div>
                </div>
                
            </div>
            {
                error ?
                <div className="flex justify-center m-[15px] " >
                    <Chip size="lg" color="danger" variant="solid">
                        {error}
                    </Chip>
                </div>
                : loading ?
                <div className="flex justify-center m-[15px] " >
                    <Spinner color="danger" labelColor="warning" label="Comprobando datos..."/>
                </div>
                : successMessage ?
                <div className="flex justify-center m-[15px] " >
                    <Chip size="lg" color="success" variant="solid">
                        {successMessage}
                    </Chip>
                </div>
                : null
            }
        </div>
    )
}