import {useState} from "react"
import PreferenceOptionForm from "./PreferenceOptionForm"
import { ScrollView,Text } from 'react-native';
import * as SecureStore from 'expo-secure-store';

function Signup(){
    const [error,setError] = useState()
    const [msg, setMsg] = useState()
    const [formData, setFormData] = useState({})
    const [userInfo, setUserInfo] = useState(true)
    
    function handleInputChange(name,value){
            setFormData((prevData) => ({
                ...prevData, [name]:value,
            }))  
    }

    function handleSubmit(event){
        event.preventDefault()

        fetch(`http://192.168.1.83:5555/signup`,{
            method: 'POST',
            headers:{
                'Content-Type':'application/json',
                "Accept": 'application/json',
                "Authorization": SecureStore.getItem('username')
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (response.ok){
                setMsg('Sign up successful!')
            } else{
                setMsg('Sign up failed!')
                return Promise.reject(response)
            }
        })
        .catch(response => response.json())
        .then(data => setError(data))
    }

    function getDefaultValue(){
     
    }

    return (
        <ScrollView>
            {msg ? <Text>{msg}</Text> : null}
            {error ? <Text>{error}</Text>: null}
            <PreferenceOptionForm handleSubmit={handleSubmit} handleInputChange={handleInputChange} getDefaultValue={getDefaultValue} userInfo={userInfo}></PreferenceOptionForm>
        </ScrollView>

)}

export default Signup;