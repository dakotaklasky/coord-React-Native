import AsyncStorage from '@react-native-async-storage/async-storage';

async function GetUserId(){

    const user_id = await AsyncStorage.getItem('user_id')
    if (user_id){
        return user_id
    }
    
}

export default GetUserId