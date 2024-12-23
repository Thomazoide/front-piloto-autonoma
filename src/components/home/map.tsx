import { ChangeEvent, ReactElement, useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, Popup } from "react-leaflet";
import ReactleafletDriftMarker from 'react-leaflet-drift-marker'
import { GetAllSedes } from "../utils/function_lib";
import { worker } from "@/types/worker";
import { sede } from "@/types/sede";
import { Select, SelectItem, SelectSection, Spinner } from "@nextui-org/react";
import { Icon, LatLngExpression } from "leaflet";
import { FullscreenControl } from 'react-leaflet-fullscreen';
import "react-leaflet-fullscreen/styles.css";

interface mapProps{
    token: string
    workers: worker[]
}

export default function HomeMap(props: Readonly<mapProps>): ReactElement{

    const [sedes, setSedes] = useState<sede[]>()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [center, setCenter] = useState<LatLngExpression>()
    
    function getSedes(){
        setIsLoading(true)
        GetAllSedes(props.token).then( (res) => setSedes(res) )
        setIsLoading(false)
    }

    function changeCenter(e: ChangeEvent<HTMLSelectElement>){
        const selectedSede: sede = sedes!.filter( (sede) => sede.id === Number(e.target.value) )[0]
        const nuevoCentro: LatLngExpression = {
            lat: selectedSede.ubicacion.features[0].geometry.coordinates[1],
            lng: selectedSede.ubicacion.features[0].geometry.coordinates[0]
        }
        console.log(nuevoCentro)
        setCenter(nuevoCentro)
    }

    const DocenteIcon = new Icon({
        iconUrl: "https://storagejca.s3.sa-east-1.amazonaws.com/teacher-icon-png-11.webp",
        iconAnchor: [32, 16],
        iconSize: [32, 32]
    })

    useEffect( () => {
        !sedes && getSedes()
        sedes && setCenter({
            lat: sedes![0].ubicacion.features[0].geometry.coordinates[1],
            lng: sedes![0].ubicacion.features[0].geometry.coordinates[0]
        })

    }, [sedes] )

    return(
        <div className="flex flex-col gap-3 p-[10px] items-center w-full h-[800px] bg-white border-3 border-solid rounded-xl  ">
           {!isLoading && center && sedes ? 
           <>
           <div className="flex justify-center w-full">
                <Select label="sede" selectionMode="single" defaultSelectedKeys={["1"]} onChange={changeCenter} >
                    <SelectSection>
                    {
                        sedes.map( (sede) => (
                            <SelectItem accessKey={String(sede.id)} key={String(sede.id)} value={sede.id} >
                                {sede.nombre}
                            </SelectItem>
                        ) )
                    }
                    </SelectSection>
                </Select>
           </div>
           <MapContainer key={JSON.stringify(center)} center={center} zoom={20} style={{
                height: "100%",
                width: "100%"
            }} dragging={false} zoomControl={false} scrollWheelZoom={false} >
                <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'/>
                <FullscreenControl/>
                {
                    sedes.map( (sede, index) => (
                        <GeoJSON key={index+1} data={sede.m2}/>
                    ) )
                }
                {
                    props.workers.map( (w, index) => (
                        w.ubicacion && <ReactleafletDriftMarker key={index+1} icon={DocenteIcon} position={{lat: w.ubicacion.locations[0].coords.latitude, lng: w.ubicacion.locations[0].coords.longitude}} duration={1000}>
                            <Popup>
                                <p>
                                    {w.nombre}
                                    <br/>
                                </p>
                                <hr/>
                                <p>
                                    rut: {w.rut}
                                    <br/>
                                </p>
                                <hr/>
                                <p>
                                    email: {w.email}
                                    <br/>
                                </p>
                                <hr/>
                                <p>
                                    celular: {w.celular}
                                </p>
                            </Popup>
                        </ReactleafletDriftMarker>
                    ) )
                }
            </MapContainer>
            </> : isLoading && <Spinner color="danger" size="lg"/>}
        </div>
    )
}