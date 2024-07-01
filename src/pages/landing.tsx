import { Image } from "react-bootstrap"
import { ReactElement, useState } from "react"
import { Input } from "@nextui-org/input"
import { Button } from "@nextui-org/button"

export default function Landing(): ReactElement{
    const [rut, setRut] = useState<string>()
    const [password, setPassword] = useState<string>()
    return(
        <div className=" justify-center h-full">
            <div className="flex justify-center align-center items-center">
                <Image src="https://hipic-vet-soft-backend.s3.us-west-1.amazonaws.com/autonoma/autonoma-logo.png" alt="logo-uautonoma" />
            </div>
            <div className="w-full p-[15px]">
                <div className="flex justify-center">
                    <h3>Sistema de ingreso docentes/guardias</h3>
                </div>
            </div>
            <div className="flex justify-center">
                <div className="w-full lg:ml-[250px] lg:mr-[250px] p-[15px] bg-zinc-300 flex flex-col border-solid border-2 border-red-300 rounded-lg">
                    <div className="flex justify-center">
                        <Input color="danger" onValueChange={setRut} label="Rut" placeholder="Rut sin puntos y con guion" className="max-w-[1024px]"/>
                    </div>
                    <div className="flex justify-center mt-[15px] ">
                        <Input color="danger" onValueChange={setPassword} label="Contraseña" placeholder="******" type="password" className="max-w-[1024px]"/>
                    </div>
                    <div className="flex justify-center">
                        <Button className="mt-[15px] " color="danger">
                            Iniciar sesión
                        </Button>
                    </div>
                </div>
            </div>
            
        </div>
    )
}