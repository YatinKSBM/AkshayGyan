import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
  // Modal,
} from 'react-native';
import React from 'react';
import { useEffect } from 'react';
import MyHeader from '../../components/MyHeader';
import {
  api_astrodetails,
  api_checkfollowing,
  api_follow,
  api_getastrochatstatus,
  api_url,
  base_url,
  colors,
  fonts,
  user_review,
} from '../../config/Constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Rating, AirbnbRating } from 'react-native-ratings';
import { useState } from 'react';
import axios from 'axios';
import MyLoader from '../../components/MyLoader';
import Modal from 'react-native-modal';
import { connect } from 'react-redux';
import VerifiedAstrologer from '../provider/VerifiedAstrologer';
import Entypo from 'react-native-vector-icons/Entypo';


const { width, height } = Dimensions.get('screen');

const AstrologerDetailes = props => {
  const [purpose, setPurpose] = useState(null);
  const [astroData] = useState(props.route.params.data);
  const [isLoading, setIsLoading] = useState(false);
  const [astroDetailes, setAstroDetailes] = useState(null);
  const [reviewData, setReviewData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [chatStatus, setChatStaus] = useState('Chat Now');
  const [walletModalVisible, setWalletModalVisible] = useState(false);
  const [isFollow, setIsfollow] = useState('0');
  const [follower, setFollower] = useState('0');

  useEffect(() => {
    props.navigation.setOptions({
      header: () => (
        <MyHeader
          title="Profile"
          navigation={props.navigation}
          statusBar={{
            backgroundColor: colors.background_theme2,
            barStyle: 'light-content',
          }}
        />
      ),
    });
  }, []);

  useEffect(() => {
    if (purpose == 'chat') {
      check_status();
    }
    check_is_follow();
    get_astro_detailes();
    get_user_review();
  }, []);

  const get_astro_detailes = async () => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + api_astrodetails,
      data: {
        id: astroData?.id,
      },
    })
      .then(res => {
        setIsLoading(false);
        setAstroDetailes(res.data);
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const check_status = async () => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + api_getastrochatstatus,
      data: {
        astro_id: astroData.id,
      },
    })
      .then(res => {
        console.log(res.data);
        setIsLoading(false);
        if (res.data.online) {
          setChatStaus('Chat Now');
        } else {
          setChatStaus(res.data.data.current_status);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const get_user_review = async () => {
    setIsLoading(true);
    await axios({
      method: 'get',
      url: base_url + user_review + `id=${astroData?.id}&type=astrologer`,
    })
      .then(res => {
        console.log(res.data)
        setIsLoading(false);
        setReviewData(res.data.data);
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const check_wallet = ({ purpose }) => {

    if (parseFloat(props.wallet) <= 0) {
      setWalletModalVisible(true);
      setPurpose(purpose)
    } else {
      setModalVisible(true);
      setPurpose(purpose)
    }
  };

  const check_is_follow = async () => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + api_checkfollowing,
      data: {
        user_id: props.customerData.id,
        astro_id: astroData.id,
      },
    })
      .then(res => {
        setIsLoading(false);
        if (res.data.records != null) {
          setIsfollow(res.data.records.status);
        } else {
          setIsfollow(0);
        }
        setFollower(res.data.counts);
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const follow_astrologer = async () => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + api_follow,
      data: {
        user_id: props.customerData.id,
        astro_id: astroData.id,
        status: isFollow == '1' ? 0 : 1,
      },
    })
      .then(res => {
        setIsLoading(false);
        check_is_follow();
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  return (
    <View style={{
      flex: 1, backgroundColor: colors.white_color, backgroundColor: colors.background_theme1,
      shadowColor: colors.black_color + '80'
    }}>
      <MyLoader isVisible={isLoading} />
      <View style={{ flex: 1 }}>
        {astroDetailes && (
          <ScrollView showsVerticalScrollIndicator={false} style={{ marginBottom: 30 }}>
            <View
              style={{
                flex: 0,
                paddingHorizontal: 15,
                paddingTop: 15,
                flexDirection: 'row',
                paddingVertical: width * 0.08,
                borderRadius: 20,
                backgroundColor: colors.background_theme1,
                marginTop: 19,

              }}>
              {/* <Text
                style={{
                  fontSize: 16,
                  color: colors.white_color,
                  fontFamily: fonts.bold,
                  textTransform: 'uppercase',
                }}>
                {astroData?.owner_name}
              </Text> */}
              <View
                style={{
                  flex: 0,
                  width: '45%',
                  // alignSelf: 'center',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  // backgroundColor: 'red',
                  flexDirection: 'column',
                  alignItems: 'center',
                  borderRadius: 20,

                  // paddingVertical: width * 0.03,
                  // marginTop: 19,
                }}>
                {astroData.image == null ? (
                  <Image
                    source={{ uri: astroData?.image }}
                    style={{
                      width: width * 0.25,
                      height: width * 0.25,
                      borderWidth: 1,
                      borderRadius: (width * 0.25) / 2,
                      borderColor: colors.background_theme2,
                      position: 'relative',
                      left: (-width * 0.25) / 2,
                    }}
                  />
                ) : (
                  <Image source={require('../../assets/images/chatpic.png')} style={{
                    width: width * 0.25,
                    height: width * 0.25,
                    borderWidth: 1,
                    borderRadius: (width * 0.25) / 2,
                    borderColor: colors.background_theme2,
                    position: 'relative',
                    left: (-width * 0.25) / 4,
                  }} />
                )}

                <Rating
                  readonly={true}
                  de
                  count={5}
                  imageSize={16}
                  startingValue={
                    parseFloat(
                      astroDetailes?.records[0]?.avg_rating,
                    )
                  }
                  showRating={false}
                  selectedColor={colors.background_theme2}
                  style={{ paddingVertical: 10, position: 'relative', alignSelf: 'center', alignContent: 'center', right: 19 }}
                />
              </View>


              <View
                style={{
                  flex: 1,
                  // position: 'relative',
                  justifyContent: 'flex-start',
                  left: (-width * 0.25) / 2.5,
                  // marginTop:8
                }}>
                <View
                  style={{
                    flex: 0,
                    flexDirection: 'row',
                    // alignItems: 'center',
                    // justifyContent: 'space-around',
                    position: 'relative',
                    // bottom: 12,
                  }}>
                  <Text
                    style={{
                      width: '100%',
                      marginLeft: 5,
                      fontSize: 16,
                      color: colors.black_color,
                      fontFamily: fonts.medium,
                      fontWeight: '400'
                    }}>
                    {astroData?.owner_name}
                  </Text>

                  <TouchableOpacity
                    style={{
                      flex: 0,
                      width: '40%',
                      paddingVertical: 2,
                      backgroundColor: colors.background_theme4,
                      borderRadius: 20,
                      right: width * 0.10,
                    }}>
                    <Text
                      style={{
                        fontSize: 13,
                        color: colors.black_color,
                        fontFamily: fonts.medium,
                        textAlign: 'center',
                      }}>
                      Follow
                    </Text>

                  </TouchableOpacity>
                </View>

                <Text
                  style={{
                    width: '100%',
                    marginLeft: 5,
                    fontSize: 12,
                    color: colors.black_color,
                    fontFamily: fonts.medium,
                  }}>
                  {[
                    ...[
                      astroDetailes?.mainexpertise.map(item => item.name),
                    ],
                  ].join(',')}
                </Text>


                <Text
                  style={{
                    width: '100%',
                    marginLeft: 5,
                    fontSize: 12,
                    color: colors.black_color,
                    fontFamily: fonts.medium,
                  }}>
                  {astroDetailes?.records[0]?.language}
                </Text>


                <Text
                  style={{
                    width: '100%',
                    marginLeft: 5,
                    fontSize: 12,
                    color: colors.black_color,
                    fontFamily: fonts.medium,
                  }}>
                  {`Exp: ${astroDetailes?.records[0]?.experience}-Years`}
                </Text>


                <Text
                  style={{
                    fontSize: 14,
                    color: colors.black_color,
                    fontFamily: fonts.medium,
                    marginLeft: 5,
                  }}>
                  {`₹ ${parseFloat(astroDetailes?.records[0]?.call_commission) +
                    parseFloat(astroDetailes?.records[0]?.call_price_m)
                    }/min`}
                </Text>
              </View>

            </View>
            <View style={{
              width: '90%', height: 1, alignSelf: 'stretch', borderBottomColor: colors.gray2, alignSelf: 'center',
              borderBottomWidth: 0.5,
            }} />
            <View
              style={{
                flex: 0,
                width: '95%',
                alignSelf: 'center',
                backgroundColor: colors.background_theme1,
              }}>
              <View
                style={{
                  flex: 0,
                  flexDirection: 'row',
                  alignItems: 'center',
                  // marginBottom: 15,
                  alignSelf: 'center'
                }}>
                <View style={{ flex: 0.6 }}>
                  <View
                    style={{
                      flex: 0.6,
                      width: '90%',

                      flexDirection: 'row',
                      // alignItems: 'center',
                      alignSelf: 'center',
                      alignContent: 'center',
                      marginVertical: 5,
                      justifyContent: 'space-around',
                      marginLeft: '60%'

                    }}>
                    <View>
                      <Text
                        style={{
                          fontSize: 14,
                          color: colors.black_color,
                          fontFamily: fonts.medium,
                          marginLeft: 10,
                        }}>
                        {`₹ ${parseFloat(astroDetailes?.records[0]?.call_commission) +
                          parseFloat(astroDetailes?.records[0]?.call_price_m)
                          }/min`}
                      </Text>
                      <View style={{
                        flexDirection: 'row',
                        flex: 0,
                        marginVertical: height * 0.01,
                        paddingVertical: 2,
                        paddingHorizontal: 1,
                        backgroundColor: colors.background_theme4,
                        borderRadius: 10,
                        // right: width * 0.10,
                        justifyContent: 'space-around'
                      }}>
                        <TouchableOpacity
                          disabled={chatStatus == 'Busy At' || chatStatus == 'Offline'}
                          onPress={() => check_wallet({ purpose: "chat" })}
                          style={{
                            flex: 1,
                            width: '100%',
                            paddingVertical: 15,
                            paddingHorizontal: 10,
                            backgroundColor: colors.background_theme4,
                            borderRadius: 10,
                            justifyContent: 'center',
                            // justifyContent: 'space-between',
                            alignContent: 'space-around'

                            // right: width * 0.10,
                            // direction:'ltr'
                          }}>
                          <Ionicons name={'chatbubble-ellipses-outline'} size={20} style={{ position: 'absolute', marginHorizontal: width * 0.01, alignSelf: 'flex-start', }} color={colors.black_color} />
                          <Text
                            style={{
                              alignSelf: 'flex-end',
                              fontSize: 13,
                              color: colors.black_color,
                              fontFamily: fonts.medium,
                              position: 'absolute',
                              right: 10
                            }}>
                            Chat
                          </Text>

                        </TouchableOpacity>

                      </View>

                    </View>
                    <View style={{
                      height: '100%',
                      width: 1,
                      backgroundColor: colors.black_color,
                      alignSelf: 'center'
                    }
                    } />

                    <View>
                      <Text
                        style={{
                          fontSize: 14,
                          color: colors.black_color,
                          fontFamily: fonts.medium,
                          marginLeft: 10,
                        }}>
                        {`₹ ${parseFloat(astroDetailes?.records[0]?.call_commission) +
                          parseFloat(astroDetailes?.records[0]?.call_price_m)
                          }/min`}
                      </Text>
                      <View style={{
                        flexDirection: 'row', flex: 0,
                        marginVertical: height * 0.01,
                        paddingVertical: 2,
                        paddingHorizontal: 1,
                        backgroundColor: colors.background_theme4,
                        borderRadius: 10,
                        // right: width * 0.10,
                        justifyContent: 'space-around'
                      }}>
                        <TouchableOpacity

                          // disabled={current_status !== "Busy" || current_status_call == 'Online'}
                          // onPress={() => check_wallet()}

                          onPress={() => {
                            // setModalVisible(false);
                            check_wallet({ purpose: "call" })
                            // {
                            //   props.navigation.navigate('callIntakeForm', {
                            //     data: astroData,
                            //   });
                            // }
                          }}

                          style={{
                            flex: 1,
                            width: '50%',
                            paddingVertical: 15,
                            paddingHorizontal: 15,
                            backgroundColor: colors.background_theme4,
                            borderRadius: 10,
                            justifyContent: 'center',
                            // justifyContent: 'space-between',
                            alignContent: 'space-around'

                            // right: width * 0.10,
                            // direction:'ltr'
                          }}>
                          <Ionicons name={'call-outline'} size={20} style={{ position: 'absolute', marginHorizontal: width * 0.01, alignSelf: 'flex-start', }} color={colors.black_color} />

                          <Text
                            style={{
                              alignSelf: 'flex-end',
                              fontSize: 13,
                              color: colors.black_color,
                              fontFamily: fonts.medium,
                              position: 'absolute',
                              right: 10
                            }}>
                            Call
                          </Text>

                        </TouchableOpacity>

                      </View>

                    </View>

                  </View>
                </View>
                <View
                  style={{
                    flex: 0.4,
                    justifyContent: 'center',
                    // alignItems: 'center',
                  }}>
                </View>
              </View>
              <Text
                style={{
                  fontSize: 14,
                  color: colors.black_color,
                  fontFamily: fonts.semi_bold,
                  marginBottom: 10
                }}>
                User Reviews
              </Text>

              {reviewData &&
                reviewData.map((item, index) => (
                  <View style={{
                    paddingVertical: width * 0.02,
                    paddingHorizontal: width * 0.04,
                    // padding: width * 0.02,
                    borderRadius: 10,
                    backdropColor: 'blue',
                    elevation: 5,
                    // borderColor: colors.background_theme2,
                    backgroundColor: colors.background_theme1,
                    shadowColor: colors.black_color + '80',
                    marginBottom: 15
                  }}>
                    <View
                      key={index}
                      style={{
                        flex: 0,
                        flexDirection: 'row',
                        marginBottom: 2,
                        alignItems: 'center',
                        bottom: 0,
                        width: '45%',
                        elevation: 3,
                        shadowColor: colors.black_color4,
                      }}>
                      <View>
                        <Image
                          // source={item.user_profile_image != null ? { uri: item.user_profile_image } : require('../../assets/images/Pro_pic.png')}
                          source={require('../../assets/images/Pro_pic.png')}
                          style={{
                            width: width * 0.10,
                            height: width * 0.10,
                            borderWidth: 0.5,
                            borderColor: colors.background_theme2,
                            borderRadius: 100,
                            position: 'absolute',
                          }}
                        />
                      </View>
                    </View>
                    <View style={{ justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: width * 0.04, flexDirection: 'row', width: '85%', left: width * 0.09, marginLeft: '10%' }}>
                      <Text
                        style={{
                          fontSize: 14,
                          color: colors.black_color,
                          fontFamily: fonts.semi_bold,
                          textAlign: 'center',
                          marginHorizontal: 10,
                          marginVertical: 8,
                        }}>
                        {item.username}
                      </Text>
                      <Entypo name={'dots-three-vertical'} size={18} style={{ marginTop: 5 }} color={colors.black_color} />
                    </View>

                    <View style={{ flex: 1, bottom: 0, marginVertical: width * 0.02 }}>
                      <Rating
                        readonly={true}
                        count={5}
                        imageSize={16}
                        startingValue={parseFloat(item.star).toFixed(1)}
                        ratingColor={colors.background_theme4}
                        tintColor={colors.white_color}
                        showRating={false}
                        selectedColor={colors.yellow_color1}
                        style={{ alignSelf: 'flex-start', marginVertical: 5 }}
                      />
                      <Text
                        style={{
                          // width: '40%',
                          fontSize: 12,
                          color: colors.black_color7,
                          fontFamily: fonts.medium,
                        }}>
                        {item.rating_comment}
                      </Text>
                    </View>
                    {/* </View> */}
                  </View>
                ))}
            </View>

          </ScrollView>
        )}
      </View>
      {walletModalInfo()}
      {chatCallModalInfo()}
    </View >
  );

  function chatCallModalInfo() {
    return (
      <Modal
        isVisible={modalVisible}
        deviceWidth={width}
        deviceHeight={Dimensions.get('window').height}
        backdropColor={colors.black_color}
        style={{ padding: 0, margin: 0 }}>
        <View style={{ flex: 1 }}>
          <View
            style={{
              flex: 0,
              width: '100%',
              padding: 15,
              backgroundColor: colors.background_theme1,
              position: 'absolute',
              bottom: 0,
              borderTopRightRadius: 15,
              borderTopLeftRadius: 15,
            }}>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={{ flex: 0, alignSelf: 'flex-end', padding: 5 }}>
              <Ionicons
                name="close"
                color={colors.black_color}
                size={30}
              />
            </TouchableOpacity>
            <View
              style={{
                flex: 0,
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 15,
              }}>
              <Text
                style={{
                  flex: 0.8,
                  fontSize: 16,
                  color: colors.black_color,
                  fontFamily: fonts.bold,
                }}>
                Balance
              </Text>
              <Text
                style={{
                  flex: 0.6,
                  fontSize: 16,
                  color: colors.black_color,
                  fontFamily: fonts.medium,
                }}>
                ₹ {props.wallet}
              </Text>
            </View>
            <View
              style={{
                flex: 0,
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 15,
              }}>
              <Text
                style={{
                  flex: 0.8,
                  fontSize: 16,
                  color: colors.black_color,
                  fontFamily: fonts.bold,
                }}>
                Max Time Estimated
              </Text>
              <Text
                style={{
                  flex: 0.6,
                  fontSize: 16,
                  color: colors.black_color,
                  fontFamily: fonts.medium,
                }}>
                {(
                  parseFloat(props.wallet) /
                  parseFloat(
                    purpose == 'chat'
                      ? parseFloat(astroData.chat_price_m) + parseFloat(astroData.chat_commission)
                      : parseFloat(astroData.call_price_m) + parseFloat(astroData.call_commission),
                  )
                ).toFixed(0)}{' '}
                Mins
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
                if (purpose == 'chat') {
                  props.navigation.navigate('chatIntakeForm', {
                    data: astroData,
                  });
                } else {
                  props.navigation.navigate('callIntakeForm', {
                    data: astroData,
                  });
                }
              }}
              style={{
                flex: 0,
                width: '100%',
                marginVertical: 10,
                alignItems: 'center',
                paddingVertical: 5,
                flexDirection: 'row',
                justifyContent: 'center',
                backgroundColor: colors.background_theme4,
                borderRadius: 20,
              }}>
              <MaterialIcons
                name={purpose == 'chat' ? 'chat' : 'call'}
                color={colors.background_theme1}
                size={25}
              />
              <Text
                style={{
                  marginHorizontal: 5,
                  fontSize: 16,
                  color: colors.background_theme1,
                  fontFamily: fonts.bold,
                }}>
                {purpose == 'chat'
                  ? 'Start Chat Session'
                  : 'Start Call Session'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    )
  }

  function walletModalInfo() {
    return (
      <Modal
        isVisible={walletModalVisible}
        deviceWidth={width}
        deviceHeight={Dimensions.get('window').height}
        backdropColor={colors.black_color}
        style={{ padding: 0, margin: 0 }}
        onBackdropPress={() => setWalletModalVisible(false)}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              flex: 0,
              width: '90%',
              backgroundColor: colors.background_theme1,
              borderRadius: 10,
            }}>
            <View style={{ padding: 15, alignSelf: 'center' }}>
              <View
                style={{
                  flex: 0,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    flex: 0.9,
                    fontFamily: fonts.bold,
                    fontSize: 16,
                    color: colors.black_color,
                  }}>
                  Insufficient Wallet Balance!!
                </Text>
                <TouchableOpacity
                  onPress={() => setWalletModalVisible(false)}
                  style={{ flex: 0, alignSelf: 'flex-end', padding: 5 }}>
                  <Ionicons
                    name="close-circle"
                    color={colors.black_color}
                    size={30}
                  />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flex: 0,
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginVertical: 10,
                }}>
                <Text
                  style={{
                    flex: 0.8,
                    fontSize: 16,
                    color: colors.background_theme2,
                    fontFamily: fonts.bold,
                  }}>
                  Current Balance
                </Text>
                <Text
                  style={{
                    flex: 0.6,
                    fontSize: 18,
                    color: props.wallet <= 0 ? colors.red2 : colors.background_theme1,
                    fontFamily: fonts.bold,
                  }}>
                  ₹ {props.wallet}
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 14,
                  color: colors.black_color9,
                  fontFamily: fonts.medium,
                }}>
                You must have at least 3 minutes of talking time in your
                wallet
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  color: colors.background_theme4,
                  fontFamily: fonts.bold,
                  marginVertical: 10,
                  textAlign: 'justify'
                }}>
                * Minimum wallet balance is required ₹ 12.0
              </Text>
            </View>

            <View
              style={{
                flex: 0,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 15,
              }}>
              <TouchableOpacity
                onPress={() => props.navigation.navigate('wallet')}
                style={{
                  height: 50, width: '50%', alignItems: 'center', justifyContent: 'center',
                  borderRadius: 15, backgroundColor: colors.background_theme2
                }}>
                <Text
                  style={{
                    fontSize: 18,
                    color: colors.background_theme1,
                    fontFamily: fonts.bold,
                    textAlign: 'center',
                  }}>
                  Recharge
                </Text>
              </TouchableOpacity>
              {/* <Text
                style={{
                  flex: 0.6,
                  fontSize: 16,
                  color: colors.black_color,
                  fontFamily: fonts.medium,
                }}>
                2857 Mins
              </Text> */}
            </View>
          </View>
        </View>
      </Modal >
    )
  }
};

const mapStateToProps = state => ({
  customerData: state.customer.customerData,
  wallet: state.customer.wallet,
});

export default connect(mapStateToProps, null)(AstrologerDetailes);
