import * as React from 'react';
import {useState,useEffect} from "react"
import { Card, Button } from 'react-native-paper';
import { ScrollView, RefreshControl, View, Text, Image, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'
import Constants from 'expo-constants'
import imageMap from './imageMap'

function MatchDetails({route}){
    const {id} = route.params

    const [user, setUser] = useState([])
    const [refreshing, setRefreshing] = useState(false)
    const [userAttributeDict, setUserAttributeDict] = useState([])
    const [icons, setIcons] = useState([])

    useEffect(() =>{
        fetch(`${Constants.expoConfig.extra.apiUrl}/${id}`) 
        .then(response => response.json())
        .then(json => {
            setUser(json)
            const attribute_dict = {}
            for(const row in json.attributes)
                attribute_dict[json.attributes[row].attribute_category] = json.attributes[row].attribute_value
            
            setUserAttributeDict(attribute_dict)
        })
    
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
                        source={imageMap[user.id]}
                        style={styles.image}
                        alt="User Profile Picture"/>
                    <Text style={styles.username}>{user.username}</Text>
                    <Text style={styles.bio}>{user.bio}</Text>
                    {Object.entries(userAttributeDict).map(([key,value]) => (
                      value === null ? <React.Fragment key={key}/>  :
                    key == "Birthdate" ?
                    <Card key={key} style={styles.detailCard}>
                        <View style={styles.row}>
                          <Ionicons name="balloon-outline" size={16}/>
                          <Text> {calculateAge(value)}</Text>
                        </View>
                    </Card>
                     :
                    key == "Date" ?
                    <Text key={key}></Text>:
                    <Card key={key} style={styles.detailCard}>
                        <View style={styles.row}>
                          <Ionicons name={icons[key]} size={24}/>
                          <Text style={{marginLeft: 8}}>{value}</Text>
                        </View>
                    </Card>
                        
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

export default MatchDetails;