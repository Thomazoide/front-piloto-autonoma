import { ReactElement, useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, Popup } from "react-leaflet";
import ReactleafletDriftMarker from 'react-leaflet-drift-marker'
import { GetAllSedes } from "../utils/function_lib";
import { worker } from "@/types/worker";
import { sede } from "@/types/sede";
import { Spinner } from "@nextui-org/react";
import { LatLngExpression } from "leaflet";

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

    function changeCenter(){
        return
    }

    useEffect( () => {
        !sedes && getSedes()
        sedes && setCenter({
            lat: sedes![0].ubicacion.features[0].geometry.coordinates[1],
            lng: sedes![0].ubicacion.features[0].geometry.coordinates[0]
        })

    }, [sedes] )

    return(
        <div className="flex justify-center w-full h-[800px] border-3 border-solid rounded-xl  ">
           {!isLoading && center && sedes ? <MapContainer center={center} zoom={20} style={{
                height: "100%",
                width: "100%"
            }}>
                <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'/>
                {
                    sedes.map( (sede) => (
                        <GeoJSON data={sede.m2}/>
                    ) )
                }
                {
                    props.workers.map( (w) => (
                        w.ubicacion && <ReactleafletDriftMarker position={{lat: w.ubicacion.locations[0].coords.latitude, lng: w.ubicacion.locations[0].coords.longitude}} duration={1000}>
                            <Popup>
                                <p>
                                    {w.nombre}
                                    <br/>
                                    <hr/>
                                    rut: {w.rut}
                                    <br/>
                                    <hr/>
                                    email: {w.email}
                                    <br/>
                                    <hr/>
                                    celular: {w.celular}
                                </p>
                            </Popup>
                        </ReactleafletDriftMarker>
                    ) )
                }
            </MapContainer> : isLoading && <Spinner color="danger" size="lg"/>}
        </div>
    )
}