import { useAuthContext } from "@/hooks/useLoginContext";
import { MouseEvent, ReactElement, useEffect, useState } from "react";
import { user } from "@/types/user"
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { Button, Input, ScrollShadow } from "@nextui-org/react";
import { Delete24Regular, PersonEdit24Regular, PersonSearch20Regular } from "@fluentui/react-icons";
import { Divider } from "@fluentui/react-components";
import { CloseButton } from "react-bootstrap";
import EditUser from "./editUser";
import "@/styles/generic_styles.css"
import AddUser from "./addUser";


export default function ManageUsers(): ReactElement{

    const [usuarios, setUsuarios] = useState<user[]>()
    const [usuariosFiltrados, setUsuariosFiltrados] = useState<user[]>()
    const [selectedUser, setSelectedUser] = useState<user>()
    const [editarUsuario, setEditarUsuario] = useState<boolean>(false)
    const [crearUsuario, setCrearUsuario] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const {state} = useAuthContext()
    const config: AxiosRequestConfig = {
        headers: {
            Authorization: `Bearer ${state.user?.token}`
        }
    }

    const handleUserSelection = function(e: MouseEvent<HTMLButtonElement>){
        const usuario: user = JSON.parse(e.currentTarget.value)
        console.log(usuario)
        setSelectedUser(usuario)
    }

    const handleFilter = function(e: string){
        console.log(e)
        const filtro: user[] = usuarios ? usuarios?.filter( (u) => u.nombre.toLowerCase().includes(e) || u.email.toLowerCase().includes(e) || u.username.toLowerCase().includes(e) ) : []
        setUsuariosFiltrados(filtro)
    }

    const handleDelete = function(){
        setIsLoading(true)
        axios.delete(`${import.meta.env.VITE_API_URL}/user/delete`, {
            data: selectedUser,
            headers: {
                Authorization: `Bearer ${state.user?.token}`
            }
        }).then( (res: AxiosResponse) => {
            console.log(res)
            setSelectedUser(undefined)
            setIsLoading(false)
            setUsuarios(undefined)
        } ).catch( (err: Error) => {
            console.log(err)
            setIsLoading(false)
        } )
    }

    useEffect( () => {
        if(!usuarios){
            axios.get(`${import.meta.env.VITE_API_URL}/user`, config).then( (res: AxiosResponse<user[]>) => {
                setUsuarios(res.data)
                setUsuariosFiltrados(res.data)
            } )
        }
    }, [usuarios] )

    return (
        <div className="flex flex-wrap gap-4 justify-center" >
            <div className="flex flex-col items-center w-[300px] max-h-[500px] border-double border-red-300 border-2 rounded-lg shadow-lg">
                <div className=" mt-[10px] " >
                    <Input type="text" color="danger" variant="bordered" size="sm" startContent={ <PersonSearch20Regular/> } label="Filtrar" placeholder="Nombre | Email | Nombre de usuario" onValueChange={handleFilter} isClearable onClear={ () => setUsuariosFiltrados(usuarios) }/>
                </div>
                {
                    state.user && usuariosFiltrados && usuariosFiltrados[0] ?
                    <ScrollShadow className="flex flex-col gap-2 p-[10px] items-center float-top " >
                        {
                            usuariosFiltrados.map( (u) => {return state.user && u.id !== state.user.data?.id ? (
                                <Button key={u.id} className="w-[200px]" color="danger" variant="bordered" size="sm" value={JSON.stringify(u)} onClick={handleUserSelection} >
                                    {u.nombre}
                                </Button>
                            ) : null} )
                        }
                    </ScrollShadow>
                    : state.user && usuariosFiltrados && !usuariosFiltrados[0] ?
                    <div></div>
                    : null
                }
            </div>
            {
                selectedUser ?
                <div className="flex flex-col gap-2 items-center p-[10px] w-[300px] border-double border-red-300 border-2 rounded-lg shadow-lg overflow-y-scroll" >
                    <div className="flex w-full justify-evenly">
                        <Button isIconOnly color="danger" variant="flat" size="sm" onClick={ () => setEditarUsuario(!editarUsuario) } >
                            <PersonEdit24Regular/>
                        </Button>
                        <Button isIconOnly isLoading={isLoading} color="danger" variant="flat" size="sm" onClick={handleDelete} >
                            <Delete24Regular/>
                        </Button>
                        <Button isIconOnly color="danger" variant="flat" size="sm" onClick={() => setSelectedUser(undefined)} >
                            <CloseButton/>
                        </Button>
                    </div>
                    <Divider/>
                    <div className="flex flex-col w-full items-center">
                        <h4>
                            {
                                selectedUser.nombre
                            }
                        </h4>
                        <p>
                            Nombre de usuario: {selectedUser.username}
                        </p>
                        <p>
                            Email: {selectedUser.email}
                        </p>
                        <p>
                            Administrador: {selectedUser.isAdmin ? "Si" : "No"}
                        </p>
                    </div>
                    {
                        editarUsuario && state.user ?
                        <EditUser entity={selectedUser} token={state.user.token}/>
                        : null
                    }
                </div>
                : null
            }
            <div className="flex flex-col gap-2 items-center p-[10px] w-[300px]">
                <Button variant="solid" color="danger" size="sm" onClick={() => setCrearUsuario(!crearUsuario)}>
                    Crear usuario
                </Button>
                {
                    crearUsuario  && state.user ?
                    <AddUser token={state.user.token} />
                    : null
                }
            </div>
        </div>
    )
}