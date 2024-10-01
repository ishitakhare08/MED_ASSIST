import { useAuthContext } from "./useAuthContext"
import { useSymptomsContext } from "./useSymptomsContext"

export const useLogout = () =>{
    const { dispatch } = useAuthContext()
    const { dispatch:symptomsDispatch } = useSymptomsContext()

    const logout =() =>{
        //remove user from storage
        localStorage.removeItem('user')

        //dispatch logout action
        dispatch({type: 'LOGOUT'})
        symptomsDispatch({type:'SET_SYMPTOMS',payload:null})
    }
    return {logout}

}