import {useState} from "react"
import PreferenceOptionForm from "./PreferenceOptionForm"
import { ScrollView,Text, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants'

function Signup(){
    const [formData, setFormData] = useState({})
    const [userInfo, setUserInfo] = useState(true)
    
    function handleInputChange(name,value){
            setFormData((prevData) => ({
                ...prevData, [name]:value,
            }))  
    }

    function handleSubmit(event){
        event.preventDefault()

        fetch(`${Constants.expoConfig.extra.apiUrl}/signup`,{
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
                Alert.alert('Success', 'Sign up successful!')
            } else{
                Alert.alert('Fail', 'Sign up failed!')
                return Promise.reject(response)
            }
        })
        .catch(resp => console.log(resp))
    }

    function getDefaultValue(field){
        if(field == "Birthdate"){
            return (new Date()).toISOString().slice(0,10)
        }
    }

    return (
        <ScrollView>
            <PreferenceOptionForm handleSubmit={handleSubmit} handleInputChange={handleInputChange} getDefaultValue={getDefaultValue} userInfo={userInfo}></PreferenceOptionForm>
        </ScrollView>

)}

export default Signup;