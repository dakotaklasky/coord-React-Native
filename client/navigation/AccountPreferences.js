import * as React from 'react'
import {ScrollView, View, Text, ActivityIndicator, Alert} from 'react-native'
import * as SecureStore from 'expo-secure-store';
import {useState,useEffect} from "react"
import PreferenceOptionForm from "./PreferenceOptionForm"
import Constants from 'expo-constants'

//display and update user preferences
export default function AccountPreferences({navigation}){
    const [formData, setFormData] = useState([])
    const [userInfo,setUserInfo] = useState(false)

    useEffect( () => {
        fetch(`${Constants.expoConfig.extra.apiUrl}/mypreferences`,{
            method: "GET",
            headers:{
                "Content-Type": "application/json",
                "Accept": 'application/json',
                "Authorization": SecureStore.getItem('username')
            }
        })
        .then(response => {
            if (!response.ok){throw new Error('Network response not ok')}
            else{return response.json()}
        })
        .then(json => {
            if (json !== undefined){
                const formDict = {}
                for(const row in json){
                    if(json[row].length == 1){
                        formDict[row] = json[row]
                    }
                    else{
                        formDict[row] = json[row]
                    }
                }
                setFormData(formDict)
    }})
        .catch(error =>{console.error('There was a problem')})

    }, [])

    if (formData.length === 0){
        return (
            <View style={{justifyContent: 'center'}}>
                <ActivityIndicator size="large"/>
            </View>
        )
    }

    function getDefaultValue(field){
        if(field in formData){
            if(formData[field].length ==1)
                return formData[field][0]
            else{
                return formData[field]
            }
            }
    }

    function handleInputChange(name,value){
        if (Array.isArray(value)){
            setFormData((prevData) => ({
                ...prevData, [name]: value,
            }))
        }
        else{
            setFormData((prevData) => ({
                ...prevData, [name]: [value],
            }))
        }
    }

    function handleSubmit(event){
        console.log(formData)
        event.preventDefault()

        fetch(`${Constants.expoConfig.extra.apiUrl}/mypreferences`,{
            method: 'PATCH',
            headers:{
                'Content-Type':'application/json',
                "Accept": 'application/json',
                "Authorization": SecureStore.getItem('username')
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (response.ok){Alert.alert('Success', 'Preferences updated successfully!')}
            else{
                Alert.alert('Fail', 'Preferences update failed!')
                return Promise.reject(response)
            }
        })
        .catch(response => {console.error('There was a problem')})
    }

  return(
      <ScrollView contentContainerStyle={{paddingBottom: 60}}>
          <PreferenceOptionForm handleSubmit={handleSubmit} handleInputChange={handleInputChange} getDefaultValue={getDefaultValue} userInfo = {userInfo}/>
      </ScrollView>
  )
} 