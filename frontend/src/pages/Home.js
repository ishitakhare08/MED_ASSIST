import{ useEffect } from 'react'
import { useSymptomsContext } from '../hooks/useSymptomsContext'
import { useAuthContext } from '../hooks/useAuthContext'

//components
import SymptomDetails from '../components/SymptomDetails'
import SymptomForm from '../components/SymptomForm'

const Home=() =>{
    const {symptoms,dispatch} =useSymptomsContext()
    const { user } = useAuthContext()

    useEffect(() =>{
        const fetchSymptoms = async () => {
            const response = await fetch('/api/symptoms',{
                headers: {
                    'Authorization':`Bearer ${user.token}`
                }
            })
            const json = await response.json()
            if(response.ok){
                dispatch({type:'SET_SYMPTOMS',payload:json})                
            }
        }
        if( user ) {
            fetchSymptoms()
        }
        
    }, [dispatch, user])
    return(
        <div className="home">
            <div className='symptoms'>
              {symptoms && symptoms.map((symptom)=>(
                <SymptomDetails key ={symptom._id} symptom={symptom} />
              ))}  
            </div>
            <SymptomForm/>
        </div>
    )
}

export default Home