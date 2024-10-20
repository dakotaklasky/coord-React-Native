import * as React from 'react';
import {useState,useEffect} from "react"
import { useNavigation } from '@react-navigation/native';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { Card } from 'react-native-paper';

function Messages(){

    [myMessages,setMyMessages]

    useEffect(() =>{
        fetch("http://192.168.1.83:5555/messages",{
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
        .then(json => setMyMessages(json))
        .catch(error =>{console.error('There was a problem')})
       
    }, [])

}

export default Messages