import * as React from 'react'
import {View,Text} from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Ionicons from 'react-native-vector-icons/Ionicons'
import GetUserId from './GetUsername'
import {useState,useEffect} from "react"

import Login from './Login'
import NewMatchCard from './NewMatchCard'
import DetailsScreen from './DetailsScreen'
import SettingsScreen from './SettingsScreen'

const loginName = 'Login'
const homeName = 'Home'
const detailsName = 'Details'
const settingsName = 'Settings'


const Tab = createBottomTabNavigator()

export default function MainContainer(){

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
                    } else if (rn== detailsName){
                        iconName = focused ? 'list' : 'list-outline'
                    } else if (rn== settingsName){
                        iconName = focused ? 'settings' : 'settings-outline'
                    }

                    return <Ionicons name={iconName} size={size} color={color}/>
                }
           
            })}
            >
               
                <Tab.Screen name={homeName} component={NewMatchCard}/>
                <Tab.Screen name={detailsName} component={DetailsScreen}/>
                <Tab.Screen name={settingsName} component={SettingsScreen}/>
                <Tab.Screen name={loginName} component={Login}/>
            
                
                
            </Tab.Navigator>
        </NavigationContainer>
    )
}