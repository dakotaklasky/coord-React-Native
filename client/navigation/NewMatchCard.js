import * as React from 'react';
import {useState,useEffect} from "react"
import { ScrollView, View, Text, Image, StyleSheet,ActivityIndicator, Alert, RefreshControl} from 'react-native';
import { Card, Button } from 'react-native-paper';
import * as SecureStore from 'expo-secure-store';
import Ionicons from 'react-native-vector-icons/Ionicons'
import Constants from 'expo-constants'
import imageMap from './imageMap'

function NewMatchCard(){
    const [user, setUser] = useState([])
    const [userAttributeDict, setUserAttributeDict] = useState([])
    const [icons, setIcons] = useState([])
    const [refreshing, setRefreshing] = useState(false)


    useEffect(() =>{
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
    
            fetch(`${Constants.expoConfig.extra.apiUrl}/pref_icons`)
                .then(response => {
                    if (!response.ok){throw new Error('Network response not ok')}
                    else{return response.json()}
                })
                .then(json => {
                    setIcons(json)})
                .catch(error => console.error('There was a problem'))
    
        }, [])


    const onRefresh = () => {
        setRefreshing(true);

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

        setTimeout(() => {
            setRefreshing(false);
        }, 2000); 
    };


    if (userAttributeDict.length === 0){
        return (
            <View style={{justifyContent: 'center'}}>
                <ActivityIndicator size="large"/>
            </View>
        )
    }

    
    if(user.no_users){
        return (<ScrollView contentContainerstyle = {{ margin:16}} refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}>
                <Text style={{fontSize: 20, margin:16, alignSelf:'center'}}>Please update your preferences!</Text>
                </ScrollView>)
        
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
            <ScrollView contentContainerstyle = {styles.container} refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}>
            <Card style={styles.card}>
                <ScrollView>
                <Card.Content>
                    <Image
                        source={imageMap[user.id]}
                        style={styles.image}
                        alt="User Profile Picture"/>
                    <Text style={styles.username}>{user.username}</Text>
                    <Text style={styles.bio}>{user.bio}</Text>
                    {Object.entries(userAttributeDict).map(([key,value]) => (
                    value === null ? <React.Fragment key={key}/> :
                    key == "Birthdate" ?
                    <Card style={styles.detailCard} key={key}>
                        <View style={styles.row}>
                            <Ionicons name="balloon-outline" size={24}/>
                            <Text  style={{marginLeft: 8}}>{calculateAge(value)}</Text>
                        </View>
                    </Card> :
                    key == "Date" ?
                    <Text key={key}></Text>: 
                        <Card style={styles.detailCard} key={key} >
                            <View style={styles.row}>
                                <Ionicons name={icons[key]} size={24}/>
                                <Text style={{marginLeft: 8}}>{value}</Text>
                            </View>
                        </Card>
                        
                        
                ))}
                </Card.Content>
                </ScrollView>
                <Card.Actions style={styles.actions}>
                    <Button style = {styles.button} icon="close" mode="outlined" iconStyle={{alignItems: 'center'}} onPress={handleDislike}/>
                    <View style={styles.spacer}></View>
                    <Button style = {styles.button} icon="heart" mode="contained" iconStyle={{alignSelf: 'center'}} onPress={handleLike}/>
                </Card.Actions>
            </Card>
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
      height: 630,
      padding: 9,
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
    },
    detailCard:{
        margin: 5,
        padding: 3,
    },
    row:{
        flexDirection: 'row',
        alignItems: 'center'
    }
  });

export default NewMatchCard