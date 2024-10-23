import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import * as SecureStore from 'expo-secure-store';
import {useState,useEffect} from "react"


import Login from './Login'
import NewMatchCard from './NewMatchCard'
import MatchList from './MatchList'
import MatchDetails from './MatchDetails'
import AccountScreen from './AccountScreen'
import Logout from './Logout'
import Signup from './Signup'
import Messages from './Messages'
import ErrorScreen from './ErrorScreen'


const loginName = 'Login'
const homeName = 'Home'
const matchName = 'Matches'
const matchDetails = 'MatchDetails'
const matchList = 'My Matches'
const accountScreen = 'My Account'
const logoutName = 'Logout'
const signupName = 'Signup'
const messagesName = 'Messages'
const loginSignup = 'Welcome'
const errorName = 'Error'

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

// "apiUrl": "http://192.168.1.83:5555"
//"apiUrl": "http://10.129.3.243:5555"


export default function MainContainer(){

    const [isLoggedIn, setIsLoggedIn] = useState(false)

    function MatchStack(){
        return(
            <Stack.Navigator>
                <Stack.Screen name={matchName} component={MatchList}/>
                <Stack.Screen name={matchDetails} component={MatchDetails}/>
                <Stack.Screen name={messagesName} component={Messages}/>
            </Stack.Navigator>
        )
    }
    
    function LoginStack(){
        return(
            <Stack.Navigator>
                {/* <Stack.Screen name={loginName} component={Login}/> */}
                <Stack.Screen name={loginName}>
                    {props => <Login {...props} setIsLoggedIn={setIsLoggedIn} />}
                </Stack.Screen>
                <Stack.Screen name={signupName} component={Signup}/>
                <Stack.Screen name={errorName} component={ErrorScreen}/>
            </Stack.Navigator>
        )
    }

    useEffect(() => {
        if(SecureStore.getItem('username') === null){
            setIsLoggedIn(false)
        }
        else{
            setIsLoggedIn(true)
        }
    })

    if(!isLoggedIn){
        return(
            <NavigationContainer>
                <Tab.Navigator
                    screenOptions={({route}) => ({
                        tabBarIcon: ({focused,color,size}) => {
                            return <Ionicons name={focused ? 'log-in' : 'log-in-outline'} size={size} color={color}/>
                        }
                    })}>
                    <Tab.Screen name={loginSignup} component={LoginStack}/>
                </Tab.Navigator>
            </NavigationContainer> 
        )
    }

    return(
        <NavigationContainer>
            <Tab.Navigator
            initialRouteName={homeName}
            screenOptions={({route}) => ({
                tabBarIcon: ({focused,color,size}) => {
                    let iconName;
                    let rn = route.name

                    if (rn==homeName){
                        iconName= focused ? 'home' : 'home-outline'
                    } else if (rn== accountScreen){
                        iconName = focused ? 'person-circle' : 'person-circle-outline'
                    } else if (rn==matchList){
                        iconName = focused ? 'chatbubbles' : 'chatbubbles-outline'
                    } else if (rn=logoutName){
                        iconName = focused ? 'log-out' : 'log-out-outline'
                    }

                    return <Ionicons name={iconName} size={size} color={color}/>
                }
           
            })}
            >
                <Tab.Screen name={homeName} component={NewMatchCard}/>
                <Tab.Screen name={matchList} component={MatchStack}/>
                <Tab.Screen name={accountScreen} component={AccountScreen}/>
                <Tab.Screen name={logoutName}>
                    {props => <Logout {...props} setIsLoggedIn={setIsLoggedIn} />}
                </Tab.Screen>
            </Tab.Navigator>
        </NavigationContainer>
    )
}
