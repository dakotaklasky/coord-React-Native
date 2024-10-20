import * as React from 'react';
import {useState,useEffect} from "react"
import { useNavigation } from '@react-navigation/native';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { Card } from 'react-native-paper';


function MatchList(){

    const navigation = useNavigation()
    const [myData,setMyData] = useState()
    const [messages, setMessages] = useState()

    useEffect(() =>{
        fetch("http://192.168.1.83:5555/matches",{
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
                // const last
                // for(const row in json){
                //     messageDict[row.messagee] = {
                //         message: row.message,
                //         time: row.time
                //     }
                // }
                // setMessages(messageDict)

            }
            
            )
        .catch(error =>{console.error('There was a problem')})
       
    }, [])

    if(myData == null){
        return (
            <View>
                <Text>Please login!</Text>
            </View>
        )
    }

    const matches = []
    for (let m in myData){
        matches.push([myData[m].username,myData[m].id,myData[m].image])
    }

    // console.log(myData[0]['messages'])

    return(
        <ScrollView contentContainerStyle={styles.container}>
            {matches.map((match,index) => (
                <Card style={styles.card} key={index}>
                    <View style={{flexDirection: 'row'}}>
                        <TouchableOpacity key={index} onPress={() => navigation.navigate('MatchDetails', {id: match[1]})}>
                        <Image source={{uri: match[2]}} style={styles.image} alt="User Profile Picture"/>
                        </TouchableOpacity>
                        <Text style={styles.text}>{match[0]}</Text>
                    </View>
                        {/* <Text></Text> */}
                </Card>
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