import * as React from 'react';
import {useState,useEffect} from "react"
import { useNavigation } from '@react-navigation/native';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, ActivityIndicator } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { Card } from 'react-native-paper';
import Constants from 'expo-constants'
import imageMap from './imageMap'

function MatchList(){


    const navigation = useNavigation()
    const [myData,setMyData] = useState()
    const [messages, setMessages] = useState()

    useEffect(() =>{
        fetch(`${Constants.expoConfig.extra.apiUrl}/matches`,{
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
            
                setMyData(json)
            }
            
            )
        .catch(error => console.error('There was a problem'))
        // .catch(error => {
        //     if error.status code == 400
        //         set error message value

        //     else 
        //         usenavigate to error page
        // }

            
        //     error.json())
        // .then(data => {
        //     if data.statusCode 
        // })
       
    }, [])

    if(myData == null){
        return (
            <View style={{justifyContent: 'center'}}>
                <ActivityIndicator size="large"/>
            </View>
        )
    }

    const matches = []
    for (let m in myData){
        matches.push([myData[m].username,myData[m].id])
    }

    return(
        <ScrollView contentContainerStyle={styles.container}>
            {matches.map((match,index) => (
                <TouchableOpacity key={index} onPress={() => navigation.navigate('Messages', {id: match[1]})}>
                <Card style={styles.card} >
                    <View style={{flexDirection: 'row'}}>
                        <TouchableOpacity key={index} onPress={() => navigation.navigate('MatchDetails', {id: match[1]})}>
                        <Image source={imageMap[match[1]]} style={styles.image} alt="User Profile Picture"/>
                        </TouchableOpacity>
                        <Text style={styles.text}>{match[0]}</Text>
                    </View>
                        {/* <Text></Text> */}
                </Card>
                </TouchableOpacity>
                ))}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 8,
    },
    card: {
      width: 370,
      height: 80,
      padding: 16,
      margin:4
    },
    image:{
        width: 50,
        height: 50,
        borderRadius: 50
    },
    text:{
        marginLeft: 15,
        fontSize: 16,
        fontWeight: 'bold'
    }
})

export default MatchList;