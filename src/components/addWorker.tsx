import { Divider } from "@fluentui/react-components"
import { Button } from "@nextui-org/button"
import { Input } from "@nextui-org/input"
import { ReactElement, useState } from "react"
import { timeOut } from "./utils/function_lib"


type AWProps = {
    tipo: "docente" | "guardia"
}

export default function AddWorker(props: Readonly<AWProps>): ReactElement{
    //ATRIBUTOS
    const [nombre, setNombre] = useState<string>()
    const [rut, setRut] = useState<string>()
    const [email, setEmail] = useState<string>()
    const [celular, setCelular] = useState<string>()
    const [mac, setMac] = useState<string>()
    const [isLoading, setIsLoading] = useState<boolean>(false)

    //METODOS
    const crearBeacon = async function(): Promise<void>{
    }

    const handleButton = (): void => {
        setIsLoading(true)
        timeOut( () => setIsLoading(false), 300 )
    }


    return(
        <div className="flex flex-col gap-6 min-w-[300px] min-h-[300px] max-w-[500px] border-double border-2 border-red-300 rounded-lg p-[15px] ">
            <Input type="text" label="Nombre" placeholder="nombre apellido" onValueChange={setNombre}/>
            <Input type="text" label="Rut" placeholder="sin puntos y con guion" onValueChange={setRut}/>
            <Input type="email" label="Email" placeholder="ejemplo@mail.com" onValueChange={setEmail}/>
            <Input startContent={"+56"} type="text" label="Celular" placeholder="8 digitos" onValueChange={setCelular}/>
            <Input type="text" label="MAC beacon" placeholder="Sin los puntos dobles y en mayusculas"onValueChange={setMac}/>
            <Divider />
            <Button color="danger" variant="solid" isLoading={isLoading} onClick={handleButton}>
                Agregar guardia
            </Button>
        </div>
    )
}