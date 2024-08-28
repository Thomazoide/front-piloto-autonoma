import { worker } from "@/types/worker";
import { Filter16Regular } from "@fluentui/react-icons";
import { Input } from "@nextui-org/input";
import { Button, ScrollShadow } from "@nextui-org/react";
import { useState, ReactElement, SetStateAction, Dispatch } from "react";

interface WLProps{
    workerList: worker[]
    setSelectedWorker: Dispatch<SetStateAction<worker | undefined>>
}

export default function WorkerList(props: Readonly<WLProps>): ReactElement{
    const [filterInput, setFilterInput] = useState<string>('')
    const [filteredWorkers, setFilteredWorkers] = useState<worker[]>(props.workerList)

    const handleFilter = function(e: string){
        setFilterInput(e)
        if(!e){
            setFilteredWorkers(props.workerList)
            setFilterInput('')
            return
        }
        setFilteredWorkers( filteredWorkers.filter( (w) => (w.nombre.toLowerCase().includes(e.toLowerCase()) || w.rut.includes(e) || w.email.toLowerCase().includes(e.toLowerCase())) ) )
    }

    return(
        <div className="flex flex-col gap-3 items-center w-[300px] h-fit p-[15px] border-2 border-double border-red-300 shadow-md rounded-xl ">
            <div className="flex justify-center w-full h-fit  ">
                <Input color="danger" variant="bordered" startContent={ <Filter16Regular/> } label="Filtrar datos" placeholder="nombre | rut | email" onValueChange={handleFilter}
                isClearable onClear={ () => {
                    setFilterInput('')
                    setFilteredWorkers(props.workerList)
                } } value={filterInput}/>
            </div>
            <div className="flex justify-center w-full h-fit ">
                <ScrollShadow className="flex flex-col items-center gap-2 max-h-[650px]" >
                    {
                        filteredWorkers.map( (w) => (
                            <Button className="w-full" key={w.id} color="danger" onClick={ () => props.setSelectedWorker(w) }>
                                {`${w.nombre} | ${w.rut}`}
                            </Button>
                        ) )
                    }
                </ScrollShadow>
            </div>
        </div>
    )
}