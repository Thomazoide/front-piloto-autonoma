import { createContext, Dispatch, ReactElement, ReactNode, useEffect, useReducer } from "react"
import axios from "axios"

export enum actionTypes {
    LOGIN = 'LOGIN',
    LOGOUT = 'LOGOUT',
    CHANGE_PAGE = 'PAGE'
}

interface State{
    user?: User | null
}

interface Action {
    type: actionTypes
    payload?: User
}

export interface User{
    data?: any
    token: string
    page: string
    mensaje?: string
}

const estadoInicial: State = {user: null}

const authReducer = (state: State, action: Action): State => {
    switch(action.type){
        case actionTypes.LOGIN:
            localStorage.setItem('userData', JSON.stringify(state.user))
            return {...state, user: action.payload}
        case actionTypes.LOGOUT:
            localStorage.clear()
            return estadoInicial
        case actionTypes.CHANGE_PAGE:
            localStorage.setItem('userData', JSON.stringify(state.user))
            return {...state, user: action.payload}
        default:
            return state
    }
}

export const AuthContext = createContext<{state: State; dispatch: Dispatch<Action>} | undefined>(undefined)

interface verifyResponse{
    isValid: boolean
}

interface verifyTokenRequest{
    token: string
}

async function verificarToken(payload: verifyTokenRequest): Promise<boolean>{
    const response: verifyResponse = (await axios.post(`${import.meta.env.VITE_API_URL}/auth/verify`, payload)).data
    return response.isValid
}

export const AuthContextProvider = ({children}: Readonly<{children: ReactNode}>): ReactElement => {
    const [state, dispatch] = useReducer(authReducer, estadoInicial)

    useEffect(() => {
        const userData: string | null = localStorage.getItem('userData')
        if(userData){
            const auxData: User = JSON.parse(userData)
            const request: verifyTokenRequest = {
                token: auxData.token
            }
            verificarToken(request).then( (isValid) => {
                if(isValid){
                    dispatch({type: actionTypes.LOGIN, payload: auxData})
                    console.log('SESION ACTIVA')
                } else {
                    localStorage.removeItem('userData')
                }
            } )
        }
    }, [])

    return(
        <AuthContext.Provider value={{state, dispatch}}>
            {children}
        </AuthContext.Provider>
    )
}