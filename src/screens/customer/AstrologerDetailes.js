import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList
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
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Rating, AirbnbRating } from 'react-native-ratings';
import { useState } from 'react';
import axios from 'axios';
import MyLoader from '../../components/MyLoader';
import Modal from 'react-native-modal';
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';

const reviews = [
  1, 2, 3
]

const { width, height } = Dimensions.get('screen');

const AstrologerDetailes = props => {
  const [purpose, setPurpose] = useState(props?.route?.params?.type);
  const [astroData] = useState(props.route.params.data);
  const [isLoading, setIsLoading] = useState(false);
  const [astroDetailes, setAstroDetailes] = useState(null);
  const [reviewData, setReviewData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [chatStatus, setChatStaus] = useState('Chat Now');
  const [callStatus, setCallStatus] = useState('Call Now');
  const [walletModalVisible, setWalletModalVisible] = useState(false);
  const [isFollow, setIsfollow] = useState('0');
  const [follower, setFollower] = useState('0');

  useEffect(() => {
    props.navigation.setOptions({
      header: () => (
        <MyHeader
          title="Astrologer Details"
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
          <FlatList
            ListHeaderComponent={
              <>
                {profileInfo()}
                {chatCallButtonInfo()}
                {userReviews()}
              </>
            }
          />
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

  function userReviews() {
    const renderItem = ({ item }) => {
      return (
        <View style={{
          paddingVertical: width * 0.02,
          paddingHorizontal: width * 0.04,
          borderRadius: 10,
          elevation: 2,
          backgroundColor: colors.background_theme1,
          marginBottom: 10
        }}>
          <View
            key={item.rating_id}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: '100%',
              shadowColor: colors.black_color4,
            }}>
            <View style={{ width: '15%' }}>
              <View style={{ width: width * 0.1, height: width * 0.1, alignItems: 'center' }}>
                <Image
                  source={item.user_profile_image != null ? require('../../assets/images/logo.png') : require('../../assets/images/logo.png')}
                  style={{
                    width: '100%',
                    height: '100%',
                    borderWidth: 0.5,
                    borderColor: colors.background_theme2,
                    borderRadius: 100,
                    resizeMode: 'contain'
                  }}
                />
              </View>
            </View>
            <View style={{ width: '85%' }}>
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 14,
                  color: colors.black_color,
                  fontFamily: fonts.semi_bold,
                }}>
                {item.username}
              </Text>
            </View>
          </View>
          <Rating
            readonly={true}
            count={5}
            imageSize={12}
            startingValue={item.star}
            showRating={false}
            selectedColor={colors.background_theme2}
            style={{ alignSelf: 'flex-start', marginVertical: 5 }}
          />
          <Text
            style={{
              fontSize: 12,
              color: colors.black_color7,
              fontFamily: fonts.medium,
            }}>
            {item.rating_comment}
          </Text>
        </View>
      )
    }
    return (
      <View
        style={{
          flex: 0,
          paddingHorizontal: width * 0.04,
          borderRadius: 20,
          backgroundColor: colors.background_theme1
        }}>
        <Text
          style={{
            fontSize: 14,
            color: colors.black_color,
            fontFamily: fonts.semi_bold,
            marginBottom: 10
          }}>
          User Reviews
        </Text>

        <FlatList data={reviewData}
          renderItem={renderItem} />
      </View>
    )
  }

  function chatCallButtonInfo() {
    return (
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: width * 0.04,
          borderRadius: 20,
        }}>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            marginVertical: 10,
            justifyContent: 'space-between',
          }}>

          {purpose == 'popular' ?
            (
              <>
                <View style={{ width: '47%', alignItems: 'center', justifyContent: 'center' }}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: colors.black_color,
                      fontFamily: fonts.medium,
                      marginLeft: 10,
                      marginBottom: 10,
                    }}>
                    {`₹ ${parseFloat(astroDetailes?.records[0]?.call_commission) +
                      parseFloat(astroDetailes?.records[0]?.call_price_m)
                      }/min`}
                  </Text>
                  <LinearGradient
                    style={{
                      width: '100%',
                      paddingVertical: 10,
                      paddingHorizontal: 10,
                      borderRadius: 10,
                      justifyContent: 'center',
                      flexDirection: 'row',
                      alignItems: 'center'
                    }}
                    colors={[colors.background_theme2, colors.yellow_color3]}>
                    <TouchableOpacity
                      disabled={chatStatus == 'Busy At' || chatStatus == 'Offline'}
                      onPress={() => check_wallet({ purpose: "call" })}
                      style={{

                        flexDirection: 'row',
                        alignItems: 'center'
                      }}
                    >
                      <Ionicons name={'call'} size={20} color={colors.white_color} />
                      <Text
                        style={{
                          fontSize: 13,
                          color: colors.white_color,
                          fontFamily: fonts.medium,
                          marginHorizontal: 5
                        }}>
                        {callStatus}
                      </Text>
                    </TouchableOpacity>
                  </LinearGradient>
                </View>
                <View style={{ width: '47%', alignItems: 'center', justifyContent: 'center' }}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: colors.black_color,
                      fontFamily: fonts.medium,
                      marginLeft: 10,
                      marginBottom: 10,
                    }}>
                    {`₹ ${parseFloat(astroDetailes?.records[0]?.chat_commission) +
                      parseFloat(astroDetailes?.records[0]?.chat_price_m)
                      }/min`}
                  </Text>
                  <LinearGradient
                    style={{
                      width: '100%',
                      paddingVertical: 10,
                      paddingHorizontal: 10,
                      borderRadius: 10,
                      justifyContent: 'center',
                      flexDirection: 'row',
                      alignItems: 'center'
                    }}
                    colors={[colors.background_theme2, colors.yellow_color3]}>
                    <TouchableOpacity
                      disabled={chatStatus == 'Busy At' || chatStatus == 'Offline'}
                      onPress={() => check_wallet({ purpose: "call" })}
                      style={{

                        flexDirection: 'row',
                        alignItems: 'center'
                      }}
                    >
                      <Ionicons name={'chatbubble-ellipses'} size={20} color={colors.white_color} />
                      <Text
                        style={{
                          fontSize: 13,
                          color: colors.white_color,
                          fontFamily: fonts.medium,
                          marginHorizontal: 5
                        }}>
                        {chatStatus}
                      </Text>
                    </TouchableOpacity>
                  </LinearGradient>
                </View>
              </>
            ) :
            purpose == "call" ? (
              <LinearGradient
                style={{ width: '100%', borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}
                colors={[colors.background_theme2, colors.yellow_color3]}>
                <TouchableOpacity
                  disabled={chatStatus == 'Busy At' || chatStatus == 'Offline'}
                  onPress={() => check_wallet({ purpose: "call" })}
                  style={{
                    width: '100%',
                    paddingVertical: 10,
                    paddingHorizontal: 10,
                    borderRadius: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                    alignItems: 'center'
                  }}>
                  <Ionicons name={'call'} size={20} color={colors.white_color} style={{ marginRight: 5 }} />
                  <Text
                    style={{
                      fontSize: 14,
                      color: colors.white_color,
                      fontFamily: fonts.medium
                    }}>
                    Call
                  </Text>
                  <View style={{
                    width: 1, border: 1, height: '100%', backgroundColor: colors.white_color,
                    marginHorizontal: 10
                  }} />
                  <Text
                    style={{
                      fontSize: 14,
                      color: colors.white_color,
                      fontFamily: fonts.medium,
                    }}>
                    {`₹ ${parseFloat(astroDetailes?.records[0]?.call_commission) +
                      parseFloat(astroDetailes?.records[0]?.call_price_m)
                      }/min`}
                  </Text>
                </TouchableOpacity>
              </LinearGradient>
            ) :
              (
                <LinearGradient
                  style={{ width: '100%', borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}
                  colors={[colors.background_theme2, colors.yellow_color3]}>
                  <TouchableOpacity
                    disabled={chatStatus == 'Busy At' || chatStatus == 'Offline'}
                    onPress={() => check_wallet({ purpose: "chat" })}
                    style={{
                      width: '100%',
                      paddingVertical: 10,
                      paddingHorizontal: 10,
                      borderRadius: 10,
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexDirection: 'row',
                      alignItems: 'center'
                    }}>
                    <Ionicons name={'chatbubble-ellipses'} size={20} color={colors.white_color} style={{ marginRight: 5 }} />
                    <Text
                      style={{
                        fontSize: 14,
                        color: colors.white_color,
                        fontFamily: fonts.medium
                      }}>
                      Chat
                    </Text>
                    <View style={{
                      width: 1, border: 1, height: '100%', backgroundColor: colors.white_color,
                      marginHorizontal: 10
                    }} />
                    <Text
                      style={{
                        fontSize: 14,
                        color: colors.white_color,
                        fontFamily: fonts.medium,
                      }}>
                      {`₹ ${parseFloat(astroDetailes?.records[0]?.chat_commission) +
                        parseFloat(astroDetailes?.records[0]?.chat_price_m)
                        }/min`}
                    </Text>
                  </TouchableOpacity>
                </LinearGradient>
              )
          }
        </View>
      </View>
    )
  }

  function profileInfo() {
    return (
      <View>
        <View
          style={{
            flex: 0,
            flexDirection: 'row',
            paddingHorizontal: width * 0.04,
            paddingVertical: width * 0.05,
            borderRadius: 20,
            backgroundColor: colors.background_theme1
          }}>
          {/* Profile and rating */}
          <View
            style={{
              width: '30%',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 20,
            }}>
            <View style={{ width: width * 0.25 }}>
              {astroData.image !== null ? (
                <Image
                  source={{ uri: astroData?.image }}
                  style={{
                    width: '100%',
                    height: width * 0.25,
                    borderWidth: 2,
                    borderRadius: (width * 0.25) / 2,
                    borderColor: colors.white_color,
                    position: 'relative',
                    elevation: 5
                  }}
                />
              ) : (
                <Image source={require('../../assets/images/logo.png')} style={{
                  width: '100%',
                  height: width * 0.25,
                  borderWidth: 1,
                  borderRadius: (width * 0.25) / 2,
                  borderColor: colors.background_theme2,
                  position: 'relative'
                }} />

              )}
            </View>
            <Rating
              readonly={true}
              count={5}
              imageSize={16}
              startingValue={
                parseFloat(
                  astroDetailes?.records[0]?.avg_rating,
                )
              }
              showRating={false}
              selectedColor={colors.background_theme2}
              style={{ marginTop: 10 }}
            />
          </View>
          {/* Profile and rating */}

          {/*................................ AStrologer details ................................*/}
          {/* name and follow button */}
          <View
            style={{
              width: '70%',
              paddingLeft: 10
              // backgroundColor: 'red'
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  fontSize: 16,
                  width: '70%',
                  color: colors.background_theme2,
                  fontFamily: fonts.medium,
                  fontWeight: '400'
                }}>
                {astroData?.owner_name}
              </Text>
              <TouchableOpacity
                style={{
                  width: '30%',
                  paddingVertical: 2,
                  backgroundColor: colors.background_theme4,
                  borderRadius: 20,
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
            <View style={{ marginTop: 2 }}>
              <Text
                style={{
                  width: '100%',
                  fontSize: 12,
                  color: colors.black_color,
                  fontFamily: fonts.medium,
                }}>
                {[
                  ...[
                    astroDetailes?.mainexpertise.map(item => item.name),
                  ],
                ].join(', ')}
              </Text>
              <Text
                style={{
                  width: '100%',
                  fontSize: 12,
                  color: colors.black_color,
                  fontFamily: fonts.medium,
                }}>
                {astroDetailes?.records[0]?.language}
              </Text>
              <Text
                style={{
                  width: '100%',
                  fontSize: 12,
                  color: colors.black_color,
                  fontFamily: fonts.medium,
                }}>
                {`Exp: ${astroDetailes?.records[0]?.experience} Years`}
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: colors.black_color,
                  fontFamily: fonts.medium,
                  marginTop: 3
                }}>
                {`₹ ${parseFloat(astroDetailes?.records[0]?.call_commission) +
                  parseFloat(astroDetailes?.records[0]?.call_price_m)
                  }/min`}
              </Text>
            </View>
          </View>
        </View>
        <View style={{ paddingHorizontal: width * 0.04 }}>
          <Text
            style={{
              fontSize: 16,
              color: colors.black_color,
              fontFamily: fonts.semi_bold
            }}>
            Bio
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: colors.gray2,
              fontFamily: fonts.medium,
            }}>
            {astroData.short_bio}
          </Text>
        </View>

        <View style={{
          width: '90%',
          alignSelf: 'center',
          borderBottomColor: colors.gray2,
          borderBottomWidth: 0.5,
        }} />
      </View >
    )
  }
};

const mapStateToProps = state => ({
  customerData: state.customer.customerData,
  wallet: state.customer.wallet,
});

export default connect(mapStateToProps, null)(AstrologerDetailes);
