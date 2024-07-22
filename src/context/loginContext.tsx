import { createContext, Dispatch, ReactElement, ReactNode, useReducer } from "react"

enum actionTypes {
    LOGIN = 'LOGIN',
    LOGOUT = 'LOGOUT'
}

interface State{
    user?: User | null
}

interface Action {
    type: actionTypes
    payload?: User
}

interface User{
    token: string
}

const estadoInicial: State = {user: null}

const authReducer = (state: State, action: Action): State => {
    switch(action.type){
        case actionTypes.LOGIN:
            return {...state, user: action.payload}
        case actionTypes.LOGOUT:
            return {...state, user: null}
        default:
            return state
    }
}

export const AuthContext = createContext<{state: State; dispatch: Dispatch<Action>} | undefined>(undefined)

export const AuthContextProvider = ({children}: Readonly<{children: ReactNode}>): ReactElement => {
    const [state, dispatch] = useReducer(authReducer, estadoInicial)

    return(
        <AuthContext.Provider value={{state, dispatch}}>
            {children}
        </AuthContext.Provider>
    )
}