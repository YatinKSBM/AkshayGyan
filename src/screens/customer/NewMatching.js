import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  TextInput,
  Platform,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import { useEffect } from 'react';
import {
  api2_create_kundali,
  api_url,
  colors,
  fonts,
  match_making,
} from '../../config/Constants';
import MyLoader from '../../components/MyLoader';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { warnign_toast } from '../../components/MyToastMessage';
import axios from 'axios';
import { connect } from 'react-redux';

const { width, height } = Dimensions.get('window');

const NewMatching = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [maleName, setMaleName] = useState('');
  const [femaleName, setFemaleName] = useState('');
  const [maleDateVisible, setMaleDateVisible] = useState(false);
  const [maleDate, setMaleDate] = useState(null);
  const [maleTimeVisible, setMaleTimeVisible] = useState(false);
  const [maleTime, setMaleTime] = useState(null);
  const [maleAddress, setMaleAddress] = useState(null);
  const [maleLatLong, setMaleLatLong] = useState(null);
  const [femaleDateVisible, setFemaleDateVisible] = useState(false);
  const [femaleDate, setFemaleDate] = useState(null);
  const [femaleTimeVisible, setFemaleTimeVisible] = useState(false);
  const [femaleTime, setFemaleTime] = useState(null);
  const [femaleAddress, setFemaleAddress] = useState(null);
  const [femaleLatLong, setFemaleLatLong] = useState(null);
  const [maleKundliId, setMaleKundliId] = useState(null);
  const [femaleKundliId, setFemaleKundliId] = useState(null);

  useEffect(() => {
    props.navigation.setOptions({
      tabBarLabel: 'NEW MATCHING',
    });
  }, []);

  const validation = () => {
    if ((maleName.length = 0)) {
      warnign_toast('Please enter male name.');
      return false;
    } else if (maleDate == null) {
      warnign_toast('Please select male birth date.');
      return false;
    } else if (maleTime == null) {
      warnign_toast('Please select male birth time.');
      return false;
    } else if (maleAddress == null) {
      warnign_toast('Please select male birth address.');
      return false;
    } else if ((femaleName.length = 0)) {
      warnign_toast('Please enter female name.');
      return false;
    } else if (femaleDate == null) {
      warnign_toast('Please select female birth date.');
      return false;
    } else if (femaleTime == null) {
      warnign_toast('Please select female birth time.');
      return false;
    } else if (femaleAddress == null) {
      warnign_toast('Please select female birth address.');
      return false;
    } else {
      return true;
    }
  };

  const get_matching = async () => {
    if (validation()) {
      create_male_kundli();
      create_female_kundli();
      setIsLoading(true);
      await axios({
        method: 'post',
        url: api_url + match_making,
        headers: {
          'content-type': 'multipart/form-data',
        },
        data: {
          male_dob: moment(maleDate).format('YYYY-MM-DD'),
          male_tob: moment(maleTime).format('hh:mm:ss'),
          male_lat: maleLatLong?.lat,
          male_long: maleLatLong?.lon,
          female_dob: moment(femaleDate).format('YYYY-MM-DD'),
          female_tob: moment(femaleTime).format('hh:mm:ss'),
          female_lat: femaleLatLong?.lat,
          female_long: femaleLatLong?.lon,
        },
      })
        .then(res => {
          setIsLoading(false);
          props.navigation.navigate('kundliMatch', {
            data: res.data.match_astro_details,
            maleKundliData: {
              kundali_id: maleKundliId,
              customer_name: maleName,
              dob: maleDate,
              tob: maleTime,
              latitude: maleLatLong?.lat,
              longitude: maleLatLong?.lon,
              place: maleAddress,
            },
            femaleKundliData: {
              kundali_id: femaleKundliId,
              customer_name: femaleName,
              dob: femaleDate,
              tob: femaleTime,
              latitude: femaleLatLong?.lat,
              latitude: femaleLatLong?.lon,
              place: femaleAddress,
            },
          });
        })
        .catch(err => {
          setIsLoading(false);
          console.log(err);
        });
    }
  };

  const create_male_kundli = async () => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + api2_create_kundali,
      headers: {
        'content-type': 'multipart/form-data',
      },
      data: {
        user_id: props.customerData.id,
        customer_name: maleName,
        dob: moment(maleDate).format('YYYY-MM-DD'),
        tob: moment(maleTime).format('hh:mm:ss'),
        gender: 'male',
        latitude: maleLatLong?.lat,
        longitude: maleLatLong?.lon,
        place: maleAddress,
      },
    })
      .then(res => {
        console.log(res.data);
        setMaleKundliId(res.data.kundli_id);
        setIsLoading(false);
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const create_female_kundli = async () => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + api2_create_kundali,
      headers: {
        'content-type': 'multipart/form-data',
      },
      data: {
        user_id: props.customerData.id,
        customer_name: femaleName,
        dob: moment(femaleDate).format('YYYY-MM-DD'),
        tob: moment(femaleTime).format('hh:mm:ss'),
        gender: 'female',
        latitude: femaleLatLong?.lat,
        longitude: femaleLatLong?.lon,
        place: femaleAddress,
      },
    })
      .then(res => {
        console.log(res.data);
        setFemaleKundliId(res.data.kundli_id);
        setIsLoading(false);
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const male_date_handle = (event, selectedDate) => {
    const currentDate = selectedDate;
    setMaleDateVisible(false);
    setMaleDate(currentDate);
  };

  const male_time_handle = (event, selectedTime) => {
    setMaleTime(selectedTime);
    setMaleTimeVisible(false);
  };

  const female_date_handle = (event, selectedDate) => {
    const currentDate = selectedDate;
    setFemaleDateVisible(false);
    setFemaleDate(currentDate);
  };

  const female_time_handle = (event, selectedTime) => {
    setFemaleTime(selectedTime);
    setFemaleTimeVisible(false);
  };
  return (
    <View style={{ flex: 1, backgroundColor: colors.black_color1 }}>
      <MyLoader isVisible={isLoading} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            flex: 0,
            width: '95%',
            paddingVertical: 15,
            alignSelf: 'center',
          }}>
          <Text style={styles.heading}>BOYS'S DETAILES</Text>
          <View style={styles.containerBox}>
            <View
              style={{
                flex: 0,
                width: '95%',
                alignSelf: 'center',
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 10,
                borderRadius: 10,
                marginBottom: height * 0.02,
                backgroundColor: colors.black_color3
              }}>
              <Ionicons name="person" color={colors.black_color6} size={20} style={{ marginRight: 5 }} />
              <KeyboardAvoidingView
                behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
                <TextInput
                  value={maleName}
                  placeholder="Enter full name"
                  placeholderTextColor={colors.black_color6}
                  cursorColor={colors.background_theme2}
                  onChangeText={setMaleName}
                  style={{
                    width: width * 0.7,
                    fontFamily: fonts.medium,
                    color: colors.black_color8,
                    padding: 8,
                  }}
                />
              </KeyboardAvoidingView>
            </View>
            <View
              style={{
                flex: 0,
                // width: '100%',
                flexDirection: 'row',
                // alignSelf: 'center',
                justifyContent: 'space-around'
              }}>
              <TouchableOpacity
                onPress={() => setMaleDateVisible(true)}
                style={{
                  flex: 0,
                  width: '45%',
                  alignSelf: 'center',
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 10,
                  borderRadius: 10,
                  // borderWidth: 1,
                  paddingVertical: 12,
                  marginBottom: height * 0.02,
                  backgroundColor: colors.black_color3
                }}
              >
                <MaterialCommunityIcons
                  name="calendar-month-outline"
                  color={colors.black_color8}
                  size={20}
                />
                <Text
                  style={{
                    flex: 0,
                    marginLeft: 5,
                    color: colors.black_color9,
                    fontWeight: 'normal',
                  }}>
                  {maleDate == null
                    ? '__/ __/ ___'
                    : moment(maleDate).format('Do MMM YYYY')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setMaleTimeVisible(true)}
                style={{
                  flex: 0,
                  width: '45%',
                  alignSelf: 'center',
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 10,
                  borderRadius: 10,
                  // borderWidth: 1,
                  paddingVertical: 12,
                  marginBottom: height * 0.02,
                  backgroundColor: colors.black_color3
                }}>
                <MaterialCommunityIcons
                  name="clock-outline"
                  color={colors.black_color8}
                  size={20}
                />
                <Text
                  style={{
                    flex: 0,
                    marginLeft: 5,
                    color: colors.black_color9,
                    fontWeight: 'normal',
                  }}>
                  {maleTime == null
                    ? '00:00 AM'
                    : moment(maleTime).format('hh:mm A')}
                </Text>
              </TouchableOpacity>
            </View>
            {maleDateVisible && (
              <DateTimePicker
                testID="dateTimePicker"
                value={maleDate == null ? new Date() : maleTime}
                mode={'date'}
                is24Hour={true}
                onChange={male_date_handle}
              />
            )}
            {maleTimeVisible && (
              <DateTimePicker
                testID="dateTimePicker"
                value={maleTime == null ? new Date() : maleTime}
                mode={'time'}
                is24Hour={true}
                onChange={male_time_handle}
              />
            )}
            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate('placeOfBirth', {
                  set_place_of_birth: setMaleAddress,
                  set_lat_long: setMaleLatLong,
                });
              }}
              style={{
                flex: 0,
                width: '95%',
                alignSelf: 'center',
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 10,
                borderRadius: 10,
                // borderWidth: 1,
                marginBottom: height * 0.02,
                backgroundColor: colors.black_color3
              }}>
              <Ionicons name="location" color={colors.black_color6} size={22} />
              <Text style={{
                width: '100%',
                fontFamily: fonts.medium,
                color: colors.black_color6,
                padding: 13,
              }}>
                {maleAddress != null ? maleAddress : 'Place of Birth'}
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.heading}>GIRL'S DETAILES</Text>
          <View style={styles.containerBox}>
            <View
              style={{
                flex: 0,
                width: '95%',
                alignSelf: 'center',
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 10,
                borderRadius: 10,
                marginBottom: height * 0.02,
                backgroundColor: colors.black_color3
              }}>
              <Ionicons name="person" color={colors.black_color6} size={20} style={{ marginRight: 5 }} />
              <KeyboardAvoidingView
                behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
                <TextInput
                  value={femaleName}
                  placeholder="Enter full name"
                  placeholderTextColor={colors.black_color6}
                  cursorColor={colors.background_theme2}
                  onChangeText={setFemaleName}
                  style={{
                    width: width * 0.7,
                    fontFamily: fonts.medium,
                    color: colors.black_color8,
                    padding: 8,
                  }}
                />
              </KeyboardAvoidingView>
            </View>
            <View
              style={{
                flex: 0,
                // width: '100%',
                flexDirection: 'row',
                // alignSelf: 'center',
                justifyContent: 'space-around'
              }}>
              <TouchableOpacity
                onPress={() => setFemaleDateVisible(true)}
                style={{
                  flex: 0,
                  width: '45%',
                  alignSelf: 'center',
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 10,
                  borderRadius: 10,
                  // borderWidth: 1,
                  paddingVertical: 12,
                  marginBottom: height * 0.02,
                  backgroundColor: colors.black_color3
                }}
              >
                <MaterialCommunityIcons
                  name="calendar-month-outline"
                  color={colors.black_color8}
                  size={20}
                />
                <Text
                  style={{
                    flex: 0,
                    marginLeft: 5,
                    color: colors.black_color9,
                    fontWeight: 'normal',
                  }}>
                  {femaleDate == null
                    ? '__/ __/ ___'
                    : moment(femaleDate).format('Do MMM YYYY')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setFemaleTimeVisible(true)}
                style={{
                  flex: 0,
                  width: '45%',
                  alignSelf: 'center',
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 10,
                  borderRadius: 10,
                  // borderWidth: 1,
                  paddingVertical: 12,
                  marginBottom: height * 0.02,
                  backgroundColor: colors.black_color3
                }}>
                <MaterialCommunityIcons
                  name="clock-outline"
                  color={colors.black_color8}
                  size={20}
                />
                <Text
                  style={{
                    flex: 0,
                    marginLeft: 5,
                    color: colors.black_color9,
                    fontWeight: 'normal',
                  }}>
                  {femaleTime == null
                    ? '00:00 AM'
                    : moment(femaleTime).format('hh:mm A')}
                </Text>
              </TouchableOpacity>
            </View>
            {femaleDateVisible && (
              <DateTimePicker
                testID="dateTimePicker"
                value={femaleDate == null ? new Date() : femaleTime}
                mode={'date'}
                is24Hour={true}
                onChange={female_date_handle}
              />
            )}
            {femaleTimeVisible && (
              <DateTimePicker
                testID="dateTimePicker"
                value={femaleTime == null ? new Date() : femaleTime}
                mode={'time'}
                is24Hour={true}
                onChange={female_time_handle}
              />
            )}
            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate('placeOfBirth', {
                  set_place_of_birth: setFemaleAddress,
                  set_lat_long: setFemaleLatLong,
                });
              }}
              style={{
                flex: 0,
                width: '95%',
                alignSelf: 'center',
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 10,
                borderRadius: 10,
                // borderWidth: 1,
                marginBottom: height * 0.02,
                backgroundColor: colors.black_color3
              }}>
              <Ionicons name="location" color={colors.black_color6} size={22} />
              <Text style={{
                width: '100%',
                fontFamily: fonts.medium,
                color: colors.black_color6,
                padding: 13,
              }}>
                {femaleAddress != null ? femaleAddress : 'Place Of Birth'}
              </Text>
            </TouchableOpacity>
          </View>
          <BouncyCheckbox
            size={20}
            fillColor={colors.background_theme2}
            text="Save"
            textStyle={{
              fontSize: 14,
              color: colors.black_color,
              fontFamily: fonts.medium,
              textDecorationLine: 'none',
            }}
            iconStyle={{ borderRadius: 2, }}
            innerIconStyle={{ borderRadius: 2 }}
            style={{ marginHorizontal: 25, width: '87%' }}
          />
          <TouchableOpacity
            onPress={get_matching}
            activeOpacity={0.8}
            style={{
              width: '87%',
              height: height * 0.07,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 15,
              alignSelf: 'center',
              backgroundColor: colors.background_theme2,
              marginTop: height * 0.02,
            }}>
            <Text
              style={{
                fontSize: 16,
                color: colors.white_color,
                fontFamily: fonts.medium,
                textAlign: 'center',
              }}>
              Show Match
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const mapStateToProps = state => ({
  customerData: state.customer.customerData,
  wallet: state.customer.wallet,
});

export default connect(mapStateToProps, null)(NewMatching);

const styles = StyleSheet.create({
  heading: {
    fontSize: 18,
    color: colors.black_color,
    fontFamily: fonts.semi_bold,
  },
  containerBox: {
    flex: 0,
    backgroundColor: colors.background_theme1,
    padding: 15,
    borderRadius: 5,
    shadowColor: colors.black_color5,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    marginTop: 10,
    marginBottom: 20,
  },
  inputContainer: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: colors.black_color6,
    padding: 10,
    marginBottom: 20,
  },
});
