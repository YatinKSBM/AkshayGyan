import {
  View,
  Text,
  Dimensions,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  TextInput,
  Platform,
  ScrollView,
  Pressable,
  Linking,
} from 'react-native';
import React, { useEffect } from 'react';
import MyStatusBar from '../components/MyStatusbar';
import { api_url, colors, fonts, user_web_api_login } from '../config/Constants';
import { useState } from 'react';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import MyLoader from '../components/MyLoader';
import axios from 'axios';
import { CommonActions } from '@react-navigation/native';
import MyToolTipAlert from '../components/MyToolTipAlert';
import messaging from '@react-native-firebase/messaging';
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import CountryPicker from 'react-native-country-picker-modal';

import { success_toast, warnign_toast } from '../components/MyToastMessage';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('screen');
const Login = props => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [isAstrodate, setIsAstroDate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toolTipVisible, setToolTipVisible] = useState(false);
  const [validation, setValidation] = useState(false);
  const [verificationId, setVerificationId] = useState('');
  const [code, setCode] = useState({ callingCode: '91', cca2: 'IN' });

  useEffect(() => {
    props.navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const number_validation = () => {
    if (phoneNumber.length != 10) {
      setValidation(true);
      setToolTipVisible(true);
      return false;
    }
    else if (!isChecked) {
      warnign_toast('Please check terms and conditions box.');
      return false;
    }
    else {
      return true;
    }
  };

  const login = async () => {
    if (number_validation()) {
      setIsLoading(true);
      let fcm_token = await messaging().getToken();
      console.log(fcm_token);
      await axios({
        method: 'get',
        url:
          api_url +
          user_web_api_login +
          `number=${phoneNumber}&token=${fcm_token}`,
      })
        .then(res => {
          console.log(res.data);
          setIsLoading(false);
          if (res.data.status == 1) {
            if (res.data.new_user == 0) {
              props.navigation.navigate('otp', {
                phone_number: phoneNumber,
                otp: res.data.otp,
                flag: isAstrodate ? 1 : 0,
                // code: confirmation.verificationId,
              });
            } else {
              go_home();
            }
          } else {
            warnign_toast(res.data.msg);
          }
        })
        .catch(err => {
          setIsLoading(false);
          console.log(err);
        });
    }
  };

  const signInWithPhoneNumber = async () => {
    try {
      const confirmation = await auth().signInWithPhoneNumber(
        `+91${phoneNumber}`,
      );
      setVerificationId(confirmation.verificationId);
      console.log(confirmation.verificationId);
      props.navigation.navigate('otp', {
        phone_number: phoneNumber,
        otp: 1234,
        code: confirmation.verificationId,
      });
    } catch (error) {
      console.log(error);
      warnign_toast(
        'We have blocked all requests from this device due to unusual activity. Try again later.',
      );
    }
  };

  const handle_phone_number = text => {
    setPhoneNumber(text);
    setValidation(false);
  };

  const openWhatsApp = () => {
    const phoneNumber = '+916371133825'; // Replace with the desired phone number
    const text = 'Hello AstroKing\nI need some help.'; // Replace with the desired pre-filled text

    const url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(
      text,
    )}`;

    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          console.log('WhatsApp is not installed on this device');
          warnign_toast('WhatsApp is not installed on this device');
        }
      })
      .catch(error => console.log(error));
  };

  const go_home = () => {
    props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'home' }],
      }),
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background_theme1 }}>
      <MyStatusBar backgroundColor={colors.background_theme2} barStyle='light-content' />
      <MyLoader isVisible={isLoading} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            top: 25
          }}
        >
          <Image source={require('../assets/images/logo1.png')}
            resizeMode="contain"
            style={{

              width: 166, // flex: 0,
              height: 164,
              alignSelf: 'center',
              marginTop: height * 0.05,
            }} />


          <Text
            style={{
              textAlign: 'center',
              fontSize: 28,
              color: colors.Maroon,
              fontFamily: fonts.bold,
              marginTop: 10,
              marginBottom: 10,
              fontWeight: '700'
            }}>
            {isAstrodate ? 'Astrodate' : 'AkshyaGyan'}
          </Text>
        </View>
        <View style={{
          // backgroundColor:'green',
          alignItems: 'center', justifyContent: 'center', marginHorizontal: 10, marginVertical: 25, marginTop: height * 0.15,
        }}>
          <KeyboardAvoidingView
            behavior={Platform.OS == 'android' ? 'padding' : 'height'}>
            <View
              style={{
                flex: 0,
                width: '100%',
                alignSelf: 'center',
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: colors.black_color3,
                paddingHorizontal: 10,
                borderRadius: 25,
                marginBottom: 25,

                // backgroundColor:colors.black_color
              }}>
              {/* <View style={{ width: 40, height: 25 }}>
                <CountryPicker
                  countryCode={code.cca2}
                  withCallingCode={true}
                  withFilter={true}
                  withEmoji={true}
                  // withFlagButton={false}
                  // renderFlagButton={(item)=><Text>{item.placeholder}</Text>}
                  onSelect={(text) => setCode({ callingCode: text.callingCode, cca2: text.cca2 })}
                />
              </View> */}
              <Text style={{ fontSize: 14, color: colors.black_color, fontFamily: fonts.medium, alignSelf: 'center', marginHorizontal: 5 }}>
                {`${code.cca2} +${code.callingCode}`}
              </Text>
              <TextInput
                placeholder="Enter Mobile No"
                placeholderTextColor={colors.black_color}
                keyboardType='numeric'
                maxLength={10}
                onChangeText={handle_phone_number}
                style={{ width: '70%', fontSize: 14, color: colors.black_color, }}
              />
              {validation && (
                <MyToolTipAlert
                  visible={toolTipVisible}
                  setToolTipVisible={setToolTipVisible}
                  placement={'bottom'}
                  text="Invalid Mobile number!"
                />
              )}
            </View>
          </KeyboardAvoidingView>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={login}
            style={{
              flex: 0,
              width: '100%',
              alignSelf: 'center',
              flexDirection: 'row',
              alignItems: 'center',
              borderRadius: 25,
              marginBottom: height * 0.02,
              paddingVertical: 12,
              backgroundColor: colors.background_theme2,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{ fontSize: 16, color: colors.background_theme1, fontWeight: 'bold' }}>
              Login
            </Text>
          </TouchableOpacity>
          <View
            style={{
              flex: 0,
              // flexDirection: 'row',
              width: '90%',
              // alignItems:'flex-start',
              justifyContent: 'space-between',
              marginBottom: height * 0.02,
              // backgroundColor: 'pink'
            }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <BouncyCheckbox
                size={20}
                fillColor={colors.background_theme2}
                onPress={() => setIsChecked(!isChecked)}
                innerIconStyle={{
                  borderRadius: 5,
                  backgroundColor: isChecked
                    ? colors.background_theme2
                    : colors.background_theme1,
                  padding: 8,
                  borderColor: isChecked
                    ? colors.background_theme1
                    : colors.background_theme2,
                }}
              />
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                <Text>
                  I have read and agree to the {' '}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: colors.light_red,
                    textDecorationLine: 'underline',
                    alignContent: 'space-between',
                    // marginLeft: height * 0.02,
                  }}>
                  Terms of Use
                </Text>
                <Text>{' '}&{' '}</Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: colors.light_red,
                    textDecorationLine: 'underline',
                  }}>
                  Privacy Policy
                </Text>
              </View>
            </View>
            {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignSelf: 'stretch', }}>
              <TouchableOpacity
                // onPress={() =>
                //   Linking.openURL(
                //     'https://astrokingtech.com/terms-and-conditions.html',
                //   )
                // }
                style={{ minHeight: 0, paddingTop: 4, width: '50%', }}>
                <Text
                  style={{
                    fontSize: 12,
                    color: colors.light_red,
                    textDecorationLine: 'underline',
                    alignContent: 'space-between',
                    // marginLeft: height * 0.02,
                  }}>
                  Terms of Use
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                // onPress={() =>
                //   Linking.openURL(
                //     'https://astrokingtech.com/privacy-policy.html',
                //   )
                // }
                style={{ minHeight: 3, paddingTop: 4 }}>
                <Text
                  style={{
                    fontSize: 12,
                    color: colors.light_red,
                    textDecorationLine: 'underline',
                  }}>
                  Privacy Policy
                </Text>
              </TouchableOpacity>
            </View> */}
            {/* </Text> */}
          </View>
        </View>
        <View style={{
          // backgroundColor:'pink',
          marginTop: height * 0.07,
        }}>
          <View
            style={{
              flex: 0,
              flexDirection: 'row',
              justifyContent: 'space-around',
              alignItems: 'center',
              marginBottom: height * 0.02,

            }}>
            <LinearGradient
              colors={[
                "#EECD95",
                "#FFA819",

              ]}
              style={styles.loginButtonContainer}

            >
              <TouchableOpacity
                onPress={() => props.navigation.navigate('astrologerLogin')}
              // style={styles.loginButtonContainer}
              >
                <Text style={styles.loginButtonText}>Astrologer Login</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
          <TouchableOpacity
            onPress={() => openWhatsApp()}
            style={{
              flex: 0,
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
            }}>
            {/* <MaterialIcons
              name="support-agent"
              color={colors.background_theme2}
              size={50}
            /> */}
            <Image
              source={require('../assets/images/Headphone.png')}
              resizeMode="contain"
              style={{

                // width: 166, // flex: 0,
                // height: 164,
                alignSelf: 'center',
                marginVertical: height * 0.01,
              }}
            />
            <Text
              style={{
                fontSize: 14,
                color: colors.black_color6,
                fontFamily: fonts.medium,
              }}>
              Help and Support
            </Text>
          </TouchableOpacity>
          {/* </ImageBackground> */}
        </View>
      </ScrollView >
    </View >
  );
};

export default Login;

const styles = StyleSheet.create({
  loginButtonContainer: {
    flex: 0,
    width: '40%',
    paddingVertical: 10,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: colors.background_theme2,
  },
  loginButtonText: {
    fontSize: 14,
    color: colors.background_theme1,
    fontFamily: fonts.medium,
  },
});
