import { Context, createContext, Dispatch, FC, ReactNode, useReducer } from "react"


type estado = {
    isAuthenticated: boolean
    user?: {userId: string, token: string}
    token: string | null
}

type action = {
    type: authActionType
    payload?: {user: {userId: string, token: string}}
}

enum authActionType {
    LOGIN = 'LOGIN',
    LOGOUT = 'LOGOUT'
}

interface authContextType {
    state: estado
    dispatch: Dispatch<action>
}

const AuthContext: Context<authContextType | undefined> = createContext<authContextType | undefined>(undefined)

const authReducer = (state: estado, action: action): estado => {
    switch(action.type){
        case authActionType.LOGIN:
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload?.user
            }
        case authActionType.LOGOUT:
            return {
                ...state,
                isAuthenticated: false,
                user: undefined
            }
        default:
            return state
    }
}