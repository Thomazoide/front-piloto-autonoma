import { useAuthContext } from "@/hooks/useLoginContext";
import { Spinner } from "@nextui-org/react";
import { ReactElement } from "react";

export default function MyAccount(): ReactElement{
    const {state} = useAuthContext()
    return(
        <div className="flex justify-center">
            {
                state.user ?
                <div className="items-center flex flex-col gap-4">
                    <div>
                        <h3>
                            {
                                ` ${state.user.data.nombre}`
                            }
                        </h3>
                    </div>
                    <div>
                        <p>
                            <strong>
                                Nombre de usuario:
                            </strong>
                            {
                                ` ${state.user.data.username}`
                            }
                        </p>
                    </div>
                    <div>
                        <p>
                            <strong>
                                Correo electrónico: 
                            </strong>
                            {
                                state.user.data.email
                            }
                        </p>
                    </div>
                </div>
                : <Spinner color="danger"/>
            }
        </div>
    )
}