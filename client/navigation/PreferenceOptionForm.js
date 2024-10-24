import {useState,useEffect} from "react"
import {View,Text, TextInput, Button, StyleSheet, StatusBar, Image, KeyboardAvoidingView, ScrollView} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import Constants from 'expo-constants'



function PreferenceOptionForm({handleSubmit,handleInputChange,getDefaultValue,userInfo, birthdayState, setBirthdayState}){

    const [prefOptions, setPrefOptions] = useState([])

    useEffect(() => {
    fetch(`${Constants.expoConfig.extra.apiUrl}/pref_options`) 
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

    const CustomMarker = ({ currentValue }) => {
        return (
          <View style={styles.markerContainer}>
            <View style={styles.markerLabel}>
              <Text style={styles.markerLabelText}>{currentValue}</Text>
            </View>
            <View style={styles.marker} />
          </View>
        );
      }
    
    function inchesToFeet(inches){
        return String(Math.floor(inches/12)) + "'" + String((inches%12)) + '"'
    }

    function feetToInches(feet){
        return parseInt(feet[0])*12 + parseInt(feet.slice(2,feet.length-1))
    }
    
    return (
        <ScrollView>
                {userInfo ? 
                (<View style={styles.container}>
                     <View style={styles.formStyle}>
                        <Text style={styles.label}>Name</Text>
                        <TextInput style={styles.input} onChangeText={(value) => handleInputChange("name",value)} defaultValue={getDefaultValue("name")}></TextInput>
                    </View>
                    <View style={styles.formStyle}>
                        <Text style={styles.label}>Username</Text>
                        <TextInput style={styles.input} onChangeText={(value) => handleInputChange("username",value)} defaultValue={getDefaultValue("username")}></TextInput>
                    </View>
                    <View style={styles.formStyle}>
                        <Text style={styles.label}>Password</Text>
                        <TextInput secureTextEntry={true} style={styles.input} onChangeText={(value) => handleInputChange("password",value)}></TextInput>
                    </View>
                    <View style={styles.formStyle}>
                        <Text style={styles.label}>Image</Text>
                        <TextInput style={styles.input} onChangeText={(value) => handleInputChange("image",value)} defaultValue={getDefaultValue("image")}></TextInput>
                    </View>
                    <View style={styles.formStyle}>
                        <Text style={styles.label}>Bio</Text>
                        <TextInput multiline={true} style={styles.input} onChangeText={(value) => handleInputChange("bio",value)} defaultValue={getDefaultValue("bio")}></TextInput>
                    </View>
                    <View style={styles.formStyle}>
                        <Text style={styles.label}>Birthdate</Text>
                        <DateTimePicker value={birthdayState} onChange={(event, selectedDate) => {
                            const currentDate = selectedDate || birthdayState
                            setBirthdayState(new Date(currentDate))}} 
                            mode="date" 
                            display="default"/>
                    </View>
                </View>) :
                (<View></View>)}
                <View style={styles.container}>
                    {prefOptions.map((pref,index) => (
                        
                        <View key={index} style={styles.formStyle}>
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
                            (<RNPickerSelect
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
                            />):
                            
                            (pref.category == "Height" ? 
                                (<MultiSlider 
                                    values={getDefaultValue(pref.category) ? [Math.min(...getDefaultValue(pref.category).map((val) => feetToInches(val))), Math.max(...getDefaultValue(pref.category).map((val) => feetToInches(val)))] :["",""]}
                                    sliderLength={280}
                                    onValuesChange={([minvalue,maxvalue]) => handleInputChange(pref.category,[inchesToFeet(minvalue),inchesToFeet(maxvalue)])}
                                    customMarker={(e) => <CustomMarker currentValue={inchesToFeet(e.currentValue)} />}
                                    min = {pref.minval}
                                    max={pref.maxval}
                                />)
                              :
                                (<MultiSlider 
                                    values={getDefaultValue(pref.category) ? [Math.min(...getDefaultValue(pref.category).map(Number)), Math.max(...getDefaultValue(pref.category).map(Number))] :["",""]}
                                    sliderLength={280}
                                    onValuesChange={([minvalue,maxvalue]) => handleInputChange(pref.category,[minvalue,maxvalue])}
                                    customMarker={(e) => <CustomMarker currentValue={e.currentValue} />}
                                    min = {pref.minval}
                                    max={pref.maxval}
                                    />)
                            )                         
                    )}
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
      markerContainer: {
        alignItems: 'center',
      },
      markerLabel: {
        padding: 5,
        borderRadius: 5,
        marginBottom: 5,
      },
      markerLabelText: {
        color: '#000',
        fontSize: 16,
      },
      marker: {
        height: 20,
        width: 20,
        borderRadius: 10,
        backgroundColor: '#007aff',
      },
      formStyle: {
        margin: 5
      }
  });

export default PreferenceOptionForm;