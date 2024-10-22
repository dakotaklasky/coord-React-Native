import * as React from 'react';
import {useState,useEffect} from "react"
import { Card } from 'react-native-paper';
import { ScrollView, RefreshControl, View, Text, Image, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants'


function AccountPreview(){

    const [user, setUser] = useState([])
    const [refreshing, setRefreshing] = useState(false)
    const [userAttributes,setUserAttributes] = useState([])


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
        .then(json => setUser(json))
        .catch(error => {console.error('There was a problem')})
        

        fetch(`${Constants.expoConfig.extra.apiUrl}/user_attributes`,{
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
        .then(json => setUserAttributes(json))
        .catch(error =>{console.error('There was a problem')})
        
    }, [])

    const onRefresh = () => {
        setRefreshing(true);
        if (SecureStore.getItem('username')){
            setUsername(SecureStore.getItem('username'))
        }
        setTimeout(() => {
          setRefreshing(false); // End refresh after the task is done
        }, 2000);
      };

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

    if (SecureStore.getItem('username') === null){
        return (
            <View>
                <Text>Please Login!</Text>
            </View>
        )
    }


    return(
        <ScrollView  refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
        }
        >
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
                    {Object.entries(userAttributes).map(([key,value]) => (
                    key == "Birthdate" ?
                    <Text key={key}><Ionicons name="balloon-outline" size={16}></Ionicons> {calculateAge(value)}</Text> :
                    key == "Date" ?
                    <Text key={key}></Text>:
                        <Text key={key}><Ionicons name="glasses-outline" size={16}></Ionicons> {value}</Text>
                        
                ))}
                </Card.Content>
                </ScrollView>
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

export default AccountPreview;