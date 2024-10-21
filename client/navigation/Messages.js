import * as React from 'react';
import {useState,useEffect} from "react"
import { Text, ScrollView, StyleSheet,TextInput,View, KeyboardAvoidingView, TouchableOpacity} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { Card} from 'react-native-paper';
import Constants from 'expo-constants'

function Messages({route}){

    const {id} = route.params

    const [myMessages,setMyMessages] = useState()
    const [currentMessage, setCurrentMessage] = useState([])

    async function getMessages(id){
        await fetch(`${Constants.expoConfig.extra.apiUrl}/messages/${id}`,{
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
            setMyMessages(json)
        })
        .catch(error =>{console.error('There was a problem')})
    }

    useEffect(() => {
        getMessages(id)
    }, [id])

    if (!myMessages || !myMessages['msgs']) {
        return <Text>Loading...</Text>;  // Optionally, a loading state
    }

    function sendMessage(){
        fetch(`${Constants.expoConfig.extra.apiUrl}/messages/${id}`,{
            method: "POST",
            headers:{
                "Content-Type": "application/json",
                "Accept": 'application/json',
                "Authorization": SecureStore.getItem('username')
            },
            body: JSON.stringify({
                "user_id": SecureStore.getItem('username'),
                "messagee": id,
                "message": currentMessage,
                "time": (new Date()).toISOString().slice(0,-1)
            })
        }) 
        .then(response => {
            if (!response.ok){throw new Error('Network response not ok')}
            else{return response.json()}
        })
        .catch(error => error.json())
        .then(errorData => console.log(errorData))

        setCurrentMessage([])
    }


    return(
        <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset="150">
        <ScrollView>
        {(myMessages['msgs']).map((msg,index) => (
            <Card key={index} style={msg.sender == 'messager' ? styles.rightStyle : styles.leftStyle} >
            <Text>{msg.message}</Text>
            </Card>
        ))}
        <View style={styles.buttonContainer}>
            <TextInput value={currentMessage} style={styles.input} onChangeText={setCurrentMessage}></TextInput>
            <TouchableOpacity style={styles.button} onPress={sendMessage}>
                <Text style={styles.buttonText}>Send</Text>
            </TouchableOpacity>
        </View>
        </ScrollView>
        </KeyboardAvoidingView>
    )

}

const styles = StyleSheet.create({
    leftStyle:{
        width: '80%',
        borderColor: '#EAEAEA',
        backgroundColor: '#EAEAEA',
        padding: 10,
        margin: 1,
        alignSelf: 'flex-start'
    },
    rightStyle:{
        width: '80%',
        borderColor: '#007AFF',
        backgroundColor: '#007AFF',
        padding: 10,
        margin: 1,
        alignSelf: 'flex-end'
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        margin: 10,
        borderRadius: 5,
        width: '80%',
        alignSelf: 'flex-end'
      },
    buttonContainer: {
        flexDirection: 'row',
        alignSelf: 'flex-end'
    },
    button: {
        backgroundColor: '#007AFF', 
        borderRadius: 5,          
        padding: 10,
        height: 40,
        margin: 10             
      },
      buttonText: {
        color: '#fff',             
        fontSize: 16,              
        textAlign: 'center',        
      },
  });

export default Messages