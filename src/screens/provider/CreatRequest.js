import { View, Text, Dimensions, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import { useState, useEffect } from 'react'
import { colors, fonts } from '../../config/Constants'
const { width, height } = Dimensions.get('screen');
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import axios from 'axios';
import { api_url, postdata } from '../../config/Constants';
import { connect } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { AlarmType } from '@notifee/react-native';
import MyLoader from '../../components/MyLoader';

const CreatRequest = (props) => {

  // console.log(props.providerData.id, 'sxdcfvghbnjk')
  const navigation = useNavigation();

  const [purpose, setPurpose] = useState('');
  const [timeShow, setTimeShow] = useState(false);
  const [time, setTime] = useState(null);
  const [date, setDate] = useState(null);
  const [dateShow, setDateShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  const time_handle = (event, selectedTime) => {
    setTime(selectedTime);
    setTimeShow(false);
  };
  const date_handle = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDateShow(false);
    setDate(currentDate);
  };

  const validation = () => {
    if (purpose === '') {
      Alert.alert('Purpose is required',
        'Please fill the Purpose for conducting a live session')
      return false
    } else if (date === null) {
      Alert.alert('Date is required',
        'Please Select a Date of live session')
      return false
    } else if (time === null) {
      Alert.alert('Time is required',
        'Please Select Time of live session')
      return false
    } else {
      return true
    }
  };

  const apply = async () => {
    if (validation()) {
      setIsLoading(true)
      try {
        const response = await axios({
          method: 'post',
          url: api_url + postdata,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          data: {
            astro_id: props.providerData.id,
            title: purpose,
            description: '',
            current_status: 'offline',
            date: date,
            time: time,
            experience: props.providerData.experience,
          },
        });

        if (response.status === 200) {
          navigation.navigate('LiveList');
        }
        setIsLoading(false)
      } catch (error) {
        console.error(error);
        setIsLoading(false)
        Alert.alert(error.message); // Display the error message in the alert
      }
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', padding: 15 }}>
      <MyLoader isVisible={isLoading} />
      <View style={{ backgroundColor: colors.white_color, borderRadius: 15, elevation: 3, padding: 10 }}>
        <Text style={{
          color: validation ? (
            colors.black_color) : colors.red2,
          marginVertical: 10,
          fontSize: 16
        }}>
          Please fill the bellow information
        </Text>
        <TextInput
          placeholder="Enter your Purpose"
          cursorColor={colors.background_theme2}
          placeholderTextColor={colors.black_color8}
          onChangeText={setPurpose}
          style={{
            padding: 10,
            backgroundColor: colors.black_color3,
            borderRadius: 10,
            marginTop: 10,
            borderColor: colors.black_color10
          }}>
          {purpose}
        </TextInput>
        <View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
            <TouchableOpacity
              onPress={() => setDateShow(true)}
              style={{
                width: '47%',
                backgroundColor: colors.black_color3,
                flexDirection: 'row',
                borderRadius: 10,
                marginTop: 10,
                paddingHorizontal: 10,
                paddingVertical: 10,
                borderColor: colors.black_color10,
                justifyContent: 'space-evenly',
                alignItems: 'center'
              }}
            >

              <MaterialCommunityIcons
                name="calendar-month-outline"
                color={colors.black_color8}
                size={25}
              />
              <Text
                style={{
                  flex: 0,
                  marginLeft: 5,
                  color: colors.black_color10,
                  fontWeight: 'normal',
                }}>
                {date == null
                  ? 'Select Date'
                  : moment(date).format('Do MMM YYYY')}
              </Text>


            </TouchableOpacity>
            {
              dateShow && <DateTimePicker
                testID="dateTimePicker"
                value={date == null ? new Date() : date}
                // maximumDate={new Date()}
                mode={'date'}
                is24Hour={true}
                display='inline'
                onChange={date_handle}
              />
            }

            <TouchableOpacity
              onPress={() => setTimeShow(true)}
              style={{
                width: '47%',
                backgroundColor: colors.black_color3,
                flexDirection: 'row',
                borderRadius: 10,
                marginTop: 10,
                paddingHorizontal: 10,
                paddingVertical: 10,
                borderColor: colors.black_color10,
                justifyContent: 'space-evenly',
                alignItems: 'center'
              }}>
              <MaterialCommunityIcons
                name="clock-outline"
                color={colors.black_color8}
                size={25}
              />
              <Text
                style={{
                  flex: 0,
                  marginLeft: 5,
                  color: colors.black_color10,
                  fontWeight: 'normal',
                }}>
                {time == null
                  ? 'Select Time'
                  : moment(time).format('hh:mm A')}
              </Text>
            </TouchableOpacity>
            {timeShow && (
              <DateTimePicker
                testID="dateTimePicker"
                value={time == null ? new Date() : time}
                mode={'time'}
                display='spinner'
                is24Hour={true}
                onChange={time_handle}
              />
            )}
          </View>
          <View>
            <TouchableOpacity
              onPress={apply}
              style={{
                flex: 0,
                bottom: 0,
                width: '100%',
                alignSelf: 'center',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 10,
                paddingVertical: 10,
                borderRadius: 10,
                backgroundColor: colors.background_theme2,
              }}
            >
              < Text
                style={{
                  fontSize: 16,
                  color: colors.white_color,
                  fontWeight: 600
                  // fontWeight: 'normal',
                }}>
                Send Request
              </Text>
            </TouchableOpacity>
          </View>
        </View>


      </View >
    </View >)
}


const mapStateToProps = state => ({
  providerData: state.provider.providerData,
  dashboard: state.provider.dashboard,
})

export default connect(mapStateToProps, null)(CreatRequest);
const styles = StyleSheet.create({
  buttonContainer: {
    width: '40%',
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: colors.background_theme2,
  },
  buttonText: {
    fontSize: 14,
    color: colors.background_theme1,
    fontFamily: fonts.bold,
    textAlign: 'center',
  },
  inputContainer: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: colors.black_color,
    padding: 10,
    marginBottom: 20,
    zIndex: -1,
    width: width * 0.4
  },
  checkBoxText: {
    fontSize: 14,
    color: colors.black_color8,
    fontFamily: fonts.medium,
    textDecorationLine: 'none',
  },
});