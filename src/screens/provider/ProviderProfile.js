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
  img_url,
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
const { width, height } = Dimensions.get('screen');
const ProviderProfile = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [astroDetailes, setAstroDetailes] = useState(null);
  const [reviewData, setReviewData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [chatStatus, setChatStaus] = useState('Chat Now');
  const [walletModalVisible, setWalletModalVisible] = useState(false);
  const [isFollow, setIsfollow] = useState('0');
  const [follower, setFollower] = useState('0');
  const rwdata = [{
    id: 1,
    id: 2
  }]
  useEffect(() => {
    props.navigation.setOptions({
      header: () => (
        <MyHeader
          title="Astrologer Detailes"
          socialIcons={false}
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
    get_astro_detailes();
    get_user_review();
  }, []);

  const get_astro_detailes = async () => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + api_astrodetails,
      data: {
        id: props.providerData.id,
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
  const get_user_review = async () => {
    setIsLoading(true);
    await axios({
      method: 'get',
      url: base_url + user_review + `id=${1}&type=astrologer`,
    })
      .then(res => {
        setIsLoading(false);
        setReviewData(res.data.data);
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };
  return (
    <View style={{ flex: 1, backgroundColor: colors.black_color1 }}>
      <MyLoader isVisible={isLoading} />
      <View style={{ flex: 1 }}>
        {astroDetailes && (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View
              style={{
                flex: 0,
                backgroundColor: colors.black_color3,
                paddingHorizontal: 15,
                paddingVertical: 15,
              }}>

              <View
                style={{
                  flex: 0,
                  width: '100%',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  backgroundColor: colors.background_theme1,
                  borderRadius: 20,
                  elevation: 2,
                  paddingVertical: width * 0.08,
                  paddingHorizontal: width * 0.04,
                }}>
                <View style={{ justifyContent: 'center' }}>
                  <Image
                    source={{ uri: astroDetailes.records[0]?.image }}
                    style={{
                      width: width * 0.25,
                      height: width * 0.25,
                      borderWidth: 2,
                      borderRadius: 100,
                      borderColor: colors.background_theme4,
                    }}
                  />
                </View>
                <View
                  style={{
                    flex: 1,
                    marginHorizontal: width * 0.02,
                    position: 'relative',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: 18,
                      color: colors.black_color,
                      fontFamily: fonts.bold,
                      textTransform: 'uppercase',
                    }}>
                    {astroDetailes.records[0]?.owner_name}
                  </Text>
                  <View
                    style={{ flex: 0, flexDirection: 'row', marginBottom: 2 }}>
                    <Ionicons
                      name="people-circle-sharp"
                      color={colors.black_color}
                      size={15}
                    />
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
                  </View>
                  <View
                    style={{ flex: 0, flexDirection: 'row', marginBottom: 2 }}>
                    <MaterialCommunityIcons
                      name="google-translate"
                      color={colors.black_color}
                      size={15}
                    />
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
                  </View>
                  <View
                    style={{ flex: 0, flexDirection: 'row', marginBottom: 2 }}>
                    <MaterialIcons
                      name="explicit"
                      color={colors.black_color}
                      size={15}
                    />
                    <Text
                      style={{
                        width: '100%',
                        marginLeft: 5,
                        fontSize: 12,
                        color: colors.black_color,
                        fontFamily: fonts.medium,
                      }}>
                      {`Experience: ${astroDetailes?.records[0]?.experience}-Years`}
                    </Text>
                  </View>
                </View>
              </View>
              {/* <View
                style={{
                  flex: 0,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-around',
                  position: 'relative',
                  bottom: 12,
                }}>
                <TouchableOpacity
                  style={{
                    flex: 0,
                    width: '30%',
                    paddingVertical: 2,
                    backgroundColor: colors.background_theme2,
                    borderRadius: 20,
                  }}>
                  <Text
                    style={{
                      fontSize: 13,
                      color: colors.background_theme1,
                      fontFamily: fonts.medium,
                      textAlign: 'center',
                    }}>
                    Today's Deal
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 0,
                    width: '30%',
                    paddingVertical: 2,
                    backgroundColor: colors.background_theme2,
                    borderRadius: 20,
                  }}>
                  <Text
                    style={{
                      fontSize: 13,
                      color: colors.background_theme1,
                      fontFamily: fonts.medium,
                      textAlign: 'center',
                    }}>
                    Special Offer
                  </Text>
                </TouchableOpacity>
              </View> */}
            </View>
            <View style={{ paddingHorizontal: 20 }}>
              <View
                style={{
                  flex: 0,
                  width: '100%',
                  alignSelf: 'center',
                  paddingVertical: 20,
                }}>
                <View
                  style={{
                    flex: 0,
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 15,
                    justifyContent: 'space-between'
                  }}>
                  <View style={{ flex: 0 }}>
                    <Text
                      style={{
                        fontSize: 18,
                        color: colors.background_theme2,
                        fontFamily: fonts.bold,
                      }}>
                      Consultation Charges
                    </Text>
                    <View
                      style={{
                        flex: 0,
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginVertical: 5,
                      }}>
                      <Text
                        style={{
                          fontSize: 14,
                          color: colors.red_color1,
                          fontFamily: fonts.medium,
                          textDecorationLine: 'line-through',
                        }}>
                        {`₹ ${astroDetailes?.records[0]?.consultation_price}/min`}
                      </Text>
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
                    </View>
                  </View>
                  <View
                    style={{
                      flex: 0,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <MaterialIcons name='verified' color={colors.green_color2} size={22} />
                    <Text style={{ fontSize: 14, color: colors.background_theme2, fontFamily: fonts.bold, marginTop: 5 }}>Verified</Text>
                  </View>
                </View>
                <View style={{ flex: 0, marginBottom: 15 }}>
                  <Text
                    style={{
                      fontSize: 18,
                      color: colors.background_theme2,
                      fontFamily: fonts.bold,
                    }}>
                    About Astrologer
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: colors.black_color8,
                      fontFamily: fonts.medium,
                      marginTop: 5,
                      textAlign: 'justify'
                    }}>
                    It is a long established fact that a reader will be distracted
                    by the readable content of a page when looking at its layout.
                  </Text>
                  <TouchableOpacity>
                    <Text
                      style={{
                        fontSize: 14,
                        color: colors.background_theme2,
                        fontFamily: fonts.medium,
                        textDecorationLine: 'underline',
                      }}>
                      Read more
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={{ flex: 0, marginBottom: 15 }}>
                  <Text
                    style={{
                      fontSize: 18,
                      color: colors.background_theme2,
                      fontFamily: fonts.bold,
                      marginBottom: 10,
                    }}>
                    Rating and Reviews
                  </Text>
                  {rwdata &&
                    rwdata.map((item, index) => (
                      <View
                        key={index}
                        style={{
                          flex: 0, flexDirection: 'row',
                          marginBottom: 15,
                          borderRadius: 15,
                          backgroundColor: colors.background_theme1,
                          padding: 15, elevation: 3
                        }}>
                        {/* <Image
                          source={item.user_profile_image != null ? { uri: item.user_profile_image } : require('../../assets/images/logo.png')}
                          style={{
                            width: width * 0.15,
                            height: width * 0.15,
                            borderWidth: 0.5,
                            borderColor: colors.background_theme2,
                            borderRadius: 5,
                          }}
                        /> */}

                        {item.user_profile_image ? <Image
                          source={{ uri: item.user_profile_image }}
                          style={{
                            width: 50,
                            height: 50,
                            borderRadius: 10,
                          }}
                        /> :
                          <View style={{ width: 50, height: 50, backgroundColor: colors.background_theme4, borderRadius: 50, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 20, color: colors.background_theme1 }}>R</Text>
                          </View>
                        }

                        <View style={{ flex: 1, marginLeft: 10 }}>
                          <Text
                            style={{
                              fontSize: 14,
                              color: colors.black_color,
                              fontFamily: fonts.semi_bold,
                            }}>
                            {/* {item.username} */}
                            Ritik Likhar
                          </Text>
                          <Text
                            style={{
                              // width: '40%',
                              fontSize: 12,
                              color: colors.black_color7,
                              fontFamily: fonts.medium,
                            }}>
                            {/* {item.rating_comment} */}
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ips
                          </Text>
                          <Rating
                            readonly={true}
                            count={5}
                            imageSize={16}
                            startingValue={parseFloat(item.star).toFixed(1)}
                            ratingColor={colors.yellow_color1}
                            ratingBackgroundColor={colors.black_color1}
                            tintColor={colors.background_theme1}
                            showRating={false}
                            selectedColor={colors.yellow_color1}
                            style={{ alignSelf: 'flex-start', marginTop: 5 }}
                          />
                        </View>
                      </View>
                    ))}
                </View>
              </View>
            </View>
          </ScrollView>
        )}
      </View>
    </View>
  );
};

const mapStateToProps = state => ({
  providerData: state.provider.providerData,
});

export default connect(mapStateToProps, null)(ProviderProfile);
