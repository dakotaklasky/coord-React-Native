import {useState,useEffect} from "react"
import {View,Text, TextInput, Button, StyleSheet, StatusBar, Image, KeyboardAvoidingView, ScrollView} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';
import MultiSlider from '@ptomasroos/react-native-multi-slider';



function PreferenceOptionForm({handleSubmit,handleInputChange,getDefaultValue,userInfo, getSliderCategory}){
    const [error,setError] = useState()
    const [prefOptions, setPrefOptions] = useState([])

    useEffect(() => {
    fetch(`http://192.168.1.83:5555/pref_options`) 
    .then(response => {
        if (!response.ok){throw new Error('Network response not ok')}
        else{return response.json()}
    })
    .catch(response => response.json())
    .then(data => {
        data.map(d => {
            if(d.options){
                d['option_array'] = d.options.split(',') 
            }
        })

        if(userInfo){
            const data_copy = []
            for (const j in data){
                if (data[j].category != "Age"){
                    data_copy.push(data[j])
                }
            }
            setPrefOptions(data_copy)
        }
        else{
            setPrefOptions(data)
        }

    })
    },[])

    function getBirthdate(birthday){
        if(birthday){
            const [year, month, day] = birthday.split('-').map(Number)
            return new Date(year, month -1, day)
        }
        else{
            return new Date()
        }
    }
    
    return (
        <ScrollView>
                {userInfo ? 
                (<View style={styles.container}>
                <Text style={styles.label}>Username:</Text>
                <TextInput style={styles.input} onChangeText={(value) => handleInputChange("username",value)} defaultValue={getDefaultValue("username")}></TextInput>
                <Text style={styles.label}>Password:</Text>
                <TextInput secureTextEntry={true} style={styles.input} onChangeText={(value) => handleInputChange("password",value)}></TextInput>
                <Text style={styles.label}>Image:</Text>
                <TextInput style={styles.input} onChangeText={(value) => handleInputChange("image",value)} defaultValue={getDefaultValue("image")}></TextInput>
                <Text style={styles.label}>Bio:</Text>
                <TextInput style={styles.input} onChangeText={(value) => handleInputChange("bio",value)} defaultValue={getDefaultValue("bio")}></TextInput>
                <Text style={styles.label}>Birthdate:</Text>
                <DateTimePicker value={getBirthdate(getDefaultValue("Birthdate"))} onChange={(value) => handleInputChange("birthdate",value)} mode="date" display="default" ></DateTimePicker>
                </View>) :
                (<View></View>)}
                <View style={styles.container}>
                    {prefOptions.map((pref,index) => (
                        
                        <View key={index}>
                            <Text style={styles.label}>{pref.category}</Text>
                            {pref.input_type == "dropdown" ? (
                                <RNPickerSelect
                                    style= {{
                                        inputIOS: styles.inputIOS,
                                        inputAndroid: styles.inputAndroid,
                                        placeholder: styles.placeholder
                                    }}
                                    value = {getDefaultValue(pref.category)}
                                    onValueChange={(itemValue) => handleInputChange(pref.category,itemValue)}

                                    items={pref.option_array.map((option) => ({
                                        label:option,
                                        value:option
                                    }))}
                                    useNativeAndroidPickerStyle={false}
                                />
                            ) : (
                                userInfo ? 
                            (<TextInput style={styles.input} onChangeText={(value) => handleInputChange(pref.category,value)} defaultValue={getDefaultValue(pref.category) || ""}></TextInput>):

                            (<MultiSlider 
                                values={getDefaultValue(pref.category) ? [Math.min(...getDefaultValue(pref.category).map(Number)), Math.max(...getDefaultValue(pref.category).map(Number))] :["",""]}
                                sliderLength={280}
                                onValuesChange={([minvalue,maxvalue]) => handleInputChange(pref.category,[minvalue,maxvalue])}
                                min = {pref.minval}
                                max={pref.maxval}
                                />))}
                        </View>
                    ))}
                </View>

                <Button onPress={handleSubmit} title="Update"></Button>
        </ScrollView>
)}

const styles = StyleSheet.create({
    container: {
      padding: 20,
    },
    label: {
      fontSize: 16,
      marginBottom: 5,
    },
    input: {
      borderWidth: 1,
      borderColor: 'gray',
      padding: 10,
      borderRadius: 5,
    },
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30, // to ensure the text is not cut off on the right
      },
      inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 0.5,
        borderColor: 'gray',
        borderRadius: 8,
        color: 'black',
        paddingRight: 30, // to ensure the text is not cut off on the right
      },
      placeholder: {
        color: 'gray', // Placeholder text color
        fontSize: 16,
      },
  });

export default PreferenceOptionForm;
