import { useState, useEffect, ReactElement, ChangeEvent } from "react";
import { Button, Select, SelectItem, SelectSection, Spinner } from "@nextui-org/react"
import { GetAllSedes, GetWorkersByAltitude } from "@/components/utils/function_lib"
import { GeoJson, sede } from "@/types/sede";
import { useAuthContext } from "@/hooks/useLoginContext";
import MapComponent from "./mapComponent";
import { worker } from "@/types/worker";
import axios, { AxiosRequestConfig } from "axios";
import IconoGuardiaSVG from "../svgComponents/IconoGuardiaSVG";
import IconoDocentes from "../svgComponents/IconoDocentes";

export default function SedeMonitor(): ReactElement {
    const [sedes, setSedes] = useState<sede[]>()
    const [selectedSede, setSelectedSede] = useState<sede>()
    const { state } = useAuthContext()
    const [selectedFloor, setSelectedFloor] = useState<GeoJson<number[][][]>>()
    const [workerList, setWorkerList] = useState<worker[]>()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [workerType, setWorkerType] = useState<"guardia" | "docente">("guardia")

    async function getSedes() {
        if (state.user) {
            setIsLoading(true)
            setSedes(await GetAllSedes(state.user.token))
            setIsLoading(false)
        }
    }

    function handleSedeSelection(e: ChangeEvent<HTMLSelectElement>) {
        setSelectedFloor(undefined)
        const id: number = Number(e.target.value)
        const item: sede | undefined = sedes?.find((sede) => sede.id === id)
        setSelectedSede(item)
        GetWorkersByAltitude(state.user!.token, "guardia")
            .then((workers) => setWorkerList(workers))
    }

    function handleFloorSelection(e: ChangeEvent<HTMLSelectElement>) {
        console.log(e.target.value)
        if (!e.target.value) {
            setSelectedFloor(undefined)
            GetWorkersByAltitude(state.user!.token, "guardia")
                .then((workers) => setWorkerList(workers))
            return
        }
        const index: number = Number(e.target.value)
        if (index === -1) {
            setSelectedFloor(undefined)
            GetWorkersByAltitude(state.user!.token, "guardia")
                .then((workers) => setWorkerList(workers))
            return
        }
        if (selectedSede && selectedSede.plantas) {
            setSelectedFloor(selectedSede.plantas[index])
            GetWorkersByAltitude(state.user!.token, "guardia", index + 1)
                .then((workers) => setWorkerList(workers))
        }
    }

    useEffect(() => {
        getSedes()
        if (workerList) {
            const updateWorkersData = setInterval(() => {
                const CONFIG: AxiosRequestConfig = {
                    headers: {
                        Authorization: `Bearer ${state.user!.token}`
                    }
                }
                const ENDPOINT: string = `${import.meta.env.VITE_API_URL}/guardia/findOne`
                const updatedWorkers: worker[] = []
                try {
                    workerList.map((w) => {
                        axios.post<worker>(ENDPOINT, w, CONFIG)
                            .then((nw) => updatedWorkers.push(nw.data))
                    })
                    setWorkerList(updatedWorkers)
                } catch (err: any) {
                    console.log(err.message)
                }
            }, 5000)
            return () => clearInterval(updateWorkersData)
        }
    }, [])

    return (
        <div className="flex flex-col gap-3 items-center p-[15px] ">
            <div className="flex max-w-[800px] min-w-[380px] justify-center" >
                {
                    sedes && !isLoading ?
                        <Select color="danger" variant="underlined" size="lg" label="Seleccionar sede" onChange={handleSedeSelection} id="sede-select" >
                            <SelectSection>
                                {
                                    sedes.map((sede, index) => (
                                        <SelectItem id={String(index)} key={sede.id} value={index}>
                                            {sede.nombre}
                                        </SelectItem>
                                    ))
                                }
                            </SelectSection>
                        </Select>
                        : isLoading && <Spinner color="danger" label="Cargando..." />
                }
            </div>
            {
                selectedSede &&
                <div className="flex flex-row justify-between p-[15px] w-[800px] ">
                    <Button color="danger" variant="flat" value="guardia" startContent={
                        <IconoGuardiaSVG />
                    } onPress={() => setWorkerType("guardia")} >
                        Guardias
                    </Button>
                    <Button color="danger" variant="flat" value="docente" startContent={
                        <IconoDocentes />
                    } onPress={() => setWorkerType("docente")} >
                        Docentes
                    </Button>
                </div>
            }
            {selectedSede &&
                <div className="flex flex-col gap-3 p-[15px] items-center w-[800px] h-[800px] bg-default-300 bg-opacity-25 rounded-xl border-double border-2 border-danger-300 shadow-xl shadow-danger-200 ">
                    <div className="flex w-full justify-end ">
                        <Select id="plant-select" color="danger" variant="underlined" size="md" label="Seleccionar planta" defaultSelectedKeys={['-1']} onChange={handleFloorSelection}>
                            <SelectSection>
                                <SelectItem id="-1" key="-1" value="-1">
                                    Vista general
                                </SelectItem>
                            </SelectSection>
                            {selectedSede && selectedSede.plantas &&
                                <SelectSection>
                                    {
                                        selectedSede.plantas.map((planta, index) => (
                                            <SelectItem id={String(index)} textValue={`Piso ${index + 1}`} key={index} value={JSON.stringify(planta)}>
                                                Piso: {index + 1}
                                            </SelectItem>
                                        ))
                                    }
                                </SelectSection>
                            }
                        </Select>
                    </div>
                    <div className="flex justify-center" style={{ height: "750px", width: "750px" }} >
                        <MapComponent sede={selectedSede} workerType={workerType} planta={selectedFloor} workers={workerList} />
                    </div>
                </div>
            }
        </div>
    )
}