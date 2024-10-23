import * as React from 'react'
import {View,Text, ScrollView, ActivityIndicator, Alert} from 'react-native'
import * as SecureStore from 'expo-secure-store';
import {useState,useEffect} from "react"
import PreferenceOptionForm from "./PreferenceOptionForm"
import Constants from 'expo-constants'

export default function EditProfile({navigation}){
    const [formData, setFormData] = useState([])
    const [userInfo, setUserInfo] = useState(true)

    useEffect(() =>{
        fetch(`${Constants.expoConfig.extra.apiUrl}/myaccount`,{
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
        .catch(error =>{console.error('There was a problem')})
        .then(json => {
            const formDict = {}

            formDict['username'] = json['username']
            formDict['image'] = json['image']
            formDict['bio'] = json['bio']

            for(const row in json['attributes']){
                formDict[json['attributes'][row].attribute_category] = json['attributes'][row].attribute_value
            }
            setFormData(formDict)
        })

    }, [])
    
    if (formData.length === 0){
        return (
            <View style={{justifyContent: 'center'}}>
                <ActivityIndicator size="large"/>
            </View>
        )
    }
        
        
    function handleInputChange(name, value){
            setFormData((prevData) => ({
                ...prevData, [name]:value,
            }))
    }

    function getDefaultValue(field){
        if(field in formData){
            return formData[field]
        }
    }
        
    function handleSubmit(event){
        event.preventDefault()

        fetch(`${Constants.expoConfig.extra.apiUrl}/myaccount`,{
            method: 'PATCH',
            headers:{
                'Content-Type':'application/json',
                "Accept": 'application/json',
                "Authorization": SecureStore.getItem('username')
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (response.ok){Alert.alert('Success', 'Profile updated successfully!')}
            else{
                Alert.alert('Fail', 'Profile update failed!')
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