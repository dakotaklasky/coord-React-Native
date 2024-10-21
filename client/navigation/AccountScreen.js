import * as React from 'react';
import {useState} from "react"
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import AccountPreview from './AccountPreview'
import AccountPreferences from './AccountPreferences'
import EditProfile from './EditProfile'


function AccountPage() {

    const [accountView,setAccountView] = useState('preview')

    function viewProfile(){
        setAccountView('preview')
    }
    
    function editProfile(){
        setAccountView('edit_profile')
    }

    function editPreferences(){
        setAccountView('edit_preference')
    }

  return (
    <View>
        <View style={styles.container}>
            <Button onPress = {viewProfile}>View Preview</Button>
            <Button onPress = {editProfile}>Edit Profile</Button>
            <Button onPress = {editPreferences}>Edit Preferences</Button>
        </View>
        {accountView == 'preview'? <AccountPreview /> : accountView == 'edit_profile' ?<EditProfile/> : <AccountPreferences/>}
    </View>
  )
}

const styles = StyleSheet.create({
    container:{
        flexDirection: 'row',
        justifyContent: 'space-around'
    }
})

export default AccountPage;