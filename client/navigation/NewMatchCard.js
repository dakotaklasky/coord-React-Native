import * as React from 'react';
import {useState,useEffect} from "react"
import { View, Text, Image, StyleSheet } from 'react-native';
import { Card, Button } from 'react-native-paper';
import GetUserId from './GetUserId'



function NewMatchCard(){

    const [username, setUsername] = useState(GetUserId())
    console.log(username)

    if (!username){
        return (
        <View>
            <Text>Please Login!</Text>
        </View>)
    }
    
    // useEffect(() =>{
    //         fetch("http://192.168.1.83:5555/new_match",{
    //         method: "GET",
    //         headers:{
    //             "Content-Type": "application/json",
    //             "Accept": 'application/json',
    //             "Authorization": username
    //         },
    //     }) 
    //     .then(response => {
    //         if (!response.ok){throw new Error('Network response not ok')}
    //         else{return response.json()}
    //     })
    //     .catch(error =>{console.error('There was a problem')})
    //     .then(json => {console.log(json)})

    // }, [])
    


    function handleDislike(){

    }

    function handleLike(){

    }


    return(
        <View style={styles.container}>
            <Card style={styles.card}>
                <Card.Content>
                    <Image
                        source={{uri: "https://dummyimage.com/753x721"}}
                        style={styles.image}
                        alt="User Profile Picture"/>
                    <Text style={styles.username}>{username}</Text>
                    <Text style={styles.bio}>Bio</Text>
                </Card.Content>
                <Card.Actions style={styles.actions}>
                    <Button style = {styles.button} icon="close" mode="outlined" onPress={handleDislike}/>
                    <View style={styles.spacer}></View>
                    <Button style = {styles.button} icon="heart" mode="contained" onPress={handleLike}/>
                     
                  
                </Card.Actions>
            </Card>
        </View>
     
    )

}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
    },
    card: {
      width: 350,
      height: 600,
      padding: 16,
      margin:16
    },
    image: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginBottom: 16,
    },
    username: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    bio: {
      fontSize: 16,
      marginBottom: 16,
    },
    attribute: {
      fontSize: 14,
      marginBottom: 8,
    },
    actions: {
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    spacer:{
        flex:1
    },
    button: {
        justifyContent: 'center'
    }
  });

export default NewMatchCard