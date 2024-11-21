import * as React from 'react';
import {useState,useEffect} from "react"
import { Card } from 'react-native-paper';
import { ScrollView, RefreshControl, View, Text, Image, StyleSheet, FlatList, Dimensions} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants'
import imageMap from './imageMap'

const { width: screenWidth } = Dimensions.get('window');

//display user account in card preview format
function AccountPreview(){

    const [user, setUser] = useState([])
    const [userAttributes,setUserAttributes] = useState([])
    const [icons, setIcons] = useState([])

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

        fetch(`${Constants.expoConfig.extra.apiUrl}/pref_icons`)
        .then(response => {
            if (!response.ok){throw new Error('Network response not ok')}
            else{return response.json()}
        })
        .then(json => {
            setIcons(json)})
        .catch(error => console.error('There was a problem'))
        
    }, [])

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

    const renderItem = ({ item }) => (
        <View style={styles.imageContainer}>
          <Image source={item} style={styles.image} />
        </View>
      );

    return(
        <ScrollView>
            <View style = {styles.container}>
            <Card style={styles.card}>
                <ScrollView>
                <Card.Content>
                    <View style={styles.container}>
                        <FlatList
                            data={[imageMap[user.id],{ uri: 'https://dummyimage.com/753x721' }]}
                            renderItem={renderItem}
                            keyExtractor={(item, index) => index.toString()}
                            horizontal
                            pagingEnabled // This allows for a snap effect
                            showsHorizontalScrollIndicator={false} // Hide the horizontal scroll indicator
                            snapToAlignment="center" // Align to the center of the screen
                            snapToInterval={screenWidth} // Snap to the width of the screen
                            decelerationRate="fast" // Makes the scroll faster
                        />
                    </View>
                    <Text style={styles.username}>{user.name}</Text>
                    <Text style={styles.bio}>{user.bio}</Text>
                    {Object.entries(userAttributes).map(([key,value]) => (
                    value === null ? <React.Fragment key={key}/> :
                    key == "Birthdate" ?
                    <Card key={key} style={styles.detailCard}>
                        <View style={styles.row}>
                            <Ionicons name="balloon-outline" size={24}/>
                            <Text > {calculateAge(value)}</Text> 
                        </View>
                    </Card> :
                    key == "Date" ?
                    <Text key={key}></Text>:
                    <Card key={key} style={styles.detailCard}>
                        <View style={styles.row}>
                            <Ionicons name={icons[key]} size={24}/>
                            <Text  style={{marginLeft: 8}}>{value}</Text>
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

export default AccountPreview;