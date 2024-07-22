import { useState } from "react";
import { useAuthContext } from "./useLoginContext";
import axios from "axios";

export const useLogin = () => {
    const [error, setError] = useState<Error | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const {dispatch} = useAuthContext()

    //const login = function
}