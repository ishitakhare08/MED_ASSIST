import { createContext, useReducer } from "react";

export const SymptomsContext = createContext()

export const symptomsReducer= (state,action) =>{
   switch(action.type){
    case 'SET_SYMPTOMS':
        return{
            symptoms:action.payload
        }
        case 'CREATE_SYMPTOM':
            return{
                symptoms:[action.payload, ...state.symptoms]
            }
        case 'DELETE_SYMPTOM':
            return{
                symptoms: state.symptoms.filter((s) =>s._id!==action.payload._id)
                }
        case 'UPDATE_SYMPTOM':
            return {
                symptoms: state.symptoms.map((symptom) =>
                        symptom._id === action.payload._id ? { ...symptom, ...action.payload } : symptom
                        )
                    }
        default:
            return state
   } 
}

export const SymptomsContextProvider =({ children }) =>{
    const [state,dispatch] =useReducer(symptomsReducer,{
         symptoms:null
    })

    return (
        <SymptomsContext.Provider value={{...state,dispatch}}>
            { children }
        </SymptomsContext.Provider>
    )
}