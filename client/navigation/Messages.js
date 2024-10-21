import * as React from 'react';
import {useState,useEffect} from "react"
import { Text, ScrollView, StyleSheet,TextInput,View, KeyboardAvoidingView, TouchableOpacity} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { Card} from 'react-native-paper';

function Messages({route}){

    const {id} = route.params

    const [myMessages,setMyMessages] = useState()
    const [newMessage, setNewMessage] = useState({})

    async function getMessages(id){
        await fetch(`http://192.168.1.83:5555/messages/${id}`,{
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

    function handleChange(id,value){
        setNewMessage({
            "user_id": SecureStore.getItem('username'),
            "messagee": id,
            "message": value,
            "time": (new Date()).toISOString()
        })
    }

    function sendMessage(){
        fetch(`http://192.168.1.83:5555/messages/${id}`,{
            method: "POST",
            headers:{
                "Content-Type": "application/json",
                "Accept": 'application/json',
                "Authorization": SecureStore.getItem('username')
            },
            body:{newMessage}
        }) 
        .then(response => {
            if (!response.ok){throw new Error('Network response not ok')}
            else{return response.json()}
        })
        .catch(error =>{console.error('There was a problem')})

        //call get messages?
    }


    return(
        <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset="145">
        <ScrollView>
        {(myMessages['msgs']).map((msg,index) => (
            <Card key={index} style={msg.sender == 'messager' ? styles.rightStyle : styles.leftStyle} >
            <Text>{msg.message}</Text>
            </Card>
        ))}
        <View style={styles.buttonContainer}>
        <TextInput style={styles.input} onChange={(value) => handleChange(id,value)}></TextInput>
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