import { createContext, Dispatch, ReactElement, ReactNode, useEffect, useReducer } from "react"

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

export const AuthContextProvider = ({children}: Readonly<{children: ReactNode}>): ReactElement => {
    const [state, dispatch] = useReducer(authReducer, estadoInicial)

    useEffect(() => {
        const userData = localStorage.getItem('userData')
        if(userData){
            dispatch({type: actionTypes.LOGIN, payload: JSON.parse(userData)})
            console.log('SESION ACTIVA')
        }
    }, [])

    return(
        <AuthContext.Provider value={{state, dispatch}}>
            {children}
        </AuthContext.Provider>
    )
}