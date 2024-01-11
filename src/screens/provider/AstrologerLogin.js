import {
  View,
  Text,
  KeyboardAvoidingView,
  Image,
  Dimensions,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import MyStatusBar from '../../components/MyStatusbar';
import {
  add_or_update_device_token,
  api_url,
  astrologer_dashboard,
  astrologer_login,
  base_url,
  colors,
  fonts,
  vedic_images,
} from '../../config/Constants';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ProviderActions from '../../redux/actions/ProviderActions';
import axios from 'axios';
import { connect } from 'react-redux';
import { CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';
import database from '@react-native-firebase/database';
import MyLoader from '../../components/MyLoader';

const { width, height } = Dimensions.get('screen');

const AstrologerLogin = props => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fcmToken, setFcmToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    get_token();
    props.navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const get_token = async () => {
    let fcm_token = await messaging().getToken();
    setFcmToken(fcm_token);
  };

  const email_validation = e => {
    let email = e;
    let filter =
      /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (filter.test(email.value)) {
      // Yay! valid
      return true;
    } else {
      return false;
    }
  };

  const validation = () => {
    if (email.length == 0) {
      Alert.alert('Please enter your email');
      return false;
    } else if (password.length == 0) {
      Alert.alert('Please enter your password.');
    } else {
      return true;
    }
  };

  const login = async () => {
    if (validation()) {
      setIsLoading(true);
      await axios({
        method: 'post',
        url: base_url + astrologer_login,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: {
          email: email,
          password: password,
        },
      })
        .then(async res => {
          setIsLoading(false);
          if (res.data?.success == '200') {
            await AsyncStorage.setItem(
              'ProviderData',
              JSON.stringify(res.data.data),
            );
            sign_in_with_email_and_password(res.data.data);
          } else {
            Alert.alert('Plese check your email and password.');
          }
        })
        .catch(err => {
          setIsLoading(false);
          Alert.alert(err)
          console.log(err);
        });
    }

  };

  const provider_dashboard = async id => {
    setIsLoading(true)
    await axios({
      method: 'post',
      url: api_url + astrologer_dashboard,
      data: {
        astro_id: id,
      },
    })
      .then(res => {
        setIsLoading(false)
        props.dispatch(ProviderActions.setDashboard(res.data))
        props.dispatch(ProviderActions.setProviderData(res.data.data2));
        home();
      })
      .catch(err => {
        setIsLoading(false)
        console.log(err);
      });
  }

  const sign_in_with_email_and_password = async astrologer => {
    let fcm_token = await messaging().getToken();
    setIsLoading(true)
    await auth()
      .signInWithEmailAndPassword(email, '12345678')
      .then(response => {
        setIsLoading(false)
        console.log(response.user.uid);
        props.dispatch(ProviderActions.setFirebaseId(response.user.uid));
        database()
          .ref(`/Users/${response.user.uid}`)
          .set({
            token: fcm_token,
            name: astrologer.owner_name,
            email: email,
            image: astrologer?.img_url,
            date: new Date().getTime(),
          })
          .then(res => {
            update_fcm_token(astrologer.id, response.user.uid);
          })
          .catch(err => {
            console.log(err);
          });

          database()
          .ref(`/AstroId/${astrologer.id}`)
          .set(response.user.uid)
          .then(res => {
           
          })
          .catch(err => {
            console.log(err);
          });
      })
      .catch(err => {
        setIsLoading(false)
        console.log(err);
        // props.navigation.navigate('signup', {
        //   phone_number: props.route.params.phone_number,
        //   id: id,
        //   flag: props.route.params?.flag,
        // });
      });
  };

  const update_fcm_token = async (user_id, uid) => {
    setIsLoading(true);
    let fcm_token = await messaging().getToken();
    await axios({
      method: 'post',
      url: api_url + add_or_update_device_token,
      headers: {
        'content-type': 'multipart/form-data',
      },
      data: {
        user_id: user_id,
        user_type: 'astrologer',
        device_token: fcm_token,
        token: uid,
      },
    })
      .then(res => {
        setIsLoading(false);
        provider_dashboard(user_id);
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const home = () => {
    props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'providerHome' }],
      }),
    );
  };
  return (
    <View style={{ flex: 1, backgroundColor: colors.white_color }}>
      <MyStatusBar
        backgroundColor={colors.background_theme2}
        barStyle="light-content"
      />
      <MyLoader isVisible={isLoading} />
      <KeyboardAvoidingView
        behavior={Platform.OS == 'android' ? 'padding' : 'height'}
        style={{ flex: 1 }}>
        <ScrollView style={{ flex: 0 }}>
          <Image
            source={vedic_images.provider_login}
            style={{ width: width, height: width * 0.5, marginTop: 40, resizeMode: 'contain' }}
          />
          <View
            style={{
              flex: 0,
              width: width * 0.8,
              alignSelf: 'center',
              marginTop: 20,
            }}>
            <Text
              style={{
                fontSize: 22,
                color: colors.background_theme2,
                fontFamily: fonts.bold,
                textAlign: 'center',
              }}>
              Only For Astrologer
            </Text>
            <View
              style={{
                flex: 0,
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 1000,
                marginTop: 10,
                borderColor: colors.pink_color3,
              }}>
              <View
                style={{
                  flex: 0,
                  width: '40%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginVertical: 10,
                  borderRadius: 1000,
                  paddingVertical: 6,
                }}>
                <Text
                  style={{
                    fontSize: 22,
                    color: colors.black_color,
                    fontFamily: fonts.bold,
                    textAlign: 'center',
                  }}>
                  Login
                </Text>
              </View>
            </View>

            <View style={{ flex: 0 }}>
              <View style={styles.inputContainer}>
                <MaterialCommunityIcons
                  name="email"
                  color={colors.black_color8}
                  size={25}
                />
                <TextInput
                  value={email}
                  placeholder="Enter email address"
                  keyboardType="email-address"
                  cursorColor={colors.black_color}
                  placeholderTextColor={colors.black_color7}
                  onChangeText={text => {
                    setEmail(text);
                  }}
                  style={{
                    flex: 0,
                    width: '80%',
                    marginLeft: 5,
                    color: colors.black_color9,
                    fontFamily: fonts.medium,
                  }}
                />
              </View>

              <View style={styles.inputContainer}>
                <MaterialCommunityIcons
                  name="lock"
                  color={colors.black_color8}
                  size={25}
                />
                <TextInput
                  value={password}
                  placeholder="Password"
                  cursorColor={colors.black_color}
                  placeholderTextColor={colors.black_color7}
                  secureTextEntry={true}
                  onChangeText={text => {
                    setPassword(text);
                  }}
                  style={{
                    flex: 0,
                    width: '80%',
                    marginLeft: 5,
                    color: colors.black_color9,
                    fontFamily: fonts.medium,
                  }}
                />
              </View>
              <TouchableOpacity
                onPress={() => props.navigation.navigate('forgetPassword')}
                style={{ flex: 0, alignSelf: 'flex-end', marginTop: 10 }}>
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.black_color8,
                    fontFamily: fonts.medium,
                  }}>
                  Forget Password?
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={login}
                style={{
                  flex: 0,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 25,
                  borderRadius: width * 0.55,
                  backgroundColor: colors.background_theme2,
                  paddingVertical: 12,
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    color: colors.white_color,
                    fontWeight: 'normal',
                    fontWeight: 'bold'
                  }}>
                  Login
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => props.navigation.navigate('verifiedAstrologer')}
                style={{
                  flex: 0,
                  width: '80%',
                  alignSelf: 'center',
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderRadius: 100,
                  marginVertical: 30,
                  borderWidth: 2,
                  borderColor: colors.Maroon,
                  backgroundColor: colors.white_color,
                  shadowRadius: 5,
                }}>
                <View
                  style={{
                    flex: 0,
                    alignSelf: 'center',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 50,
                    height: 50,
                    borderRadius: 30,
                    borderWidth: 2,
                    borderLeftWidth: 1,
                    borderColor: colors.Maroon,
                    backgroundColor: colors.yellow_color5,
                    shadowRadius: 5,
                  }}>
                  <MaterialCommunityIcons
                    name="account-check"
                    color={colors.black_color}
                    size={35}
                  />
                </View>
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.black_color9,
                    fontFamily: fonts.b,
                    textAlign: 'center',
                    marginLeft: 20
                  }}>
                  Register for {'\n'}Astrologer account
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const mapDispatchToProps = dispatch => ({ dispatch });

export default connect(null, mapDispatchToProps)(AstrologerLogin);

const styles = StyleSheet.create({
  inputContainer: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.black_color3,
    paddingHorizontal: 10,
    borderColor: colors.black_color6,
    borderRadius: 25,
    marginTop: 15,
    fontFamily: fonts.medium,
  },
});
