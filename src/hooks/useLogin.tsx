import { useState } from "react";
import { useAuthContext } from "./useLoginContext";
import axios from "axios";
import * as jwt from 'jwt-decode'
import { actionTypes, User } from "@/context/loginContext";

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
            const payload: User = {
                token: response.token,
                page: '/home',
                data: jwt.jwtDecode(response.token)
            }
            console.log(payload)
            localStorage.setItem('userData', JSON.stringify(payload))
            dispatch({type: actionTypes.LOGIN, payload: payload})
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