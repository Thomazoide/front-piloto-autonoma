import { actionTypes } from "@/context/loginContext";
import { useAuthContext } from "./useLoginContext";

export const useLogout = () => {
    const {dispatch} = useAuthContext()
    const logout = () => {
        dispatch({type: actionTypes.LOGOUT})
    }
    return {logout}
}