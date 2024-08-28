import { useState, useEffect, ReactElement, ChangeEvent, MouseEvent } from "react";
import ReactLeafletDriftMarker from 'react-leaflet-drift-marker';
import { worker } from "@/types/worker";
import { sala } from "@/types/sala";
import { useAuthContext } from "@/hooks/useLoginContext";
import axios, { AxiosRequestConfig } from "axios";
import { sede } from "@/types/sede";
import { Accordion, AccordionItem, Button, Select, SelectItem } from "@nextui-org/react";
import { BuildingRegular, ErrorCircle24Regular } from "@fluentui/react-icons";
import IconoDocentes from "./svgComponents/IconoDocentes";
import IconoGuardiaSVG from "./svgComponents/IconoGuardiaSVG";
import { isDateBetween } from "./utils/function_lib";
import moment from "moment";
import { MapContainer, TileLayer, GeoJSON, Popup } from "react-leaflet";
import { icon } from "leaflet";
import { ingreso } from "@/types/ingreso";
import IconoSalas from "./svgComponents/iconoSalas";

export default function NewDashboard(): ReactElement{
    const [sedes, setSedes] = useState<sede[]>()
    const [selectedSede, setSelectedSede] = useState<sede>()
    const [workers, setWorkers] = useState<worker[]>()
    const [salas, setSalas] = useState<sala[]>()
    const [workerType, setWorkerType] = useState<string>()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [mapCenter, setMapCenter] = useState<number[]>()
    const [mostrarSimbologia, setMostrarSimbologia] = useState<boolean>(false)
    const { state } = useAuthContext()

    const config: AxiosRequestConfig = {
        headers: {
            Authorization: `Bearer ${state.user?.token}`
        }
    }

    const SEDE_ENDPOINT: string = `${import.meta.env.VITE_API_URL}/sedes`
    const WORKER_ENDPOINT: string = `${import.meta.env.VITE_API_URL}`
    const SALA_ENDPOINT: string = `${import.meta.env.VITE_API_URL}/sala`
    const INGRESO_ENDPOINT: string = `${import.meta.env.VITE_API_URL}/ingreso`

    const fetchSedes = async function(){
        const sedesReq: sede[] = (await axios.get<sede[]>(SEDE_ENDPOINT, config)).data
        setSedes(sedesReq)
    }

    const fetchSalas = async function(dataSede?: sede){
        const salasReq: sala[] = (await axios.post<sala[]>(`${SALA_ENDPOINT}/sede`, dataSede ? dataSede : selectedSede, config)).data
        setSalas(salasReq)
    }

    const fetchWorkers = async function(dataWorker?: string){
        setIsLoading( !workers ? true : false)
        const workersReq: worker[] = (await axios.get<worker[]>(`${WORKER_ENDPOINT}/${ dataWorker ? dataWorker : workerType }`, config)).data
        workersReq.filter( (w) => (w.ubicacion && isDateBetween(new Date(w.ubicacion.locations[0].timestamp))) )
        const workersInSede: worker[] = []
        if(workersReq[0]){
            for(let w of workersReq){
                const ultimoIngreso: ingreso = (await axios.post<ingreso>(`${INGRESO_ENDPOINT}/${dataWorker ? dataWorker : workerType}/last`, w, config)).data
                const salaValida: sala | undefined = salas?.find( (s) => s.id_gateway === ultimoIngreso.id_gateway )
                if(salaValida){
                    workersInSede.push(w)
                }
            }
        }
        setWorkers(workersInSede)
        setIsLoading(false)
    }

    const handleSelect = function(e: ChangeEvent<HTMLSelectElement>){
        setSelectedSede(undefined)
        setWorkerType(undefined)
        if(!e.target.value){
            return
        }
        const tempSede: sede = JSON.parse(e.target.value)
        //@ts-ignore
        setMapCenter([tempSede.ubicacion.features[0].geometry.coordinates[1], tempSede.ubicacion.features[0].geometry.coordinates[0]])
        setSelectedSede(tempSede)
        fetchSalas(tempSede)
    }

    const handleWorkerSelection = function(e: MouseEvent<HTMLButtonElement>){
        setWorkerType(e.currentTarget.value)
        fetchWorkers(e.currentTarget.value)
    }

    const changeCenter = function(e: MouseEvent<HTMLButtonElement>){
        const value: string = e.currentTarget.value
        const latlng: number[] = [Number(value.split('_')[0]), Number(value.split('_')[1])]
        console.log(latlng)
        setMapCenter(latlng)
    }

    const workerIcon = icon({
        iconUrl: workerType === "guardia" ? 'https://hipic-vet-soft-backend.s3.us-west-1.amazonaws.com/autonoma/PeopleIcons-16-1024.webp' : 'https://hipic-vet-soft-backend.s3.us-west-1.amazonaws.com/autonoma/teacher-icon-png-11.jpg',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -34]
    })

    useEffect( () => {
        if(!sedes){
            fetchSedes()
        }
        if(workers && workerType){
            const refetchInterval = setInterval( () => fetchWorkers(), 5000 )
            console.log("REFETCH!")
            return () => clearInterval(refetchInterval)
        }
    }, [workers] )

    return(
        <div className="flex flex-col gap-3 items-center w-full" >
            <div className="flex justify-center w-[300px] ">
                { sedes &&
                    <Select label="Sedes" placeholder="Seleccionar sede" size="md" selectionMode="single" color="danger" variant="bordered" startContent={<BuildingRegular/>} onChange={handleSelect} >
                    {
                        sedes.map((sede) => (
                            <SelectItem color="danger" variant="light" key={JSON.stringify(sede)} value={JSON.stringify(sede)}>
                                {sede.nombre}
                            </SelectItem>
                        ))
                    }
                    </Select>
                }
            </div>
            { selectedSede &&
                <div className="flex justify-evenly w-full">
                    <Button color="danger" variant="flat" value="guardia" startContent={<IconoGuardiaSVG/>} isLoading={isLoading} onClick={handleWorkerSelection} >
                        Guardias
                    </Button>
                    <Button color="danger" variant="flat" value="docente" startContent={<IconoDocentes/>} isLoading={isLoading} onClick={handleWorkerSelection} >
                        Docentes
                    </Button>
                </div>
            }
            <div className="flex flex-wrap w-full h-full">
                {
                    workers && workers[0] && workerType &&
                    <div className="flex justify-center w-full" >
                        <Accordion selectedKeys="0" selectionMode="single" isCompact>
                            <AccordionItem className="flex flex-col gap-2 shadow-lg border-2 border-double border-red-300 rounded-lg p-[15px] " key="0" isCompact startContent={ workerType === "docente" ? <IconoDocentes/> : <IconoGuardiaSVG/> } title={ `${workerType}s` } >
                                <hr/>
                                <div className="flex flex-wrap p-[15px] gap-3">
                                    {
                                        workers.map( (w) => w.ubicacion && (
                                            <div key={w.id} className="flex flex-col items-center w-fit h-fit rounded-lg shadow-md border-solid border-red-300 border-1 p-[10px] ">
                                                <p>
                                                    <strong>
                                                        {w.nombre}
                                                    </strong>
                                                    <br/>
                                                    <small>
                                                    Ultimo ubicación detectada: {moment(new Date(w.ubicacion.locations[0].timestamp)).format("DD-MM-YYYY HH:mm:ss")}
                                                    </small>
                                                </p>
                                                    <Button size="sm" color="danger" variant="faded" value={w.ubicacion && `${w.ubicacion.locations[0].coords.latitude}_${w.ubicacion.locations[0].coords.longitude}`} onClick={changeCenter} >
                                                        Centrar en el mapa
                                                    </Button>
                                            </div>
                                        ) )
                                    }
                                </div>
                            </AccordionItem>
                        </Accordion>
                    </div>
                }
            </div>
            { selectedSede && workers && workerType && salas && mapCenter &&
            <div className="flex flex-col gap-3 items-center w-full h-[500px] p-[15px] border-solid border-3 border-red-300 rounded-lg shadow-md" key={mapCenter[0].toString()}>
                <div className="flex w-full justify-end">
                    <Button isIconOnly startContent={
                    <ErrorCircle24Regular/>
                    } color="danger" variant="flat" onClick={() => setMostrarSimbologia(!mostrarSimbologia)} />
                </div>
                {
                    mostrarSimbologia &&
                    <>
                    <div className="flex justify-center w-full h-fit">
                        <h5>Simbología</h5>
                    </div>
                    <div className="flex flex-wrap justify-evenly w-full h-fit">
                        <div className="flex flex-col items-center w-fit h-fit">
                            <div>
                                <IconoDocentes/>
                            </div>
                            <div>
                                <p>
                                    Docentes
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col items-center w-fit h-fit">
                            <div>
                                <IconoGuardiaSVG/>
                            </div>
                            <div>
                                <p>
                                    Guardias
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col items-center w-fit h-fit">
                            <div>
                                <IconoSalas/>
                            </div>
                            <div>
                                <p>
                                    Salas
                                </p>
                            </div>
                        </div>
                    </div>
                    </>
                }
                {/*@ts-ignore*/}
                <MapContainer center={ mapCenter } zoom={20} style={{ height: "100%", width: "100%" }} key={mapCenter[0].toString()} >
                <TileLayer 
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">Open StreetMap</a> contributors' />
                    <GeoJSON data={selectedSede.m2} style={{color: "red"}}/>
                    {
                        workers.map( (w) => w.ubicacion && (
                            <ReactLeafletDriftMarker duration={500} key={w.ubicacion.locations[0].coords.latitude.toString()} position={[w.ubicacion.locations[0].coords.latitude, w.ubicacion.locations[0].coords.longitude]} icon={workerIcon} >
                                <Popup closeButton>
                                    <strong> {w.nombre} </strong>
                                </Popup>
                            </ReactLeafletDriftMarker>
                        ) )
                    }
                </MapContainer>
            </div>
            }
        </div>
    )

}