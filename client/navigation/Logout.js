import * as React from 'react'
import {View,Text, Button} from 'react-native'
import {useState} from "react"
import * as SecureStore from 'expo-secure-store';

export default function Logout({setIsLoggedIn}){

    [msg, setMsg] = useState()

    async function handleLogout(){
        try{
            await SecureStore.deleteItemAsync('username')
            setMsg("Successfully logged out")
            setIsLoggedIn(false)
        }
        catch{
            setMsg("Could not log out")
        }

        
    }


    return(
      <View>
          <Text style={{fontSize: 26, fontWeight: 'bold'}}>{msg}</Text>
          <Button title="Logout" onPress={handleLogout}></Button>
      </View>
  )
} 