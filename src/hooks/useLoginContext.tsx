import { AuthContext } from "@/context/loginContext";
import { useContext } from "react";

export const useAuthContext = () => {
    const context = useContext(AuthContext)
    if(!context){
        throw Error('useLoginContext debe ser usado dentro de <AuthContextProvider>...')
    }
    return context
}