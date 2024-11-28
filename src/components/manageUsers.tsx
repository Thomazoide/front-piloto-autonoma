import { useAuthContext } from "@/hooks/useLoginContext";
import { MouseEvent, ReactElement, useEffect, useState } from "react";
import { user } from "@/types/user"
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { Button, Input, ScrollShadow, Spinner } from "@nextui-org/react";
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
    const [showDeleteQuestion, setShowDeleteQuestion] = useState<boolean>(false)
    const [errorDelete, setErrorDelete] = useState<Error>()
    const [isDeleting, setIsDeleting] = useState<boolean>(false)
    const [successDelete, setSuccessDelete] = useState<boolean>(false)

    const {state} = useAuthContext()
    const config: AxiosRequestConfig = {
        headers: {
            Authorization: `Bearer ${state.user?.token}`
        }
    }

    const DELETE_ENDPOINT: string = `${import.meta.env.VITE_API_URL}/user`

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

    const deleteUser = function(){
        setIsDeleting(true)
        axios.delete(DELETE_ENDPOINT, {
            ...config,
            data: selectedUser
        }).then( () => {
            setSuccessDelete(true)
            setErrorDelete(undefined)
        } ).catch( (e: Error) => {
            setSuccessDelete(false)
            setErrorDelete(e)
        } ).finally( () => {
            setIsDeleting(false)
        } )
        
    }

    const QuestionFrame = function(): ReactElement{
        return(
            <div className="m-[15px] p-[15px] w-fit h-fit bg-red-500 gap-1 border-solid border-1 border-yellow-300 text-center flex items-center align-center flex-col rounded-xl " >
                <div className="flex w-full h-fit justify-end ">
                    <CloseButton onClick={ () => window.location.reload() } />
                </div>
                <div className="w-full h-fit">
                    <p className="text-neutral-50">
                        ¿Seguro que desea eliminar este usuario?
                    </p>
                </div>
                <div className="w-full h-fit flex flex-row justify-between" >
                    <Button color="secondary" variant="solid" size="sm" onClick={ () => setShowDeleteQuestion(false) } isLoading={isDeleting} isDisabled={successDelete} >
                        Cancelar
                    </Button>
                    <Button color="warning" variant="solid" size="sm" onClick={deleteUser} isLoading={isDeleting} isDisabled={successDelete} >
                        Eliminar
                    </Button>
                </div>
                {
                    isDeleting &&
                    <div className="w-fit h-fit flex justify-center">
                        <Spinner color="danger" size="sm" label="Eliminando..."/>
                    </div>
                }
                {
                    errorDelete &&
                    <div className="flex justify-center text-center w-fit h-fit">
                        <p className="text-neutral-50">
                            {errorDelete.message}
                        </p>
                    </div>
                }
                {
                    successDelete &&
                    <div className="flex justify-center text-cente w-fit h-fit">
                        <strong className="text-neutral-50">
                            Usuario eliminado...
                        </strong>
                    </div>
                }
            </div>
        )
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
            <div className="flex flex-col items-center w-[300px] max-h-[500px] bg-white border-double border-red-300 border-2 rounded-lg shadow-lg">
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
                <div className="flex flex-col gap-2 items-center p-[10px] w-[300px] bg-white border-double border-red-300 border-2 rounded-lg shadow-lg overflow-y-scroll" >
                    <div className="flex w-full justify-evenly">
                        <Button isIconOnly color="danger" variant="flat" size="sm" onClick={ () => setEditarUsuario(!editarUsuario) } >
                            <PersonEdit24Regular/>
                        </Button>
                        <Button isIconOnly color="danger" variant="flat" size="sm" onClick={ () => setShowDeleteQuestion(!showDeleteQuestion) } >
                            <Delete24Regular/>
                        </Button>
                        <Button isIconOnly color="danger" variant="flat" size="sm" onClick={() => setSelectedUser(undefined)} >
                            <CloseButton/>
                        </Button>
                    </div>
                    <Divider/>
                    <div className="flex flex-col w-full items-center">
                        {
                            showDeleteQuestion &&
                            <QuestionFrame/>
                        }
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