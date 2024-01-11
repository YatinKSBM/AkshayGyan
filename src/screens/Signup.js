import {
  View,
  Text,
  KeyboardAvoidingView,
  TouchableOpacity,
  Dimensions,
  TextInput,
  StyleSheet,
  ScrollView,
  Platform,
  Image,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import {
  api2_get_countries,
  api2_get_profile,
  api_url,
  call_app_id,
  call_app_sign,
  colors,
  fonts,
  upload_customer_pic,
} from '../config/Constants';
import MyStatusBar from '../components/MyStatusbar';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import { CommonActions } from '@react-navigation/native';
import axios from 'axios';
import * as CustomerActions from '../redux/actions/CustomerActions';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'react-native-image-picker';
import moment from 'moment';
import { useCallback } from 'react';
import { actions } from '../config/data';
import * as ZIM from 'zego-zim-react-native';
import * as ZPNs from 'zego-zpns-react-native';
import ZegoUIKitPrebuiltCallService, {
  ONE_ON_ONE_VOICE_CALL_CONFIG,
  ZegoMenuBarButtonName,
} from '@zegocloud/zego-uikit-prebuilt-call-rn';
import RNFetchBlob from 'rn-fetch-blob';
import { success_toast, warnign_toast } from '../components/MyToastMessage';
import MyLoader from '../components/MyLoader';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import { PermissionsAndroid } from 'react-native';

const { width, height } = Dimensions.get('screen');

const Signup = props => {
  // console.log(props.route.params.id)
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(
    props.route.params.phone_number,
  );
  const [male, setMale] = useState(true);
  const [female, setFemale] = useState(false);
  const [birthPlace, setBirthPlace] = useState(null);
  const [buttonStatus, setButtonStatus] = useState(true);
  const [countryData, setCountryData] = useState(null);
  const [country, setCountry] = useState(null);
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(null);
  const [dateShow, setDateShow] = useState(false);
  const [timeShow, setTimeShow] = useState(false);
  const [time, setTime] = useState(null);
  const [latLong, setLatLong] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [baseSixtyFourData, setbaseSixtyFourData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    props.navigation.setOptions({
      title: '',
      headerTintColor: colors.background_theme1,
      headerShown: true,
      headerStyle: {
        backgroundColor: colors.background_theme2,
      },
      headerRight: () => (
        <View
          style={{ flex: 0.9 }}>
          <Text style={{
            fontSize: 20,
            color: colors.white_color,
            fontFamily: fonts.bold,
            textAlign: 'center',
            fontWeight: '600'
          }}>Profile</Text>
        </View>
      ),

    });
  }, []);

  useEffect(() => {
    get_countries();
    console.log('userMobbileNo', props.route.params.phone_number)
  }, []);

  const get_countries = async () => {
    await axios({
      method: 'post',
      url: api_url + api2_get_countries,
    })
      .then(res => {
        setCountryData(res.data.countries);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const emain_validation = () => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(email) === false) {
      return true;
    } else {
      return false;
    }
  };

  const validation = () => {
    if (firstName.length == 0) {
      warnign_toast('Please enter your first name');
      return false;
    } else if (lastName.length == 0) {
      warnign_toast('Please enter your last name');
      return false;
    } else if (email.length == 0) {
      warnign_toast('Please enter your email address');
      return false;
    } else if (emain_validation()) {
      warnign_toast('Please enter your correct email address');
      return false;
    } else if (date == null) {
      warnign_toast('Please select your date of birth');
      return false;
    } else if (time == null) {
      warnign_toast('Please select your time of birth');
      return false;
    } else if (country == null) {
      warnign_toast('Please select your country');
      return false;
    } else if (birthPlace == null) {
      warnign_toast('Please enter your birth address');
      return false;
    } else if (profileImage == null) {
      warnign_toast('Please upload your profile image');
      return false;
    } else {
      return true;
    }
  };

  const update_profile = async () => {
    console.log('zsxdfcgvhbjn')
    if (validation()) {
      console.log(profileImage, 'profileImage');
      setIsLoading(true);
      RNFetchBlob.fetch(
        'POST',
        api_url + upload_customer_pic,
        {
          'Content-Type': 'multipart/form-data',
        },
        [
          { name: 'id', data: props.route.params.id.toString() },
          // { name: 'id', data: props.route.params.id },

          { name: 'first_name', data: firstName },
          { name: 'last_name', data: lastName },
          { name: 'email', data: email },
          { name: 'gender', data: male ? 'Male' : 'Female' },
          { name: 'mobile', data: props.route.params.phone_number },
          { name: 'place_of_birth', data: birthPlace },
          { name: 'country', data: 'India' },
          { name: 'type', data: 'phone' },
          { name: 'time_of_birth', data: moment(time).format('hh:mm:ss') },
          { name: 'date_of_birth', data: moment(date).format('YYYY-MM-DD') },
          {
            name: 'image',
            data: baseSixtyFourData.toString(),
          },
        ],
      )
        .then(async res => {
          setIsLoading(false);
          console.log(res.data);
          // const response = JSON.parse(res.data);
          // console.log(response);
          await customer_profile();
        })
        .catch(err => {
          setIsLoading(false);
          console.log(err, 'err issssssssss');
        });
    }
  };

  const customer_profile = async () => {
    let data = new FormData();
    data.append('user_id', props.route.params.id);
    await axios({
      method: 'post',
      url: api_url + api2_get_profile,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: data,
    })
      .then(async res => {
        console.log("asas", res.data.user_details[0]?.id),
          console.log("saasas", res.data.user_details[0]?.userName)
        await AsyncStorage.setItem(
          'customerData',
          JSON.stringify(res.data.user_details[0]),
        );
        props.dispatch(
          CustomerActions.setCustomerData(res.data.user_details[0]),
        );
        props.dispatch(
          CustomerActions.setWallet(res.data.user_details[0]?.wallet),
        );
        onUserLogin(
          res.data.user_details[0]?.id,
          res.data.user_details[0]?.username,

        );
        go_home();
        success_toast('You are signed successfully.');
      })
      .catch(err => {
        console.log(err);
      });
  };

  const onUserLogin = async (userID, userName) => {
    return ZegoUIKitPrebuiltCallService.init(
      call_app_id,
      call_app_sign,
      userID,
      userName,
      [ZIM, ZPNs],
      {
        ringtoneConfig: {
          incomingCallFileName: 'zego_incoming.m4r',
          outgoingCallFileName: 'zego_outgoing.m4r',
        },
        requireConfig: data => {
          return {
            ...ONE_ON_ONE_VOICE_CALL_CONFIG,
            //\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
            audioVideoViewConfig: {
              showSoundWavesInAudioMode: true,
            },
            bottomMenuBarConfig: {
              maxCount: 3,
              buttons: [
                ZegoMenuBarButtonName.toggleMicrophoneButton,
                ZegoMenuBarButtonName.hangUpButton,
                ZegoMenuBarButtonName.switchAudioOutputButton,
              ],
            },
            durationConfig: {
              isVisible: true,
            },

            ///\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
          };
        },
        notifyWhenAppRunningInBackgroundOrQuit: true,
        isandroidSandboxEnvironment: true,
        androidNotificationConfig: {
          channelID: 'ZegoUIKit',
          channelName: 'ZegoUIKit',
        },
      },
    );
  };


  // const launchCamera = () => {
  //   const options = {
  //     mediaType: 'photo', // Specify the media type (photo or video)
  //   }
  // }
  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "App Camera Permission",
          message: "App needs access to your camera ",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Camera permission given");
      } else {
        console.log("Camera permission denied");
      }
    } catch (err) {
      console.warn(err, 'requestCameraPermission');
    }
  };
  // const get_profile_pick = useCallback((type, options) => {
  //   requestCameraPermission();
  //   console.log(type, options)
  //   if (type == 'capture') {
  //     ImagePicker.launchCamera(options, res => {
  //       console.log(res, 'r is')
  //       setModalVisible(false);
  //       if (res.didCancel) {
  //         console.log('user cancel');
  //       } else if (res.errorCode) {
  //         console.log(res.errorCode, 'hnjl;m,');
  //       } else if (res.errorMessage, 'redft') {
  //         console.log(res.errorMessage, 'msg');
  //       } else {
  //         setProfileImage(res.assets[0].uri);
  //         setbaseSixtyFourData(res.assets[0].base64);
  //         // profile_picture_update(res.assets[0].uri);
  //       }
  //     });
  const get_profile_pick = useCallback((type, options) => {
    requestCameraPermission();
    console.log(type, options)
    if (type === 'capture') {
      ImagePicker.launchCamera(options, res => {
        console.log(res, 'r is')
        setModalVisible(false);
        if (res.didCancel) {
          console.log('user cancel');
        } else if (res.errorCode) {
          console.log(res.errorCode, 'hnjl;m,');
        } else if (res.errorMessage === 'redft') {
          console.log(res.errorMessage, 'msg');
        } else {
          setProfileImage(res.assets[0].uri);
          setbaseSixtyFourData(res.assets[0].base64);
          // profile_picture_update(res.assets[0].uri);
        }
      });
    } else {
      ImagePicker.launchImageLibrary(options, res => {
        setModalVisible(false);
        if (res.didCancel) {
          console.log('user cancel');
        } else if (res.errorCode) {
          console.log(res.errorCode);
        } else if (res.errorMessage === 'redft') {
          console.log(res.errorMessage);
        } else {
          setProfileImage(res.assets[0].uri);
          setbaseSixtyFourData(res.assets[0].base64);
          // profile_picture_update(res.assets[0].uri);
        }
      });
    }
  }, []);





  //   } else {
  //     ImagePicker.launchImageLibrary(options, res => {
  //       setModalVisible(false);
  //       if (res.didCancel) {
  //         console.log('user cancel');
  //       } else if (res.errorCode) {
  //         console.log(res.errorCode);
  //       } else if (res.errorMessage) {
  //         console.log(res.errorMessage);
  //       } else {
  //         setProfileImage(res.assets[0].uri);
  //         setbaseSixtyFourData(res.assets[0].base64);
  //         // profile_picture_update(res.assets[0].uri);
  //       }
  //     });
  //   }
  // }, []);

  const date_handle = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDateShow(false);
    setDate(currentDate);
  };

  const time_handle = (event, selectedTime) => {
    setTime(selectedTime);
    setTimeShow(false);
  };

  const go_home = () => {
    props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'home',
            state: {
              routes: [
                { name: 'home2', params: { flag: props.route.params?.flag } },
              ],
            },
          },
        ],
      }),
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background_theme1 }}>
      <MyLoader isVisible={isLoading} />
      <ScrollView>
        <View style={{
          flex: 0,
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: height * 0.01,
        }} >
          {/* <Image source={require('../assets/images/camera.png')}  style={{
                  width: width * 0.1,
                  height: width * 0.1,
                  borderRadius: 1000,
                  position:'absolute',
                  bottom:0,
                  alignSelf:'center',
                  right:140

                }}/> */}
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={{
              flex: 0,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: height * 0.01,
              // backgroundColor:'red'
            }}>
            <Image source={require('../assets/images/camera2.png')}
              style={{
                width: width * 0.08,
                height: width * 0.08,
                borderRadius: 1000,
                position: 'absolute',
                bottom: -3,
                alignSelf: 'center',
                right: 2,
                zIndex: 2,
              }} />

            {profileImage == null ? (
              <Image source={require('../assets/images/Dummy_profile.jpg')} style={{
                width: width * 0.3,
                height: width * 0.3,
                borderRadius: 1000,
                zIndex: 1
              }} />
            )
              :
              (
                <Image
                  source={{ uri: profileImage }}
                  style={{
                    width: width * 0.2,
                    height: width * 0.2,
                    borderRadius: 1000,
                  }}
                />
              )}
          </TouchableOpacity>
        </View>
        {/* <View
          style={{
            flex: 0,
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            paddingVertical: 15,
          }}>
          <TouchableOpacity
            onPress={() => setButtonStatus(true)}
            style={{
              ...styles.buttonContainer,
              backgroundColor: buttonStatus
                ? colors.background_theme2
                : colors.background_theme1,
            }}>
            <Text
              style={{
                ...styles.buttonText,
                color: buttonStatus
                  ? colors.background_theme1
                  : colors.black_color8,
              }}>
              Upload Profile
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setButtonStatus(false)}
            style={{
              ...styles.buttonContainer,
              backgroundColor: !buttonStatus
                ? colors.background_theme2
                : colors.background_theme1,
            }}>
            <Text
              style={{
                ...styles.buttonText,
                color: !buttonStatus
                  ? colors.background_theme1
                  : colors.black_color8,
              }}>
              Upload Profile
            </Text>
          </TouchableOpacity>
        </View> */}
        {buttonStatus ? (
          <View style={{ flex: 1, margin: 15 }}>
            <View
              style={{
                flex: 0,
                width: '100%',
                backgroundColor: colors.white_color,
                padding: 10,
              }}>
              <View style={styles.inputContainer}>
                <MaterialCommunityIcons
                  name="account"
                  color={colors.black_color8}
                  size={25}
                />
                <KeyboardAvoidingView
                  behavior={Platform.OS == 'android' ? 'padding' : 'height'}>
                  <TextInput
                    value={firstName}
                    placeholder="Enter first name"
                    placeholderTextColor={colors.black_color10}
                    onChangeText={text => {
                      setFirstName(text);
                    }}
                    style={{
                      // flex: 0,
                      marginLeft: 5,
                      color: colors.black_color10,
                      fontWeight: 'normal',
                      padding: 0,
                      width: width * 0.7
                    }}
                  />
                </KeyboardAvoidingView>
              </View>
              <View style={styles.inputContainer}>
                <MaterialCommunityIcons
                  name="account"
                  color={colors.black_color8}
                  size={25}
                />
                <KeyboardAvoidingView
                  behavior={Platform.OS == 'android' ? 'padding' : 'height'}>
                  <TextInput
                    value={lastName}
                    placeholder="Enter Last name"
                    placeholderTextColor={colors.black_color10}
                    onChangeText={text => {
                      setLastName(text);
                    }}
                    style={{
                      flex: 0,
                      marginLeft: 5,
                      color: colors.black_color10,
                      fontWeight: 'normal',
                      padding: 0,
                      width: width * 0.7
                    }}
                  />
                </KeyboardAvoidingView>
              </View>
              <View style={styles.inputContainer}>
                <MaterialCommunityIcons
                  name="email"
                  color={colors.black_color8}
                  size={25}
                />
                <KeyboardAvoidingView
                  behavior={Platform.OS == 'android' ? 'padding' : 'height'}>
                  <TextInput
                    value={email}
                    placeholder="Enter email"
                    keyboardType="email-address"
                    placeholderTextColor={colors.black_color10}
                    onChangeText={text => {
                      setEmail(text);
                    }}
                    style={{
                      flex: 0,
                      marginLeft: 5,
                      color: colors.black_color10,
                      fontWeight: 'normal',
                      padding: 0,
                      width: width * 0.7

                    }}
                  />
                </KeyboardAvoidingView>
              </View>
              <View style={styles.inputContainer}>
                <MaterialCommunityIcons
                  name="phone"
                  color={colors.black_color8}
                  size={25}
                />
                <TextInput
                  value={phoneNumber}
                  editable={false}
                  placeholder="Enter Mobile Number"
                  placeholderTextColor={colors.black_color10}
                  style={{
                    flex: 0,
                    marginLeft: 5,
                    color: colors.black_color10,
                    fontWeight: 'normal',
                    padding: 0,
                    width: width * 0.7
                  }}
                />
              </View>
              <TouchableOpacity
                onPress={() => setDateShow(true)}
                style={styles.inputContainer}>
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
                    ? 'Date Of Birth'
                    : moment(date).format('Do MMM YYYY')}
                </Text>
              </TouchableOpacity>
              {dateShow && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={date == null ? new Date() : date}
                  maximumDate={new Date()}
                  mode={'date'}
                  is24Hour={true}
                  display='inline'
                  onChange={date_handle}
                />
              )}
              <TouchableOpacity
                onPress={() => setTimeShow(true)}
                style={styles.inputContainer}>
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
                    ? 'Time Of Birth'
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

              {countryData && (
                <View style={[styles.inputContainer, { height: height * 0.07 }]} >
                  <MaterialCommunityIcons
                    name='flag-checkered'
                    color={colors.black_color}
                    size={25}
                  />
                  <DropDownPicker
                    schema={{
                      label: 'name', // required
                      value: 'id', // required
                      icon: 'icon',
                      parent: 'parent',
                      selectable: 'selectable',
                      disabled: 'disabled',
                      testID: 'testID',
                      containerStyle: 'containerStyle',
                      labelStyle: 'labelStyle',
                    }}
                    searchable={true}
                    listMode='MODAL'
                    showTickIcon={true}
                    open={open}
                    dropDownDirection='TOP'
                    placeholder="country"
                    placeholderStyle={{ color: colors.black_color10, fontSize: 14, fontWeight: 'normal', }}
                    value={country}
                    items={countryData}
                    setOpen={setOpen}
                    setValue={setCountry}
                    setItems={setCountryData}
                    zIndex={99}
                    style={{
                      borderColor: 'transparent',
                      width: '90%',
                      justifyContent: 'center',
                      alignItems: 'center',
                      zIndex: 999
                      //  marginBottom: 20,
                      // padding: -2 
                    }}
                  />
                </View>

              )}

              <TouchableOpacity
                onPress={() => {
                  props.navigation.navigate('placeOfBirth', {
                    set_place_of_birth: setBirthPlace,
                    set_lat_long: setLatLong,
                  });
                }}
                style={styles.inputContainer}>
                <MaterialCommunityIcons
                  name="map-marker"
                  color={colors.black_color}
                  size={25}
                />
                <Text style={{ fontSize: 14, color: colors.black_color10 }}>
                  {birthPlace != null ? birthPlace : 'Enter Birth Place'}
                </Text>
              </TouchableOpacity>
              <View
                style={{
                  flex: 0,
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingBottom: 2,
                  paddingHorizontal: 2,
                  marginTop: 20,
                  // backgroundColor: 'red'
                }}>
                <View
                  style={{
                    flex: 0.5,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <BouncyCheckbox
                    size={20}
                    fillColor={colors.background_theme2}
                    unfillColor="#FFFFFF"
                    isChecked={male}
                    disableBuiltInState
                    text="Male"
                    textStyle={styles.checkBoxText}
                    onPress={() => {
                      setMale(true);
                      setFemale(false);
                    }}
                  />
                  <Image source={require('../assets/images/key .png')} style={{
                    // width: width * 0.3,
                    // height: width * 0.3,
                    borderRadius: 1000,

                  }} />
                </View>
                <View
                  style={{
                    // flex: 0.5,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <BouncyCheckbox
                    size={20}
                    fillColor={colors.background_theme2}
                    unfillColor="#FFFFFF"
                    isChecked={female}
                    disableBuiltInState
                    text="Female"
                    textStyle={styles.checkBoxText}
                    onPress={() => {
                      setMale(false);
                      setFemale(true);
                    }}
                  />
                </View>
              </View>
            </View>
          </View>
        ) : (
          <KeyboardAvoidingView
            behavior={Platform.OS == 'android' ? 'padding' : 'height'}
            style={{ flex: 1, margin: 15 }}>
            <View
              style={{ flex: 0, justifyContent: 'center', alignItems: 'center' }}>
              <Text
                style={{
                  fontSize: 20,
                  color: colors.black_color7,
                  fontWeight: 'normal',
                  textAlign: 'center',
                  marginTop: 15,
                }}>
                Welcome to AstroKing
              </Text>
              <Text
                style={{
                  fontSize: 20,
                  color: colors.black_color7,
                  fontWeight: 'normal',
                  textAlign: 'center',
                  marginTop: 25,
                }}>
                Profile Upload
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(true)}
                style={{
                  flex: 0,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 15,
                }}>
                {profileImage == null ? (
                  <MaterialIcons
                    name="account-circle"
                    color={colors.black_color8}
                    size={80}
                  />
                ) : (
                  <Image
                    source={{ uri: profileImage }}
                    style={{
                      width: width * 0.2,
                      height: width * 0.2,
                      borderRadius: 1000,
                    }}
                  />
                )}
                <Text
                  style={{
                    fontSize: 16,
                    color: colors.background_theme2,
                    fontWeight: 'normal',
                    textAlign: 'center',
                    marginTop: 1,
                  }}>
                  Upload profile photo
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flex: 0,
                width: '100%',
                backgroundColor: colors.white_color,
                padding: 15,
                marginTop: 20,
                borderRadius: 5,
                shadowColor: colors.black_color6,
                shadowOffset: {
                  width: -2,
                  height: 2,
                },
                shadowOpacity: 0.3,
              }}>
              <View
                style={{
                  flex: 0,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingBottom: 2,
                  paddingHorizontal: 2,
                  marginTop: 30,
                }}>
                <TouchableOpacity
                  onPress={update_profile}
                  style={{
                    flex: 0,
                    width: width * 0.7,
                    alignSelf: 'center',
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingVertical: 10,
                    borderRadius: width * 0.05,
                    backgroundColor: colors.background_theme2,
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: colors.white_color,
                      fontWeight: 'normal',
                    }}>
                    Upload Picture
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        )}
      </ScrollView>
      <View
        style={{
          flex: 0,
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 30,
          backgroundColor: 'red'
        }}>
        <LinearGradient
          colors={[
            "#ECD4AC",
            "#FF9F00",
          ]}
          style={{
            flex: 0,
            bottom: 0,
            width: width,
            // alignSelf: 'center',
            // justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 15,
            // borderRadius: width * 0.05,
            backgroundColor: colors.background_theme2,
          }}
        >
          <TouchableOpacity
            onPress={update_profile}
          // style={{
          //   flex: 0,
          //   bottom:0,
          //   width: width,
          //   alignSelf: 'center',
          //   justifyContent: 'center',
          //   alignItems: 'center',
          //   paddingVertical: 10,
          //   // borderRadius: width * 0.05,
          //   backgroundColor: colors.background_theme2,
          // }}
          >
            <Text
              style={{
                fontSize: 16,
                color: colors.white_color,
                fontWeight: 600,
                fontWeight: 'bold',
                width: width,
                textAlign: 'center'
                // fontWeight: 'normal',
              }}>
              Submit </Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
      <Modal
        isVisible={modalVisible}
        useNativeDriver={true}
        style={{ padding: 0, margin: 0 }}
        hideModalContentWhileAnimating={true}
        onBackdropPress={() => setModalVisible(false)}>
        <View
          style={{
            flex: 0,
            width: '100%',
            backgroundColor: colors.background_theme1,
            padding: 20,
            position: 'absolute',
            bottom: 0,
          }}>
          <View
            style={{
              flex: 0,
              flexDirection: 'row',
              justifyContent: 'space-around',
              alignItems: 'center',
            }}>
            {actions.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => get_profile_pick(item.type, item.options)}
                style={{ flex: 0, flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons
                  name={item.title == 'Camera' ? 'camera' : 'image'}
                  size={25}
                  color={colors.blue_color5}
                />
                <Text
                  style={{
                    fontSize: 16,
                    color: colors.background_theme2,
                    fontFamily: fonts.medium,
                    marginLeft: 5,
                  }}>
                  {item.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const mapDispatchToProps = dispatch => ({ dispatch });

export default connect(null, mapDispatchToProps)(Signup);

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
    zIndex: -1
  },
  checkBoxText: {
    fontSize: 14,
    color: colors.black_color8,
    fontFamily: fonts.medium,
    textDecorationLine: 'none',
  },
});
