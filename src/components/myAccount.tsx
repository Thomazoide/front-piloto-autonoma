import { useAuthContext } from "@/hooks/useLoginContext";
import { Button, Input, Spinner } from "@nextui-org/react";
import { ChangeEvent, ReactElement, useState } from "react";
import axios from "axios";
import { timeOut } from "./utils/function_lib";
import { CloseButton } from "react-bootstrap";
import { Divider } from "@fluentui/react-components";

interface verifyResponse{
    isValid: boolean
}

interface successResponse{
    success: boolean
    mensaje?: string
}

export default function MyAccount(): ReactElement{
    const {state} = useAuthContext()

    const [cambiarUsername, setCambiarUsername] = useState<boolean>(false)
    const [cambiarEmail, setCambiarEmail] = useState<boolean>(false)
    const [cambiarPass, setCambiarPass] = useState<boolean>(false)
    const [isChecking, setIsChecking] = useState<boolean>(false)
    const [isProcessing, setIsProcessing] = useState<boolean>(false)

    const [mensajeError, setMensajerror] = useState<string>()
    const [responseError, setResponseError] = useState<string>()
    const [successMessage, setSuccessMessage] = useState<string>()

    const [newUsername, setNewUsername] = useState<string>()
    const [isNewUsernameValid, setIsNewUsernameValid] = useState<boolean>(false)
    const [newEmail, setNewEmail] = useState<string>()
    const [isNewEmailValid, setIsNewEmailValid] = useState<boolean>(false)
    const [newPass, setNewPass] = useState<string>()
    const [newPassConfirm, setNewPassConfirm] = useState<string>()
    const [passIsValid, setPassIsValid] = useState<boolean>(false)

    const verCuadroUsername = () => {
        setCambiarUsername(!cambiarUsername)
        setMensajerror(undefined)
        setIsNewUsernameValid(false)
    }

    const verCuadroEmail = () => {
        setCambiarEmail(!cambiarEmail)
        setMensajerror(undefined)
        setIsNewEmailValid(false)
    }

    const verCuadroPass = () => {
        setCambiarPass(!cambiarPass)
        setMensajerror(undefined)
        setPassIsValid(false)
    }

    const verificarUsername = async () => {
        setIsChecking(true)
        if(newUsername){
            const isValid: verifyResponse = (await axios.post(`${import.meta.env.VITE_API_URL}/user/checkusername`, {
                username: newUsername
            }, {
                headers: {
                    Authorization: `Bearer ${state.user?.token}`
                }
            })).data
            if(isValid.isValid){
                setMensajerror(undefined)
                setIsNewUsernameValid(true)
            } else {
                setMensajerror("Nombre de usuario no disponible")
                setIsNewUsernameValid(false)
            }
        }
        timeOut( () => setIsChecking(false), 300 )
    }

    const verificarEmail = async () => {
        setIsChecking(true)
        if(newEmail){
            const isValid: verifyResponse = (await axios.post(`${import.meta.env.VITE_API_URL}/user/checkemail`, {
                email: newEmail
            }, {
                headers: {
                    Authorization: `Bearer ${state.user?.token}`
                }
            })).data
            if(isValid.isValid){
                setMensajerror(undefined)
                setIsNewEmailValid(true)
            } else {
                setMensajerror("Email no disponible")
                setIsNewEmailValid(false)
            }
        }
        timeOut( () => setIsChecking(false), 300 )
    }

    const verificarPass = (e: ChangeEvent<HTMLInputElement>) => {
        const valorInput = e.target.value
        if(newPass && newPassConfirm){
            if(newPass === valorInput){
                setPassIsValid(true)
                setMensajerror(undefined)
            } else {
                setPassIsValid(false)
                setMensajerror("Las contraseñas deben ser idénticas")
            }
        }
    }

    const efectuarCambio = async (tipo: string) => {
        setIsProcessing(true)
        if(tipo === "username"){
            const response: successResponse = (await axios.post(`${import.meta.env.VITE_API_URL}/user/update`, {
                id: state.user?.data?.id,
                username: newUsername
            }, {
                headers: {
                    Authorization: `Bearer ${state.user?.token}`
                }
            })).data
            if(response.success){
                setResponseError(undefined)
                setSuccessMessage("Cambio realizado!\nVuelve a iniciar sesión para ver reflejados los cambios")
            } else {
                setSuccessMessage(undefined)
                setResponseError("Error al cambiar nombre de usuario!\nInicia sesión nuevamente e intentalo otra vez")
            }
        }
        if(tipo === "email"){
            const response: successResponse = (await axios.post(`${import.meta.env.VITE_API_URL}/user/update`, {
                id: state.user?.data?.id,
                email: newEmail
            }, {
                headers: {
                    Authorization: `Bearer ${state.user?.token}`
                }
            })).data
            if(response.success){
                setResponseError(undefined)
                setSuccessMessage("Cambio realizado!\nVuelve a iniciar sesión para ver reflejados los cambios")
            } else {
                setSuccessMessage(undefined)
                setResponseError("Error al cambiar email!\nInicia sesión nuevamente e intentalo otra vez")
            }
        }
        if(tipo === "password"){
            const response: successResponse = (await axios.post(`${import.meta.env.VITE_API_URL}/user/updatepass`, {
                id: state.user?.data?.id,
                password: newPass
            }, {
                headers: {

                    Authorization: `Bearer ${state.user?.token}`
                }
            })).data
            if(response.success){
                setResponseError(undefined)
                setSuccessMessage("Vuelve a iniciar sesión para ver reflejados los cambios")
            } else {
                setSuccessMessage(undefined)
                setResponseError(response.mensaje ? response.mensaje : "Inicia sesión nuevamente e intentalo otra vez")
            }
        }
        timeOut( () => setIsProcessing(false), 400 )
    }

    return(
        <div className="flex flex-wrap gap-3 justify-center align-center items-center">
            {
                state.user ?
                <div className="flex flex-col gap-2 border-double rounded-lg border-3 border-red-300 p-[15px] ">
                    <div className="flex justify-center" >
                        <h3>
                            {
                                `${state.user.data.nombre}`
                            }
                        </h3>
                    </div>
                    <hr/>
                    <div className="flex justify-start" >
                        <p>
                            <strong>
                                Nombre de usuario:
                            </strong>
                            {
                                ` ${state.user.data.username}`
                            }
                        </p>
                    </div>
                    <Button color="danger" size="sm" variant="flat" onClick={verCuadroUsername}>
                        Cambiar nombre de usuario
                    </Button>
                    {
                        cambiarUsername ?
                        <>
                            <div>
                                <Input color="danger" variant="bordered" label="Nuevo nombre de usuario" placeholder="username123" endContent={
                                    <Button size="sm" color="danger" variant="solid" onClick={verificarUsername} isLoading={isChecking} >
                                        Comprobar 
                                        <br/> 
                                        disponibilidad
                                        </Button> 
                                    } onValueChange={setNewUsername} isInvalid={ mensajeError ? true : false } errorMessage={mensajeError} />
                            </div>
                            <div className="flex justify-center" >
                                <Button size="sm" color="danger" variant="solid" isLoading={isProcessing} isDisabled={ isNewUsernameValid ? false : true } onClick={() => efectuarCambio("username")} >
                                    Efectuar cambio
                                </Button>
                            </div>
                        </>
                        : null
                    }
                    <hr/>
                    <div>
                        <p>
                            <strong>
                                Correo electrónico: 
                            </strong>
                            {
                                ` ${state.user.data.email}`
                            }
                        </p>
                    </div>
                    <Button color="danger" size="sm" variant="flat" onClick={verCuadroEmail}>
                        Cambiar correo electrónico
                    </Button>
                    {
                        cambiarEmail ?
                        <>
                            <div>
                                <Input label="Nuevo correo electrónico" type="email" variant="bordered" color="danger" placeholder="ejemplo@correo.com" endContent={
                                    <Button size="sm" color="danger" variant="solid" isLoading={isChecking} onClick={verificarEmail}>
                                        Comprobar
                                        <br/>
                                        disponibilidad
                                    </Button>
                                } onValueChange={setNewEmail} isInvalid={ mensajeError ? true : false } errorMessage={mensajeError} />
                            </div>
                            <div className="flex justify-center" >
                                <Button color="danger" size="sm" variant="solid" isLoading={isProcessing} isDisabled={ isNewEmailValid ? false : true } onClick={ () => efectuarCambio("email") }>
                                    Efectuar cambio
                                </Button>
                            </div>
                        </>
                        : null
                    }
                    <hr/>
                    <Button color="danger" size="sm" variant="flat" onClick={verCuadroPass} >
                        Cambiar contraseña
                    </Button>
                    {
                        cambiarPass ?
                        <>
                            <div className="flex flex-col items-center align-center p-[15px] ">
                                <Input label="Nueva contraseña" type="password" color="danger" variant="bordered" placeholder="****" onValueChange={setNewPass}/>
                                <hr/>
                                <Input label="Confirmar nueva contraseña" type="password" color="danger" variant="bordered" placeholder="****" onValueChange={setNewPassConfirm} isInvalid={mensajeError ? true : false} errorMessage={mensajeError} onChange={(e) => verificarPass(e)} />
                            </div>
                            <div className="flex justify-center" >
                                <Button color="danger" size="sm" variant="solid" isLoading={isProcessing} isDisabled={passIsValid ? false : true} onClick={ () => efectuarCambio("password") }>
                                    Efectuar cambio
                                </Button>
                            </div>
                        </>
                        : null
                    }
                </div>
                : <Spinner color="danger"/>
            }
            {
                successMessage ?
                <div className="p-[5px] flex flex-col items-center h-fit w-fit rounded-lg border-solid border-2 border-yellow-300 bg-green-500" >
                    <div className=" w-full flex justify-between " >
                        <p className="text-neutral-50 font-bold" > Éxito en la operación </p>
                        <CloseButton onClick={ () => setSuccessMessage(undefined) } />
                    </div>
                    <Divider/>
                    <div>
                        <p className="text-neutral-50 font-bold" >
                            {
                                successMessage
                            }
                        </p>
                    </div>
                </div>
                : responseError ?
                <div className="p-[5px] flex flex-col items-center h-fit w-fit rounded-lg border-solid border-2 border-yellow-300 bg-red-500" >
                    <div className=" w-full flex justify-between " >
                        <p className="text-neutral-50 font-bold" > Error en la operación </p>
                        <CloseButton onClick={ () => setResponseError(undefined) } />
                    </div>
                    <Divider/>
                    <div className="pt-[5px] " >
                        <p className="text-neutral-50 font-bold">
                            {
                                responseError
                            }
                        </p>
                    </div>
                </div>
                : null
            }
        </div>
    )
}