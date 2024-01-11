import { View, Text, Dimensions, Image } from 'react-native';
import React, { useEffect } from 'react';
import { CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ProviderActions from '../redux/actions/ProviderActions';
import * as CustomerActions from '../redux/actions/CustomerActions';
import database from '@react-native-firebase/database';
import { connect } from 'react-redux';
import axios from 'axios';
import {
  api2_get_profile,
  api_url,
  astrologer_dashboard,
  call_app_id,
  call_app_sign,
  colors,
  fonts,
} from '../config/Constants';

import ZegoUIKitPrebuiltCallService, {
  ONE_ON_ONE_VOICE_CALL_CONFIG,
  ZegoMenuBarButtonName,
} from '@zegocloud/zego-uikit-prebuilt-call-rn';
import * as ZIM from 'zego-zim-react-native';
import * as ZPNs from 'zego-zpns-react-native';
import messaging from '@react-native-firebase/messaging';
import NotificationHandle from '../components/NotificationHandle';
import { useState } from 'react';
import MyStatusBar from '../components/MyStatusbar';

const { width, height } = Dimensions.get('screen');

const Splash = props => {
  const [modalVisible, setModalVisible] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    props.navigation.setOptions({
      headerShown: false,
    });
    setTimeout(() => {
      navigate();
    }, 2000);
  }, []);

  const get_is_request_active = async () => {
    try {
      const value = await AsyncStorage.getItem('request');
      return value;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const go_provider_chat_pickup = async message => {
    await AsyncStorage.setItem('request', '1').then(res => {
      props.navigation.replace('providerChatPickup', { message: message });
    });
  };

  useEffect(() => {
    const unsubscribe = messaging().onMessage(remoteMessage => {
      let message = remoteMessage.data;
      
      if (message?.type == 'Request') {
        get_is_request_active().then(value => {
          if (value == '0') {
            go_provider_chat_pickup(message);
          }
        });
      }
    });
    return () => {
      unsubscribe;
    };
  }, []);

  const navigate = async () => {
    let providerData = await AsyncStorage.getItem('ProviderData');
    let customerData = await AsyncStorage.getItem('customerData');
    let data = JSON.parse(providerData);
    let custData = JSON.parse(customerData);
    if (data) {
      provider_dashboard(data.id);
    } else if (custData) {
      get_customer_firebase_id(custData.id);
    } else {
      got_to_login();
    }
  };

  const get_customer_firebase_id = id => {
    database()
      .ref(`UserId/${id}`)
      .on('value', snapchat => {
        props.dispatch(CustomerActions.setFirebaseId(snapchat?.val()));
        customer_profile(id);
      });
  };

  const get_provider_firebase_id = id => {

    database()
      .ref(`AstroId/${id}`)
      .on('value', snapchat => {
        console.log(snapchat?.val())
        props.dispatch(ProviderActions.setFirebaseId(snapchat?.val()));
        provider_home();
      });
  };

  const customer_profile = async id => {
    let data = new FormData();
    data.append('user_id', id);
    await axios({
      method: 'post',
      url: api_url + api2_get_profile,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: data,
    })
      .then(res => {
        props.dispatch(
          CustomerActions.setCustomerData(res.data.user_details[0]),
        );
        props.dispatch(
          CustomerActions.setWallet(res.data.user_details[0]?.wallet),
        );
        // onUserLogin(
        //   res.data.user_details[0].id,
        //   res.data.user_details[0].username,
        // );
        customer_home();
      })
      .catch(err => {
        console.log(err);
      });
  };

  const provider_dashboard = async id => {
    console.log('test=======',id)
    await axios({
      method: 'post',
      url: api_url + astrologer_dashboard,
      data: {
        astro_id: id,
      },
    })
      .then(res => {

        props.dispatch(ProviderActions.setDashboard(res.data));
        props.dispatch(ProviderActions.setProviderData(res.data.data2));
        get_provider_firebase_id(id);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const provider_home = () => {
    props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'providerHome' }],
      }),
    );
  };

  const customer_home = () => {
    props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'home' }],
      }),
    );
  };

  const got_to_login = () => {
    props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'login' }],
      }),
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F8C97B', alignItems: 'center', justifyContent: 'center' }}>
      <MyStatusBar backgroundColor={colors.background_theme2} barStyle='light-content' />
      {/* <ImageBackground
        source={require('../assets/images/back.png')}
        style={{
          width: width,
          height: height,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        resizeMode="cover"> */}
      <Image
        source={require('../assets/images/logo1.png')}
        style={{ width: width * 0.4, height: width * 0.4 }}
        resizeMode="contain"
      />
      <View
        style={{
          flex: 0,
          width: '95%',
          alignSelf: 'center',
          flexDirection: 'row',
          alignItems: 'center',
          borderRadius: 25,
          marginBottom: height * 0.02,
          paddingVertical: 10,
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: height * 0.10,
          borderColor: colors.black_color,
          borderWidth: 1
        }}>

        <Text style={{ fontWeight: '700', fontSize: 12, fontFamily: fonts.medium, fontWeight: '400' }}>Stars Aligned: Your Astrology Guide on Akshya Gyaan!</Text>
      </View>
      {/* </ImageBackground> */}
      {modalVisible && (
        <NotificationHandle
          message={message}
          visible={modalVisible}
          setModalVisible={setModalVisible}
        />
      )}
    </View>
  );
};

const mapStateToProps = state => ({
  requestData: state.provider.requestData,
  providerData: state.provider.providerData,
});
const mapDispatchToProps = dispatch => ({ dispatch });

export default connect(mapStateToProps, mapDispatchToProps)(Splash);
