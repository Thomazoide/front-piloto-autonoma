import { AxiosRequestConfig } from "axios";
import { ReactElement, useState } from "react";

interface AUProps{
    token: string
}

export default function AddUser(props: Readonly<AUProps>): ReactElement{
    const [nombre, setNombre] = useState<string>()
    const [email, setEmail] = useState<string>()
    const [isAdmin, setIsAdmin] = useState<boolean>()
    const [password, setPassword] = useState<string>()
    const [success, setSuccess] = useState<boolean>(false)
    const [error, setError] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>()

    const config: AxiosRequestConfig = {
        headers: {
            Authorzation: `${props.token}`
        }
    }

    return(
        <div></div>
    )
}