import { actionTypes } from "@/context/loginContext";
import { useAuthContext } from "./useLoginContext";
import { useNavigate } from "react-router-dom";

export const useLogout = () => {
    const {dispatch} = useAuthContext()
    const navegar = useNavigate()
    const logout = () => {
        dispatch({type: actionTypes.LOGOUT})
        navegar("/")
    }
    return {logout}
}