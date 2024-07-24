import { useState } from "react";
import { useAuthContext } from "./useLoginContext";
import axios from "axios";
import * as jwt from 'jwt-decode'
import { actionTypes } from "@/context/loginContext";

interface responsePayload {
    data?: any
    token?: string
    mensaje: string
}

export interface loginPayload{
    username: string
    password: string
}

export const useLogin = () => {
    const [error, setError] = useState<Error | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const {dispatch} = useAuthContext()

    const login = async (payload: loginPayload) => {
        setLoading(true)
        setError(null)
        const response: responsePayload = (await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, payload)).data
        if(response.token){
            localStorage.setItem('userData', JSON.stringify(response))
            dispatch({type: actionTypes.LOGIN, payload: {
                token: response.token,
                data: jwt.jwtDecode(response.token)
            }})
            console.log('Sesion iniciada')
            setLoading(false)
        }else{
            setError(new Error(response.mensaje))
            setLoading(false)
            console.log('error')
        }
    }
    return {login, loading, error}
}