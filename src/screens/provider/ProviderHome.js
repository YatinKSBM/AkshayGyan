import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert,
  StyleSheet,
  Modal,
  RefreshControl,
} from 'react-native';
import React, { useEffect } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MyStatusBar from '../../components/MyStatusbar';
import {
  api_url,
  astrologer_dashboard,
  boost_astrologer,
  change_status,
  change_status_call,
  colors,
  fonts,
  get_boost_amount,
  next_log_status,
  vedic_images,
  provider_img_url
} from '../../config/Constants';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import database from '@react-native-firebase/database';
import { connect } from 'react-redux';
import { useState } from 'react';
import MyLoader from '../../components/MyLoader';
import axios from 'axios';
import { useCallback } from 'react';
import * as ProviderActions from '../../redux/actions/ProviderActions';
import { Rating, AirbnbRating } from 'react-native-ratings';
import RenderHtml from 'react-native-render-html';
import DateCalender from '../../components/DateCalender';
import moment from 'moment';
import { success_toast, warnign_toast } from '../../components/MyToastMessage';
import {
  CommonActions,
  NavigationContainer,
  useNavigation,
} from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomToggleButton from '../../components/Toggle Swtich/CustomToggleButton';
import { CONSTANTS } from 'react-native-callkeep';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const { width, height } = Dimensions.get('screen');

const ProviderHome = props => {

  

  const [isLoading, setIsLoading] = useState(false);
  const [boostModalVisible, setBoostModalVisible] = useState(false);
  const [callStatus, setCallStatus] = useState(null);
  const [chatStatus, setChatStatus] = useState(null);
  const [isRefereshing, setIsRefereshing] = useState(false);
  const [announcementVisible, setAnnouncementVisible] = useState(false);
  const [messageVisible, setMessageVisible] = useState(false);
  const [date, setDate] = useState(null);
  const [dateVisible, setDateVisible] = useState(false);
  const [chatModalVisible, setChatModalVisible] = useState(false);
  const [callModalVisible, setCallModalVisible] = useState(false);
  
  
  const handleApplyForLive = () => {

    props.navigation.navigate('ApplyForLive', { astro_id: props.providerData.id });

  }

  useEffect(() => {
    props.navigation.setOptions({
      headerShown: false,
    });
  }, []);

  useEffect(() => {
    get_dashboard();
  }, []);


  useEffect(() => {
    if (date) {
      change_next_login();
    }
  }, [dateVisible]);
  
  const get_dashboard = async () => {
    console.log('test')
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + astrologer_dashboard,
      data: {
        astro_id: props.providerData.id,
      },
    })
      .then(res => {
        setIsLoading(false);
        props.dispatch(ProviderActions.setDashboard(res.data));
        props.dispatch(ProviderActions.setProviderData(res.data.data2));
        setCallStatus(res.data.data2.current_status_call);
        setChatStatus(res.data.data2.current_status);
      })
      .catch(err => {
        setIsLoading(false);
        console.log('testaaa',err);
      });
  };
  const on_referesh = useCallback(async () => {
    setIsRefereshing(true);
    await axios({
      method: 'post',
      url: api_url + astrologer_dashboard,
      data: {
        astro_id: props.providerData.id,
      },
    })
      .then(res => {
        
        setIsRefereshing(false);
        props.dispatch(ProviderActions.setDashboard(res.data));
        props.dispatch(ProviderActions.setProviderData(res.data.data2));
        setCallStatus(res.data.data2.current_status_call);
        setChatStatus(res.data.data2.current_status);
      })
      .catch(err => {
        setIsRefereshing(false);
        console.log('testaaa',err);
      });
  });

  const change_call_status = async () => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + change_status_call,
      data: {
        id: props.providerData.id,
        is_online: callStatus == 'Offline' || callStatus.length == 0 ? 1 : 0,
        wait_time: new Date().toString(),
      },
    })
      .then(res => {
        setIsLoading(false);
        setCallModalVisible(false);
        get_dashboard();
      })
      .catch(err => {
        setIsLoading(false);
        console.log('testaaa',err);
      });
  };

  const change_chat_status = async () => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + change_status,
      data: {
        id: props.providerData.id,
        is_online: chatStatus == 'Offline' || chatStatus.length == 0 ? 1 : 0,
        wait_time: new Date().toString(),
      },
    })
      .then(res => {
        setIsLoading(false);
        setChatModalVisible(false);
        get_dashboard();
      })
      .catch(err => {
        setIsLoading(false);
        console.log('testaaa',err);
      });
  };

  const change_next_login = async () => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + next_log_status,
      data: {
        id: props.providerData.id,
        next_login: moment(date).format('yyyy-MM-dd HH:mm:ss'),
      },
    })
      .then(res => {
        setIsLoading(false);
        setDate(null);
        if (res.data.status == 1) {
          // success_toast(res.data.message);
        }
      })
      .catch(err => {
        setIsLoading(false);
        console.log('testaaa',err);
      });
  };

  const get_boost_amount_data = async () => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + get_boost_amount,
      headers: {
        'Content-Type': 'multipart/form-data'
      },
    }).then(res => {
      setIsLoading(false)
      if (res.data.status) {

        if (parseFloat(props.dashboard?.data?.Walletbalance) >= parseFloat(res.data.amount)) {
          boost_astrologer_profile(res.data.amount);
        } else {
          warnign_toast('You don\'t have enough balance for boost...')
        }
      }
    }).catch(err => {
      setIsLoading(false)
      console.log('testaaa',err)
    })
  }

  const boost_astrologer_profile = async (amount) => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + boost_astrologer,
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      data: {
        astro_id: props.providerData.id,
        amount: amount
      }
    }).then(res => {
      setIsLoading(false)
      success_toast('Your profile boosted.')
    }).catch(err => {
      setIsLoading(false)
      console.log('testaaa',err)
    })
  }

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
          if (value == null) {
            go_provider_chat_pickup(message);
          }
        });
      }
    });
    return () => {
      unsubscribe;
    };
  }, []);

  
  return (
    <View style={{ flex: 1, backgroundColor: colors.white_color }}>
      <MyStatusBar
        backgroundColor={colors.background_theme2}
        barStyle="light-content"
      />
      <MyLoader isVisible={isLoading} />
      <View style={{ flex: 0, padding: 15, backgroundColor: colors.yellow_color5 }}>
        <View
          style={{
            flex: 0,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            onPress={() => props.navigation.navigate('providerProfile')}
            style={{ width: 40, height: 40, borderRadius: 50, overflow: 'hidden', marginRight: 10 }}>
            <Image source={{uri : provider_img_url + 'uploads/vendor/' + props.providerData.img_url}}
              resizeMode='contain' style={{ width: 40, height: 40 }} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => props.navigation.navigate('providerProfile')}
            style={{
              flex: 1,
            }}>
            <Text
              numberOfLines={1}
              style={{
                fontSize: 18,
                color: colors.background_theme2,
                fontFamily: fonts.bold,
              }}>
              {props.providerData.owner_name}
            </Text>
            <Text
              numberOfLines={1}
              style={{
                fontSize: 10,
                color: colors.black_color10,
                fontFamily: fonts.medium,
              }}>
              View Profile
            </Text>
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity
              style={{ justifyContent: 'center', alignItems: 'center', width: 40, height: 40, borderRadius: 30, backgroundColor: colors.background_theme2, marginHorizontal: 20 }}
              onPress={() => props.navigation.navigate('astrologerWallet')}
            >
              <Image source={require('../../assets/images/wallet.png')} resizeMode="contain"
                style={{ width: 20, height: 20, tintColor: colors.white_color }} />
            </TouchableOpacity>

            
          </View>
          <TouchableOpacity
            onPress={() => {
              Alert.alert('Wait', 'Are you sure to Logout?', [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'Yes',
                  onPress: () => props.navigation.navigate('logout'),
                },
              ]);
            }}
            style={{ justifyContent: 'center', alignItems: 'center', width: 40, height: 40, borderRadius: 30, backgroundColor: colors.background_theme2 }}>
            <Ionicons
              name="exit"
              color={colors.white_color}
              size={22}
            />
          </TouchableOpacity>
        </View>
      </View>


      <View style={{ flex: 1, }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefereshing}
              onRefresh={on_referesh}
            />
          }>
          {/* Earnings & Followers Row */}
          <View
            style={{
              flex: 0,
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 10,
              justifyContent: 'space-around',
              paddingVertical: 10,
              marginBottom: 10
            }}>
            <View style={styles.boxContainer}>
              <Text
                style={{
                  fontSize: 20,
                  color: colors.black_color8,
                  fontWeight: 'bold',
                  marginBottom: 5
                }}>
                Total
              </Text>
              <Text
                style={{
                  fontSize: 20,
                  color: colors.background_theme2,
                  fontFamily: fonts.semi_bold,
                }}>
                <FontAwesome
                  name="rupee"
                  color={colors.background_theme2}
                  size={18}
                />
                {' '}
                {props.dashboard?.data?.Walletbalance}
              </Text>

            </View>
            <View style={styles.boxContainer}>
              <Text
                style={{
                  fontSize: 20,
                  color: colors.black_color8,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  marginBottom: 5
                }}>
                Today
              </Text>
              <Text
                style={{
                  fontSize: 20,
                  color: colors.background_theme2,
                  fontFamily: fonts.semi_bold,
                }}>
                <FontAwesome
                  name="rupee"
                  color={colors.background_theme2}
                  size={18}
                />{' '}
                {props?.dashboard?.data?.totalincome}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => props.navigation.navigate('providerFollowing')}
              style={styles.boxContainer}>

              <Text
                style={{
                  fontSize: 20,
                  color: colors.black_color8,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  marginBottom: 5
                }}>
                Followers
              </Text>
              <Text
                style={{
                  fontSize: 20,
                  color: colors.background_theme2,
                  fontFamily: fonts.semi_bold,
                }}>
                {props.dashboard?.followers}
              </Text>
            </TouchableOpacity>
          </View>
          {/* five Buttons */}
          <View style={{}}>
            {/* Online Offline four Buttons Start */}
            <View style={{ paddingHorizontal: 20, backgroundColor: colors.black_color2 }}>
              <View
                style={{
                  flex: 0,
                  flexDirection: 'row',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  marginTop: 10,
                }}>
                <View style={{ width: '100%', flexDirection: 'row', marginBottom: 30, justifyContent: 'space-between', }}>
                  <CustomToggleButton status={callStatus} subject={"for Call"} onToggle={() => setCallModalVisible(true)} />
                  <CustomToggleButton status={chatStatus} subject={"for Chat"} onToggle={() => setChatModalVisible(true)} />
                </View>
                <View style={{ width: '100%', flexDirection: 'row', marginBottom: 30, justifyContent: 'space-between', }}>

                  <TouchableOpacity
                    onPress={() => setDateVisible(true)}
                    style={{
                      flex: 0,
                      width: '48%',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: colors.green_color2,
                      paddingVertical: 10,
                      borderRadius: 30,
                      marginBottom: 10,
                      backgroundColor: '#4a69bd',
                    }}>
                    <FontAwesome
                      name="phone"
                      color={colors.white_color}
                      size={18}
                    />
                    <Text
                      style={{
                        fontSize: 14,
                        color: colors.white_color,
                        fontWeight: 'normal',
                        marginLeft: 5,
                      }}>
                      {""} Next Online
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleApplyForLive}
                    style={{
                      flex: 0,
                      width: '48%',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: colors.green_color2,
                      paddingVertical: 10,
                      borderRadius: 30,
                      marginBottom: 10,
                      backgroundColor: colors.pink_color1,
                    }}>
                    <FontAwesome
                      name="video-camera"
                      color={colors.white_color}
                      size={18}
                    />
                    <Text
                      style={{
                        fontSize: 14,
                        color: colors.white_color,
                        fontWeight: 'normal',
                        marginLeft: 5,
                      }}>
                      {""}  Go Live
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            {/* Online Offline four Buttons End */}
            {/* //////// */}
            {/* Astrologer offer button Button Start */}
            <View style={{ alignItems: 'center', paddingVertical: 20, paddingHorizontal: 20, }}>
              <TouchableOpacity
                onPress={() => props.navigation.navigate('providerOffer')}
                style={{
                  width: '100%',
                  padding: 10,
                  backgroundColor: colors.background_theme2,
                  borderRadius: 20,
                  alignItems: 'center'
                }}>
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.white_color,
                    fontFamily: fonts.medium,
                    textAlign: 'center'
                  }}>
                  Astrologer Offer
                </Text>
              </TouchableOpacity>
            </View>
            {/* Astrologer offer button Button Start */}
            <View style={{ paddingVertical: 20, alignItems: 'center', paddingHorizontal: 20, backgroundColor: colors.black_color2 }}>
              <View><Text style={{ fontSize: 20, fontWeight: 'bold' }}>Official Alerts</Text></View>
              <View
                style={{
                  flex: 0,
                  paddingVertical: 5,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 15,
                  borderRadius: 5,
                }}>
                <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', }}>
                  <TouchableOpacity
                    onPress={() => setMessageVisible(true)}
                    style={{
                      flex: 0,
                      width: '48%',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      position: 'relative',
                      backgroundColor: colors.green_color2,
                      paddingVertical: 10,
                      borderRadius: 30,
                      backgroundColor: colors.background_theme2,
                    }}>
                    <Text
                      style={{
                        fontSize: 14,
                        color: colors.white_color,
                        fontWeight: 'normal',
                        marginLeft: 5,
                      }}>
                      Message
                    </Text>
                    <View
                      style={{
                        position: 'absolute', top: -5, right: -10,
                        width: 25, height: 25, backgroundColor: colors.green_color2, borderRadius: 50, alignItems: 'center', justifyContent: 'center'
                      }}>
                      <Text style={{ color: colors.white_color }}>
                        {props.dashboard?.data?.messages.length == 0 ? 0 : props.dashboard.data.messages.length}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setAnnouncementVisible(true)}
                    style={{
                      flex: 0,
                      width: '48%',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      position: 'relative',
                      alignItems: 'center',
                      backgroundColor: colors.green_color2,
                      paddingVertical: 10,
                      borderRadius: 30,
                      backgroundColor: colors.background_theme2,
                    }}>
                    <Text
                      style={{
                        fontSize: 14,
                        color: colors.white_color,
                        fontWeight: 'normal',
                        marginLeft: 5,
                      }}>
                      Announcements
                    </Text>
                    <View
                      style={{
                        position: 'absolute', top: -5, right: -10,
                        width: 25, height: 25, backgroundColor: colors.green_color2, borderRadius: 50, alignItems: 'center', justifyContent: 'center'
                      }}>
                      <Text style={{ color: colors.white_color }}>
                        {props.dashboard?.data?.announcements.length == 0 ? 0 : props.dashboard.data.announcements.length}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/*  three Cards */}
            <View
              style={{
                flex: 0,
                paddingTop: 20,
                paddingHorizontal: 20,
                // backgroundColor: 'grey',
                // backgroundColor: colors.grey,
                borderRadius: 10,
                shadowColor: colors.black_color6,
                shadowOffset: { width: 2, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 5,
              }}>
              <View
                style={{
                  // flex: 0,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 10,
                }}>
                <Image
                  source={require('../../assets/images/performance.png')}
                  resizeMode='contain'
                  style={{ width: 40, height: 40, marginRight: 20 }}
                />
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Performance</Text>
              </View>
              <View
                style={{
                  flex: 0,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  // backgroundColor: 'yellow',
                  marginTop: 10,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    //props.navigation.navigate('createKundali');
                  }}
                  disabled
                  style={{ flex: 0, }}>
                  <View
                    style={{
                      flex: 0,
                      width: width * 0.28,
                      height: width * 0.5,
                      alignItems: 'center',
                      marginBottom: 15,
                      borderRadius: 10,
                      borderColor: colors.background_theme4,
                      borderWidth: 1.5,

                    }}>
                    <View
                      style={{
                        flex: 0,
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingTop: 20
                      }}>
                      <Image source={require('../../assets/images/updown.png')}
                        resizeMode='contain'
                        style={{
                          width: 20, height: 20
                        }} />
                    </View>
                    <View style={styles.boxContainerB}>
                      <Text style={{ fontSize: 12, color: colors.white_color }}>
                        Pickup Rule
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontSize: 22,
                        color: colors.black_color,
                        marginTop: 10,
                        fontWeight: 'bold',
                        textAlign: 'center',
                        // fontFamily: fonts.montserrat_medium,
                      }}>
                      100%
                    </Text>
                    <View style={{ flex: 0, width: '80%' }}>
                      <Text
                        style={{
                          fontSize: 14,
                          color: colors.black_color,
                          marginTop: 5,
                          fontFamily: fonts.medium,
                          textAlign: 'center',
                        }}>
                        {parseFloat(
                          props?.dashboard?.performance?.pickup_rate,
                        ).toFixed(2)}
                        %
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    //props.navigation.navigate('createKundali');
                  }}
                  disabled
                  style={{ flex: 0, }}>
                  <View
                    style={{
                      flex: 0,
                      width: width * 0.28,
                      height: width * 0.5,
                      alignItems: 'center',
                      marginBottom: 15,
                      borderRadius: 10,
                      borderColor: colors.background_theme4,
                      borderWidth: 1.5,

                    }}>
                    <View
                      style={{
                        flex: 0,
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingTop: 20
                      }}>
                      <Image source={require('../../assets/images/updown.png')}
                        resizeMode='contain'
                        style={{
                          width: 20, height: 20,
                          transform: [
                            { scaleY: -1 }
                          ]
                        }} />
                    </View>
                    <View style={styles.boxContainerB}>
                      <Text style={{ fontSize: 12, color: colors.white_color }}>
                        Average Call
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontSize: 22,
                        color: colors.black_color,
                        marginTop: 10,
                        fontWeight: 'bold',
                        textAlign: 'center',
                        // fontFamily: fonts.montserrat_medium,
                      }}>
                      100%
                    </Text>
                    <View style={{ flex: 0, width: '80%' }}>
                      <Text
                        style={{
                          fontSize: 14,
                          color: colors.black_color,
                          marginTop: 5,
                          fontFamily: fonts.medium,
                          textAlign: 'center',
                        }}>
                        {parseFloat(
                          props?.dashboard?.performance?.average_call_duration,
                        ).toFixed(2)}
                        %
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    //props.navigation.navigate('createKundali');
                  }}
                  disabled
                  style={{ flex: 0, }}>
                  <View
                    style={{
                      flex: 0,
                      width: width * 0.28,
                      height: width * 0.5,
                      alignItems: 'center',
                      marginBottom: 15,
                      borderRadius: 10,
                      borderColor: colors.background_theme4,
                      borderWidth: 1.5,

                    }}>
                    <View
                      style={{
                        flex: 0,
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingTop: 20
                      }}>
                      <Image source={require('../../assets/images/rating-star.png')}
                        resizeMode='contain'
                        style={{
                          width: 20, height: 20
                        }} />
                    </View>
                    <View style={styles.boxContainerB}>
                      <Text style={{ fontSize: 12, textAlign: 'center', color: colors.white_color, paddingHorizontal: 5 }}>
                        Overall Rating
                      </Text>
                    </View>
                    <View style={{ flex: 0, width: '80%' }}>
                      <Text
                        style={{
                          fontSize: 22,
                          color: colors.black_color,
                          marginTop: 10,
                          fontWeight: 'bold',
                          textAlign: 'center',
                        }}>
                        5.0
                      </Text>
                      <Rating
                        readonly={true}
                        count={5}
                        imageSize={16}
                        startingValue={5}
                        ratingColor={colors.background_theme4}
                        tintColor={colors.white_color}
                        showRating={false}
                        selectedColor={colors.yellow_color1}
                        style={{
                          alignSelf: 'flex-start',
                          fontSize: 14,
                          color: colors.black_color,
                          marginTop: 5,
                          fontFamily: fonts.medium,
                          textAlign: 'center'
                        }}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            {/* Three Buttons */}
            <View
              style={{
                flex: 0,
                paddingHorizontal: 20,
                // backgroundColor: 'grey',
                // backgroundColor: colors.grey,
                borderRadius: 10,
                shadowColor: colors.black_color6,
                shadowOffset: { width: 2, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 5,
              }}>
              <TouchableOpacity
                onPress={() => props.navigation.navigate('orderHistory')}
                style={{
                  flex: 0,
                  padding: 12,
                  marginVertical: 20,
                  backgroundColor: colors.background_theme2,
                  borderRadius: 30,
                  justifyContent: 'center',
                  flexDirection: 'row',
                }}>
                <Image source={require('../../assets/images/wallet_history.png')}
                  resizeMode='contain'
                  style={{ width: 18, height: 18, marginRight: 10, tintColor: colors.background_theme1 }} />
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.white_color,
                    fontFamily: fonts.medium,
                    textAlign: 'center'
                  }}>
                  Wallet History
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setBoostModalVisible(true)}
                style={{
                  flex: 0,
                  padding: 12,
                  marginBottom: 20,
                  backgroundColor: colors.background_theme2,
                  borderRadius: 30,
                  justifyContent: 'center',
                  flexDirection: 'row',

                }}>
                <Image source={require('../../assets/images/boost.png')}
                  style={{ width: 18, height: 18, marginRight: 10, tintColor: colors.background_theme1 }} />
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.white_color,
                    fontFamily: fonts.medium,
                    textAlign: 'center'
                  }}>
                  Boost Your Profile
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => props.navigation.navigate('providerRemedies')}
                style={{
                  flex: 0,
                  padding: 12,
                  marginBottom: 20,
                  justifyContent: 'center',
                  flexDirection: 'row',
                  backgroundColor: colors.background_theme2,
                  borderRadius: 30,
                }}>
                <Image source={require('../../assets/images/remedy.png')}
                  style={{ width: 18, height: 18, marginRight: 10, tintColor: colors.background_theme1 }} />
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.white_color,
                    fontFamily: fonts.medium,
                    textAlign: 'center'
                  }}>
                  My Remedies
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
      <DateCalender
        date={date == null ? new Date() : date}
        dateVisible={dateVisible}
        setDate={setDate}
        setDateVisible={setDateVisible}
        minimumDate={new Date()}
        mode="datetime"
        display="inline"
      />
      <Modal visible={callModalVisible} transparent={true} animationType="fade">
        <View style={styles.modalContainerA}>
          <View
            style={{ ...styles.modalContainerB, borderRadius: 0, width: '80%' }}>
            <View style={{ flex: 0, width: '100%' }}>
              <Text
                style={{
                  fontSize: 16,
                  color: colors.black_color9,
                  fontFamily: fonts.semi_bold,
                }}>
                Change Offline/Online status?
              </Text>
            </View>

            <Text
              style={{
                fontSize: 13,
                color: colors.black_color6,
                fontFamily: fonts.medium,
                marginVertical: 15,
                textAlign: 'justify'
              }}>
              When your status is online, all user's can see your Otherwise
              user's can't see you in Astrologer list.
            </Text>
            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity
                onPress={() => setCallModalVisible(false)}
                style={{
                  width: '45%',
                  paddingVertical: 8,
                  borderRadius: 5,
                  backgroundColor: colors.black_color2,
                  marginBottom: 10,
                }}>
                <Text
                  style={{
                    fontSize: 18,
                    color: colors.black_color9,
                    fontFamily: fonts.medium,
                    textAlign: 'center',
                  }}>
                  CANCEL
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={change_call_status}
                style={{
                  width: '45%',
                  paddingVertical: 8,
                  borderRadius: 5,
                  backgroundColor: colors.background_theme2,
                  marginBottom: 10,
                }}>
                <Text
                  style={{
                    fontSize: 18,
                    color: colors.white_color,
                    fontFamily: fonts.medium,
                    textAlign: 'center',
                  }}>
                  OK
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal visible={chatModalVisible} transparent={true} animationType="fade">
        <View style={styles.modalContainerA}>
          <View
            style={{ ...styles.modalContainerB, borderRadius: 0, width: '80%' }}>
            <View style={{ flex: 0, width: '100%' }}>
              <Text
                style={{
                  fontSize: 16,
                  color: colors.black_color9,
                  fontFamily: fonts.semi_bold,
                }}>
                Change Offline/Online status?
              </Text>
            </View>

            <Text
              style={{
                fontSize: 13,
                color: colors.black_color6,
                fontFamily: fonts.medium,
                marginVertical: 15,
                textAlign: 'justify'
              }}>
              When your status is online, all user's can see your Otherwise
              user's can't see you in Astrologer list.
            </Text>
            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity
                onPress={() => setChatModalVisible(false)}
                style={{
                  width: '45%',
                  paddingVertical: 8,
                  borderRadius: 5,
                  backgroundColor: colors.black_color2,
                  marginBottom: 10,
                }}>
                <Text
                  style={{
                    fontSize: 18,
                    color: colors.black_color9,
                    fontFamily: fonts.medium,
                    textAlign: 'center',
                  }}>
                  CANCEL
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={change_chat_status}
                style={{
                  width: '45%',
                  paddingVertical: 8,
                  borderRadius: 5,
                  backgroundColor: colors.background_theme2,
                  marginBottom: 10,
                }}>
                <Text
                  style={{
                    fontSize: 18,
                    color: colors.white_color,
                    fontFamily: fonts.medium,
                    textAlign: 'center',
                  }}>
                  OK
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        visible={boostModalVisible}
        transparent={true}
        animationType="slide">
        <View style={styles.modalContainerA}>
          <View style={{ ...styles.modalContainerB }}>
            <Text
              style={{
                fontSize: 18,
                color: colors.background_theme2,
                fontFamily: fonts.semi_bold,
              }}>
              Boost My Profile
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: colors.black_color6,
                fontFamily: fonts.medium,
                textAlign: 'center',
                marginVertical: 15,
              }}>
              You will be featured in Astroking and your share percentage will
              go down by 15% {'\n'}Do You want to proceed?
            </Text>
            {/* <TouchableOpacity
              style={{
                width: '100%',
                backgroundColor: colors.background_theme2,
                paddingVertical: 8,
                borderRadius: 5,
                marginBottom: 20,
              }}>
              <Text
                style={{
                  fontSize: 14,
                  color: colors.background_theme1,
                  fontFamily: fonts.medium,
                  textAlign: 'center',
                }}>
                Yes
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setBoostModalVisible(false)}
              style={{
                width: '100%',
                paddingVertical: 8,
                borderRadius: 5,
                marginBottom: 20,
              }}>
              <Text
                style={{
                  fontSize: 14,
                  color: colors.black_color9,
                  fontFamily: fonts.medium,
                  textAlign: 'center',
                }}>
                Cancel
              </Text>
            </TouchableOpacity> */}

            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity
                onPress={() => setBoostModalVisible(false)}
                style={{
                  width: '45%',
                  paddingVertical: 8,
                  borderRadius: 5,
                  backgroundColor: colors.black_color2,
                  marginBottom: 10,
                }}>
                <Text
                  style={{
                    fontSize: 18,
                    color: colors.black_color9,
                    fontFamily: fonts.medium,
                    textAlign: 'center',
                  }}>
                  CANCEL
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setBoostModalVisible(false)}
                style={{
                  width: '45%',
                  paddingVertical: 8,
                  borderRadius: 5,
                  backgroundColor: colors.background_theme2,
                  marginBottom: 10,
                }}>
                <Text
                  style={{
                    fontSize: 18,
                    color: colors.white_color,
                    fontFamily: fonts.medium,
                    textAlign: 'center',
                  }}>
                  OK
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        visible={announcementVisible}
        transparent={true}
        onRequestClose={() => setAnnouncementVisible(false)}>
        <View style={styles.modalContainerA}>
          <View style={styles.modalContainerBB}>
            <View style={styles.modalContainerC}>
              <Text style={styles.modalTextA}>Announcement</Text>
              <TouchableOpacity
                onPress={() => setAnnouncementVisible(false)}
                style={{ padding: 3 }}>
                <Ionicons
                  name="close-outline"
                  color={colors.black_color8}
                  size={25}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalTextB}>
              <RenderHtml
                contentWidth={width * 0.8}
                source={{
                  html: props?.dashboard?.data?.announcements[0]?.description,
                }}
              />
              {/* {props?.dashboard?.data?.announcements[0]?.description} */}
            </Text>
          </View>
        </View>
      </Modal>
      <Modal
        visible={messageVisible}
        transparent={true}
        onRequestClose={() => setMessageVisible(false)}>
        <View style={styles.modalContainerA}>
          <View style={styles.modalContainerBB}>
            <View style={styles.modalContainerC}>
              <Text style={styles.modalTextA}>Message</Text>
              <TouchableOpacity
                onPress={() => setMessageVisible(false)}
                style={{ padding: 3 }}>
                <Ionicons
                  name="close-outline"
                  color={colors.black_color8}
                  size={25}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalTextB}>
              <RenderHtml
                contentWidth={width * 0.8}
                source={{
                  html: props?.dashboard?.data?.messages[0]?.description,
                }}
              />
            </Text>
          </View>
        </View>
      </Modal>
    </View >
  );
};

const mapStateToProps = state => ({
  providerData: state.provider.providerData,
  dashboard: state.provider.dashboard,
});

const mapDispatchToProps = dispatch => ({ dispatch });

export default connect(mapStateToProps, mapDispatchToProps)(ProviderHome);

const styles = StyleSheet.create({
  boxContainer: {
    flex: 0,
    // width: '33%',
    alignItems: 'center',
  },
  boxContainerA: {
    flex: 0,
    width: '48%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.green_color2,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  boxContainerB: {
    flex: 0,
    width: '90%',
    borderWidth: 1,
    borderColor: colors.white_color,
    height: '20%',
    borderRadius: 20,
    marginTop: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background_theme4,
  },

  modalContainerA: {
    flex: 1,
    backgroundColor: colors.black_color9 + '80',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainerB: {
    flex: 0,
    width: '90%',
    backgroundColor: colors.background_theme1,
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
  },
  modalContainerBB: {
    flex: 0,
    width: '90%',
    backgroundColor: colors.background_theme1,
    borderRadius: 20,
    padding: 15,
    maxHeight: 300,
    overflow: 'scroll',
  },
  modalContainerC: {
    flex: 0,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTextA: {
    fontSize: 16,
    color: colors.background_theme2,
    fontFamily: fonts.semi_bold,
  },
  modalTextB: {
    fontSize: 14,
    color: colors.black_color7,
    fontFamily: fonts.medium,
  },
});
