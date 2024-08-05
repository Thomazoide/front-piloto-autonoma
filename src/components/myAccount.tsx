import { useAuthContext } from "@/hooks/useLoginContext";
import { Button, Input, Spinner } from "@nextui-org/react";
import { ReactElement, useState } from "react";

export default function MyAccount(): ReactElement{
    const {state} = useAuthContext()

    const [cambiarUsername, setCambiarUsername] = useState<boolean>(false)
    const [cambiarEmail, setCambiarEmail] = useState<boolean>(false)
    const [cambiarPass, setCambiarPass] = useState<boolean>(false)

    const [newUsername, setNewUsername] = useState<string>()
    const [isNewUsernameValid, setIsNewUsernameValid] = useState<boolean>(false)
    const [newEmail, setNewEmail] = useState<string>()
    const [isNewEmailValid, setIsNewEmailValid] = useState<boolean>(false)
    const [newPass, setNewPass] = useState<string>()
    const [newPassConfirm, setNewPassConfirm] = useState<string>()

    return(
        <div className="flex justify-center">
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
                    <Button color="danger" size="sm" variant="flat" onClick={() => setCambiarUsername(!cambiarUsername)}>
                        Cambiar nombre de usuario
                    </Button>
                    {
                        cambiarUsername ?
                        <>
                            <div>
                                <Input color="danger" variant="bordered" label="Nuevo nombre de usuario" placeholder="username123" endContent={
                                    <Button size="sm" color="danger" variant="solid" >
                                        Comprobar 
                                        <br/> 
                                        disponibilidad
                                        </Button> 
                                    } onValueChange={setNewUsername} />
                            </div>
                            <div className="flex justify-center" >
                                <Button size="sm" color="danger" variant="solid" isDisabled={ isNewUsernameValid ? false : true } >
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
                    <Button color="danger" size="sm" variant="flat" onClick={() => setCambiarEmail(!cambiarEmail)}>
                        Cambiar correo electrónico
                    </Button>
                    {
                        cambiarEmail ?
                        <>
                            <div>
                                <Input label="Nuevo correo electrónico" variant="bordered" color="danger" placeholder="ejemplo@correo.com" endContent={
                                    <Button size="sm" color="danger" variant="solid">
                                        Comprobar
                                        <br/>
                                        disponibilidad
                                    </Button>
                                } onValueChange={setNewEmail} />
                            </div>
                            <div className="flex justify-center" >
                                <Button color="danger" size="sm" variant="solid" isDisabled={ isNewEmailValid ? false : true }>
                                    Efectuar cambio
                                </Button>
                            </div>
                        </>
                        : null
                    }
                    <hr/>
                    <Button color="danger" size="sm" variant="flat" onClick={ () => setCambiarPass(!cambiarPass) } >
                        Cambiar contraseña
                    </Button>
                    {
                        cambiarPass ?
                        <>
                            <div className="flex flex-col items-center align-center p-[15px] ">
                                <Input label="Nueva contraseña" color="danger" variant="bordered" placeholder="****" onValueChange={setNewPass}/>
                                <hr/>
                                <Input label="Confirmar nueva contraseña" color="danger" variant="bordered" placeholder="****" onValueChange={setNewPassConfirm} />
                            </div>
                            <div className="flex justify-center" >
                                <Button color="danger" size="sm" variant="solid">
                                    Efectuar cambio
                                </Button>
                            </div>
                        </>
                        : null
                    }
                </div>
                : <Spinner color="danger"/>
            }
        </div>
    )
}