import { SymptomsContext } from "../context/SymptomContext";
import { useContext } from "react";

export const useSymptomsContext = () => {
    const context = useContext(SymptomsContext)
    if (!context){
        throw Error('useSymptomsContext must be used inside an SymptomsContextProvider')
    }
    return context
}