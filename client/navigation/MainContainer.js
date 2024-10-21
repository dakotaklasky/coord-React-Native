import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import * as SecureStore from 'expo-secure-store';


import Login from './Login'
import NewMatchCard from './NewMatchCard'
import MatchList from './MatchList'
import MatchDetails from './MatchDetails'
import AccountScreen from './AccountScreen'
import Logout from './Logout'
import Signup from './Signup'
import Messages from './Messages'


const loginName = 'Login'
const homeName = 'Home'
const matchName = 'Matches'
const matchDetails = 'MatchDetails'
const matchList = 'My Matches'
const accountScreen = 'My Account'
const logoutName = 'Logout'
const signupName = 'Signup'
const messagesName = 'Messages'

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

function MatchStack(){
    return(
        <Stack.Navigator>
            <Stack.Screen name={matchName} component={MatchList}/>
            <Stack.Screen name={matchDetails} component={MatchDetails}/>
            <Stack.Screen name={messagesName} component={Messages}/>
        </Stack.Navigator>
    )
}


export default function MainContainer(){

    if(SecureStore.getItem('username') === null){
        return(
            <NavigationContainer>
            <Tab.Navigator
            initialRouteName={loginName}
            screenOptions={<Ionicons name={focused ? 'log-in' : 'log-in-outline'} size={size} color={color}/>}
            
                <Tab.Screen name={homeName} component={NewMatchCard}/>
                <Tab.Screen name={matchList} component={MatchStack}/>
                <Tab.Screen name={accountScreen} component={AccountScreen}/>
                <Tab.Screen name={logoutName} component={Logout}/>
                <Tab.Screen name={loginName} component={Login}/>
                <Tab.Screen name={signupName} component={Signup}/>
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

                    if(rn==loginName){
                        iconName = focused ? 'log-in' : 'log-in-outline'
                    } else if (rn==homeName){
                        iconName= focused ? 'home' : 'home-outline'
                    } else if (rn== accountScreen){
                        iconName = focused ? 'person-circle' : 'person-circle-outline'
                    } else if (rn== signupName){
                        iconName = focused ? 'person-add' : 'person-add-outline'
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
                <Tab.Screen name={logoutName} component={Logout}/>
                <Tab.Screen name={loginName} component={Login}/>
                <Tab.Screen name={signupName} component={Signup}/>
            </Tab.Navigator>
        </NavigationContainer>
    )
}
