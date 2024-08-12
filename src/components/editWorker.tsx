import { ReactElement } from "react";
import { worker } from "@/types/worker";
import { Input } from "@nextui-org/input";

interface EWProps{
    tipo: 'guardia' | 'docente'
    token: string
    entity: worker
}

export default function EditWorker(props: Readonly<EWProps>): ReactElement{
    return(
        <div className="flex flex-col items-center w-fit h-fit p-[15px] " >
            <div className="flex justify-center">
                <Input color="danger" type="text" label="Nombre" placeholder={props.entity.nombre}/>
            </div>
        </div>
    )
}