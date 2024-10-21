import * as React from 'react';
import {useState,useEffect} from "react"
import { ScrollView, RefreshControl, View, Text, Image, StyleSheet } from 'react-native';
import { Card, Button } from 'react-native-paper';
import * as SecureStore from 'expo-secure-store';
import Ionicons from 'react-native-vector-icons/Ionicons'
import Constants from 'expo-constants'

function NewMatchCard(){

    const [username,setUsername] = useState()
    // const [refreshing, setRefreshing] = useState(false)
    const [user, setUser] = useState([])
    const [userAttributeDict, setUserAttributeDict] = useState([])

    // const onRefresh = () => {
    //     setRefreshing(true);
    //     if (SecureStore.getItem('username')){
    //         setUsername(SecureStore.getItem('username'))
    //     }
    //     setTimeout(() => {
    //       setRefreshing(false); // End refresh after the task is done
    //     }, 2000);
    //   };
    
    useEffect(() =>{

        if (SecureStore.getItem('username')){
            setUsername(SecureStore.getItem('username'))
        }

        fetch((`${Constants.expoConfig.extra.apiUrl}/new_match`),{
        method: "GET",
        headers:{
            "Content-Type": "application/json",
            "Accept": 'application/json',
            "Authorization": SecureStore.getItem('username')
        },
        })
        .then(response => {
            if (!response.ok){throw new Error('Network response not ok')}
            else{return response.json()}
        })
        .then(json => {
            setUser(json)
            const attribute_dict = {}
            for(const row in json.attributes)
                attribute_dict[json.attributes[row].attribute_category] = json.attributes[row].attribute_value
            
            setUserAttributeDict(attribute_dict)
        })
        .catch(error =>{console.error('There was a problem')})


    }, [])


    if (SecureStore.getItem('username') === null){
        return (
            <View>
        {/* // <View refreshControl={
        //     <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
        // }> */}
            <Text>Please Login!</Text>
        </View>)
    }

    
    if(user.no_users){
        return (
            // <View refreshControl={
            //     <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
            // }>
            <View>
                <Text>You went through all the users!</Text>
            </View>)
        
    }


    async function handleDislike(){
        await fetch((`${Constants.expoConfig.extra.apiUrl}/like`),{
            method: "POST",
            headers:{
                "Content-Type": "application/json",
                "Accept": 'application/json',
                "Authorization": SecureStore.getItem('username')
            },
            body: JSON.stringify({
                matchee_id: user.id,
                accepted: -1
            })
        })
        .then(response => {
            if (!response.ok){throw new Error('Network response not ok')}
            })
        .catch(error =>{
            console.error('There was a problem')
            })

        await fetch((`${Constants.expoConfig.extra.apiUrl}/new_match`),{
            method: "GET",
            headers:{
                "Content-Type": "application/json",
                "Accept": 'application/json',
                "Authorization": SecureStore.getItem('username')
            },
        }) 
        .then(response => {
            if (!response.ok){throw new Error('Network response not ok')}
            else{return response.json()}
        })
        .catch(error =>{console.error('There was a problem')})
        .then(json => {
            setUser(json)

            const attribute_dict = {}
            for(const row in json.attributes)
                attribute_dict[json.attributes[row].attribute_category] = json.attributes[row].attribute_value
            
            setUserAttributeDict(attribute_dict)
        })
    }

    async function handleLike(){
        await fetch((`${Constants.expoConfig.extra.apiUrl}/like`),{
            method: "POST",
            headers:{
                "Content-Type": "application/json",
                "Accept": 'application/json',
                "Authorization": SecureStore.getItem('username')
            },
            body: JSON.stringify({
                matchee_id: user.id,
                accepted: 1,
            })
        })
        .then(response => {
            if (!response.ok){
                throw new Error('Network response not ok')
            }
            return response.json()})
        .then(data =>{
            if (data['MatchFlag'] == 1){
                alert(`You matched with ${user.username}`)
            }
        })
        .catch(error =>{
            console.error('There was a problem')
        })

        await fetch((`${Constants.expoConfig.extra.apiUrl}/new_match`),{
            method: "GET",
            headers:{
                "Content-Type": "application/json",
                "Accept": 'application/json',
                "Authorization": SecureStore.getItem('username')
            },
        }) 
        .then(response => {
            if (!response.ok){throw new Error('Network response not ok')}
            else{return response.json()}
        })
        .catch(error =>{console.error('There was a problem')})
        .then(json => {
            setUser(json)
            const attribute_dict = {}
            for(const row in json.attributes)
                attribute_dict[json.attributes[row].attribute_category] = json.attributes[row].attribute_value
            
            setUserAttributeDict(attribute_dict)
    })
    }

    function calculateAge(birthDate) {
        const today = new Date();
        const birthDateObj = new Date(birthDate);
      
        let age = today.getFullYear() - birthDateObj.getFullYear();
        const monthDiff = today.getMonth() - birthDateObj.getMonth();
      
        // If the birthday hasn't happened this year, subtract 1
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
          age--;
        }
      
        return String(age);
      }


    return(
        // <ScrollView  refreshControl={
        //     <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
        // }
        // >
        <ScrollView>
            <View style = {styles.container}>
            <Card style={styles.card}>
                <ScrollView>
                <Card.Content>
                    <Image
                        source={{uri: user.image}}
                        style={styles.image}
                        alt="User Profile Picture"/>
                    <Text style={styles.username}>{user.username}</Text>
                    <Text style={styles.bio}>{user.bio}</Text>
                    {Object.entries(userAttributeDict).map(([key,value]) => (
                    key == "Birthdate" ?
                    <Text key={key}><Ionicons name="balloon-outline" size={16}></Ionicons> {calculateAge(value)}</Text> :
                    key == "Date" ?
                    <Text key={key}></Text>:
                        <Text key={key}><Ionicons name="glasses-outline" size={16}></Ionicons> {value}</Text>
                        
                ))}
                </Card.Content>
                </ScrollView>
                <Card.Actions style={styles.actions}>
                    <Button style = {styles.button} icon="close" mode="outlined" iconStyle={{alignItems: 'center'}} onPress={handleDislike}/>
                    <View style={styles.spacer}></View>
                    <Button style = {styles.button} icon="heart" mode="contained" iconStyle={{alignSelf: 'center'}} onPress={handleLike}/>
                     
                  
                </Card.Actions>
            </Card>
            </View>
        </ScrollView>
     
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
      width: 300,
      height: 300,
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
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    spacer:{
        flex:1
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center'
    }
  });

export default NewMatchCard