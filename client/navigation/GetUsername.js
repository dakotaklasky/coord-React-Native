import * as SecureStore from 'expo-secure-store';

function GetUsername(){

    const username = SecureStore.getItem('username')
    if (username){
        return username
    }
    
}

export default GetUsername