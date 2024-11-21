import {useState,useEffect} from "react"
import * as SecureStore from 'expo-secure-store';
import {View,Text, TextInput, Button, StyleSheet, Image, KeyboardAvoidingView, TouchableOpacity} from 'react-native'
import Constants from 'expo-constants'
import { useNavigation } from '@react-navigation/native';

function Login({setIsLoggedIn}){
    const navigation = useNavigation()
    const [msg, setMsg] = useState()
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

   function storeUserId(user_username){
        try{
            SecureStore.setItem('username',user_username.toString())
        } catch (error){
            console.error("Error saving user_id", error)
        }
    }
    
    async function handleSubmit(){
        await fetch(`${Constants.expoConfig.extra.apiUrl}/login`,{
            method: 'POST',
            headers:{
                'Content-Type':'application/json',
                "Accept": 'application/json'
            },
            body: JSON.stringify({
                'username': username,
                'password': password
            })
        })
        .then(response => {
            if (response.ok){
                setMsg('Log in successful!')
                storeUserId(username)
                setIsLoggedIn(true)
            } 
            else{
                setMsg('Log in failed!')
                return Promise.reject(response)
            }
        })
        .catch(error => console.error('There was a problem'))

        setUsername("")
        setPassword("")
    }

    return (
        <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset="200" style={styles.container}>
            <View style={styles.form}>
            <Text style={styles.logoStyle}>coord</Text>
            {msg ? <Text style={{color:'red'}}>{msg}</Text> : null}
            <Text style={styles.label}>Username:</Text>
            <TextInput value={username} onChangeText={setUsername} style = {styles.input} placeholder="Enter your username"></TextInput>
            <Text style={styles.label}>Password:</Text>
            <TextInput value={password} onChangeText={setPassword} style= {styles.input} secureTextEntry placeholder="Enter your password"></TextInput>
            <Button onPress={handleSubmit} title="Login"></Button>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')} style={styles.signupTouch}>
                <Text style={styles.signupText}>Sign up</Text>
            </TouchableOpacity>
            </View>
            
        </KeyboardAvoidingView>
)}


const styles = StyleSheet.create({
    container:{
        flex: 1, 
        justifyContent: "center",
        backgroundColor: 'f5f5f5',
        paddingHorizontal: 20,
        borderColor: "black"
    },
    input: {
        height: 40,
        margin: 12,
        padding: 10,
        borderWdith: 1,
        borderColor: 'black',
        backgroundColor: 'f5f5f5'
    },
    form: {
        backgroundColor: "white",
        padding: 20,
        borderRadius:10,
        shadowColor:"black",
        shadowOffset: {
            width:0,
            height:2
        },
        shadowOpacity:0.25,
        shadowRadius: 4
    },
    image:{
        width: 300,
        height: 300, 
        alignSelf: "center",
        marginBottom:50
    },
    label:{
        fontSize: 16,
        marginBottom: 5,
        fontWeight: "bold"
    },
    input:{
        height: 40,
        borderColor: "#ddd",
        borderWidth: 1,
        marginBottom: 15,
        padding: 10,
        borderRadius: 5
    },
    signupText:{
        color: 'blue',
        textDecorationLine: 'underline',
    },
    signupTouch:{
        alignSelf: 'center'
    },
    logoStyle:{
        color: '#FF4B33',
        fontSize: 40,
        textAlign: 'center'
    }
})

export default Login;

