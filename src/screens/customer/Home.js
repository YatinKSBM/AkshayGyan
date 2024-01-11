import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Image,
  StyleSheet,
  Animated,
  ImageBackground,
  RefreshControl,
} from 'react-native';
import React from 'react';
import Carousel from 'react-native-reanimated-carousel';
import { useEffect } from 'react';
import {
  api2_get_profile,
  api_astrolist1,
  api_url,
  base_url,
  colors,
  fonts,
  get_notifications,
  user_get_banner,
} from '../../config/Constants';
import MyStatusBar from '../../components/MyStatusbar';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import { useState } from 'react';
import axios from 'axios';
import HomeSimmer from '../../components/HomeSimmer';
import HomeHeader from '../../components/HomeHeader';
import { connect } from 'react-redux';
import * as UserActions from '../../redux/actions/CustomerActions';

const { width, height } = Dimensions.get('screen');

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const Home = props => {

  console.log('firebase id====',props.firebaseId);
  const [bannerData, setBannerData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [astoListData, setAstroListData] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  useEffect(() => {
    props.navigation.setOptions({
      headerShown: false,

    });
    // console.log(astoListData, 'dcfvgbhnj')
  }, [props.notificationData]);

  useEffect(() => {
    get_astrologer();
    get_banners();
    props.navigation.addListener('focus', () => {
      get_my_notifications();
    });
  }, []);

  const get_banners = async () => {
    await axios({
      method: 'get',
      url: base_url + user_get_banner,
    })
      .then(res => {
        setBannerData(res.data.data);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const get_my_notifications = async () => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + get_notifications,
      data: {
        user_id: props.customerData.id,
      },
    })
      .then(res => {
        setIsLoading(false);
        let un_read = res.data.records.filter(item => item.read == 0);
        props.dispatch(UserActions.setNotifications(res.data.records));
        props.dispatch(UserActions.setNotificationCounts(un_read.length));
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);

      });
  };

  const get_astrologer = async () => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + api_astrolist1,
    })
      .then(res => {
        setIsLoading(false);
        let records = res.data.records.filter(item => item.astro_status != 'Offline')
        setAstroListData(records);
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const astrologer_list = () => {
    props.navigation.navigate('astrologerList');
  };

  const redner_banner = ({ index, item }) => {
    // console.log(item);
    return (
      <View
        style={{
          flex: 1,
          // borderWidth: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image
          source={{ uri: item.sub_cat_img }}
          style={{ width: width * 0.95, height: width / 2.3, borderRadius: 10 }}
          resizeMode="stretch"
        />
      </View>
    );
  };

  const on_referesh = async () => {
    setRefreshing(true);
    await axios({
      method: 'post',
      url: api_url + api_astrolist1,
    })
      .then(res => {
        setRefreshing(false);
        let records = res.data.records.filter(item => item.astro_status != 'Offline')
        setAstroListData(records);
      })
      .catch(err => {
        setRefreshing(false);
        console.log(err);
      });
    setIsLoading(true);
    let data = new FormData();
    data.append('user_id', props.customerData.id);
    await axios({
      method: 'post',
      url: api_url + api2_get_profile,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: data,
    })
      .then(res => {
        setIsLoading(false);
        props.dispatch(UserActions.setWallet(res.data.user_details[0]?.wallet));
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  return (
    <View style={{ flex: 1, }}>
      <MyStatusBar
        backgroundColor={colors.background_theme2}
        barStyle="light-content"
      />
      <View style={{ flex: 1, backgroundColor: colors.black_color1 }}>
        <HomeHeader navigation={props.navigation} headerTitle={"Akshyaa Gyaan"} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={on_referesh} />
          }>
          {bannerData && (
            <Carousel
              loop
              width={width}
              height={width / 2}
              autoPlay={true}
              data={bannerData}
              scrollAnimationDuration={1500}
              autoPlayInterval={5000}
              // onSnapToItem={index => console.log('current index:', index)}
              renderItem={redner_banner}
            />
          )}
          <ScrollView
            nestedScrollEnabled
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              flex: 0,
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 5,
              justifyContent: 'space-between',
              alignContent: 'center',
              // backgroundColor:'pink',
              alignSelf: 'center',
              width: '96%',
              left: 8
            }}>
            <View >
              <TouchableOpacity
                onPress={() => props.navigation.navigate('kundli')}
                style={styles.panchangContainer}>
                <Image
                  source={require('../../assets/images/kundli.png')}
                  style={styles.panchangImage}
                />
              </TouchableOpacity>
              <Text style={styles.punchangText}>Kundli</Text>
            </View>
            <View>
              <TouchableOpacity
                onPress={() => props.navigation.navigate('matching')}
                style={styles.panchangContainer}>
                <Image
                  source={require('../../assets/images/matching.png')}
                  style={styles.panchangImage}
                />
              </TouchableOpacity>
              <Text style={styles.punchangText}>Matching</Text>
            </View>
            <View>
              <TouchableOpacity
                onPress={() => props.navigation.navigate('selectSign')}
                style={styles.panchangContainer}>
                <Image
                  source={require('../../assets/images/Horoscope1.png')}
                  style={styles.panchangImage}
                />
              </TouchableOpacity>
              <Text style={styles.punchangText}>Horoscope</Text>
            </View>
            <View>
              <TouchableOpacity
                onPress={() => props.navigation.navigate('tarotCard')}
                style={styles.panchangContainer}>
                <Image
                  source={require('../../assets/images/tarot-card.png')}
                  style={styles.panchangImage}
                />

              </TouchableOpacity>
              <Text style={styles.punchangText}>Tarot card</Text>
            </View>
          </ScrollView>

          <View
            style={{
              flex: 0,
              width: '95%',
              alignSelf: 'center',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingVertical: 15,

            }}>
            <Text
              style={{
                fontSize: 18,
                color: colors.black_color,
                fontFamily: fonts.bold,
                fontWeight: '600'
              }}>
              Chat With Astrologer
            </Text>
            <TouchableOpacity
              onPress={astrologer_list}
              style={{
                paddingHorizontal: 10,
                paddingVertical: 3,
                borderWidth: 1,
                borderColor: colors.background_theme2,
                borderRadius: 20,
              }}>
              <Text
                style={{
                  fontSize: 12,
                  color: colors.background_theme2,
                  fontFamily: fonts.bold,
                  fontWeight: '600'
                }}>
                VIEW ALL
              </Text>
            </TouchableOpacity>
          </View>
          {isLoading && <HomeSimmer isLoading={false} />}

          {!isLoading && (
            <ScrollView
              horizontal
              nestedScrollEnabled
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                flex: 0,
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 15,
              }}>
              {astoListData &&
                astoListData.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() =>
                      props.navigation.navigate('astrologerDetailes', {
                        data: item,
                        type: 'chat',
                      })
                    }
                    style={{
                      width: width * 0.4,
                      height: width * 0.4,
                      borderRadius: 10,
                      marginHorizontal: 10,
                      backgroundColor: colors.white_color,
                      elevation: 5,
                      borderColor: '#000',
                      justifyContent: 'center',
                      shadowColor: colors.black_color4,
                      shadowOffset: {
                        width: 2,
                        height: 1,
                      },
                      shadowOpacity: 0.2,
                    }}>
                    <View
                      style={{
                        flex: 0,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginHorizontal: height * 0.01,
                      }}>
                      <Image
                        source={require('../../assets/images/green-button.png')}
                        style={{ width: width * 0.07, height: width * 0.07, left: 0, top: 10 }}
                      />
                      {/* {item.offer_deal != '0' && (
                        <View
                          style={{
                            flex: 0,
                            backgroundColor: colors.background_theme2,
                            alignItems: 'center',
                            justifyContent: 'center',
                            alignSelf: 'flex-start',
                            paddingHorizontal: 5,
                            borderTopRightRadius: 10,
                            borderBottomLeftRadius: 10,
                          }}>
                          <Text
                            style={{
                              fontSize: 14,
                              color: colors.white_color,
                              fontFamily: fonts.medium,
                            }}>
                            {item.offer_deal}
                          </Text>
                        </View>
                      )} */}
                    </View>
                    <View
                      style={{
                        flex: 0,
                        position: 'relative',
                        top: -width * 0.03,
                      }}>
                      {/* <View
                        style={{
                          backgroundColor:
                            item.astro_status == 'Online'
                              ? colors.green_color2
                              : colors.yellow_color1,
                          alignSelf: 'flex-end',
                          paddingHorizontal: 5,
                          borderRadius: 10,
                          position: 'relative',
                          top: width * 0.07,
                          right: width * 0.04,
                          zIndex: 2,
                        }}>
                        <Text
                          style={{
                            fontSize: 10,
                            color: colors.white_color,
                            fontFamily: fonts.medium,
                          }}>
                          {item.astro_status}
                        </Text>
                      </View> */}

                      <Image
                        source={{ uri: item.image }}
                        style={{
                          width: width * 0.2,
                          height: width * 0.2,
                          borderRadius: (width * 0.22) / 2,
                          borderWidth: 1,
                          borderColor: colors.background_theme2,
                          alignSelf: 'center',
                          overflow: 'hidden',
                        }}
                      />
                    </View>
                    <View
                      style={{
                        flex: 0,
                        position: 'relative',
                        bottom: width * 0.03,
                      }}>
                      <Text
                        style={{
                          fontSize: 15,
                          color: colors.black_color,
                          fontFamily: fonts.medium,
                          textAlign: 'center',
                          fontWeight: '600',
                          marginTop: 2
                        }}>
                        {item.owner_name}
                      </Text>
                      <View
                        style={{
                          flex: 0,
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: 5,
                          marginTop: 11,

                        }}>
                        <View
                          style={{
                            flex: 0.43,
                            flexDirection: 'row',
                            alignItems: 'center',


                          }}>
                          <Text
                            style={{
                              fontSize: 12,
                              color: colors.black_color,
                              fontFamily: fonts.medium,
                              fontWeight: '600'
                            }}>
                            {`${parseFloat(item.avg_rating).toFixed(1)}/5`}
                          </Text>
                          <Image
                            source={require('../../assets/images/star.png')}
                            style={{ width: 18, height: 18 }}
                          />
                        </View>
                        <View
                          style={{
                            width: 1,
                            height: 12,
                            backgroundColor: colors.black_color7,
                          }}
                        />
                        <View style={{ flex: 0.5 }}>
                          <Text
                            style={{
                              fontSize: 12,
                              color: colors.red_color2,
                              fontFamily: fonts.medium,
                              textAlign: 'center',
                            }}>
                            {`Free ${item.free_minut} min`}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
            </ScrollView>
          )}



          {/* Popular Astrologer  Start*/}

          <View
            style={{
              flex: 0,
              width: '95%',
              alignSelf: 'center',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingVertical: 15,

            }}>
            <Text
              style={{
                fontSize: 18,
                color: colors.black_color,
                fontFamily: fonts.bold,
                fontWeight: '600'
              }}>
              Popular Astrologer
            </Text>
            <TouchableOpacity
              onPress={astrologer_list}
              style={{
                paddingHorizontal: 10,
                paddingVertical: 3,
                borderWidth: 1,
                borderColor: colors.background_theme2,
                borderRadius: 20,
              }}>
              <Text
                style={{
                  fontSize: 12,
                  color: colors.background_theme2,
                  fontFamily: fonts.bold,
                  fontWeight: '600'
                }}>
                VIEW ALL
              </Text>
            </TouchableOpacity>
          </View>
          {isLoading && <HomeSimmer isLoading={false} />}

          {!isLoading && (
            <ScrollView
              horizontal
              nestedScrollEnabled
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                flex: 0,
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 15,
                marginBottom: 30
              }}>
              {astoListData &&
                astoListData.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() =>
                      props.navigation.navigate('astrologerDetailes', {
                        data: item,
                        type: 'call',
                      })
                    }
                    style={{
                      width: width * 0.4,
                      height: width * 0.6,
                      borderRadius: 10,
                      marginHorizontal: 10,
                      marginHorizontal: 10,
                      // shadowColor: colors.black_color4,
                      // shadowOffset: {
                      //   width: 2,
                      //   height: 1,
                      // },
                      // shadowOpacity: 0.2,
                      shadowRadius: 4,
                      overflow: 'hidden',
                      elevation: 2
                    }}>
                    <ImageBackground
                      source={{ uri: item.image }}
                      resizeMode='cover'
                      style={{ width: '100%', height: '100%', backgroundColor: '#fff', justifyContent: 'flex-end' }}
                    >
                      <View
                        style={{
                          backgroundColor: colors.yellow_color5,
                          paddingHorizontal: 10
                        }}>
                        <Text
                          numberOfLines={1}
                          style={{
                            fontSize: 14,
                            color: colors.black_color,
                            fontFamily: fonts.medium,
                            textAlign: 'center',
                            marginVertical: '6%'
                          }}>
                          {item.owner_name}
                        </Text>
                        {/* <Image
                        source={require('../../assets/images/green-button.png')}
                        style={{width: width * 0.07, height: width * 0.07}}
                      /> */}
                        {/* {item.offer_deal != '0' && (
                        <View
                          style={{
                            flex: 0,
                            backgroundColor: colors.background_theme2,
                            alignItems: 'center',
                            justifyContent: 'center',
                            alignSelf: 'flex-start',
                            paddingHorizontal: 5,
                            borderTopRightRadius: 10,
                            borderBottomLeftRadius: 10,
                          }}>
                          <Text
                            style={{
                              fontSize: 14,
                              color: colors.white_color,
                              fontFamily: fonts.medium,
                            }}>
                            {item.offer_deal}
                          </Text>
                        </View>
                      )} */}
                      </View>
                      {/* <View
                      style={{
                        flex: 0,
                        position: 'relative',
                        top: -width * 0.04,
                      }}>
                      <View
                        style={{
                          backgroundColor:
                            item.astro_status == 'Online'
                              ? colors.green_color2
                              : colors.yellow_color1,
                          alignSelf: 'flex-end',
                          paddingHorizontal: 5,
                          borderRadius: 10,
                          position: 'relative',
                          top: width * 0.07,
                          right: width * 0.04,
                          zIndex: 2,
                        }}>
                        <Text
                          style={{
                            fontSize: 10,
                            color: colors.white_color,
                            fontFamily: fonts.medium,
                          }}>
                          {item.astro_status}
                        </Text>
                      </View>
                      <Image
                        source={{uri: item.image}}
                        style={{
                          width: width * 0.2,
                          height: width * 0.2,
                          borderRadius: (width * 0.22) / 2,
                          borderWidth: 1,
                          borderColor: colors.background_theme2,
                          alignSelf: 'center',
                          overflow: 'hidden',
                        }}
                      />
                    </View>
                    <View
                      style={{
                        flex: 0,
                        position: 'relative',
                        bottom: width * 0.03,
                      }}>
                      <Text
                        style={{
                          fontSize: 14,
                          color: colors.black_color,
                          fontFamily: fonts.medium,
                          textAlign: 'center',
                        }}>
                        {item.owner_name}
                      </Text>
                      <View
                        style={{
                          flex: 0,
                          flexDirection: 'row',
                          alignItems: 'center',
                          padding: 5,
                        }}>
                        <View
                          style={{
                            flex: 0.43,
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                          <Text
                            style={{
                              fontSize: 12,
                              color: colors.black_color6,
                              fontFamily: fonts.medium,
                            }}>
                            {`${parseFloat(item.avg_rating).toFixed(1)}/5`}
                          </Text>
                          <Image
                            source={require('../../assets/images/star.png')}
                            style={{width: 18, height: 18}}
                          />
                        </View>
                        <View
                          style={{
                            width: 1,
                            height: 12,
                            backgroundColor: colors.black_color7,
                          }}
                        />
                        <View style={{flex: 0.5}}>
                          <Text
                            style={{
                              fontSize: 12,
                              color: colors.red_color1,
                              fontFamily: fonts.medium,
                              textAlign: 'center',
                            }}>
                            {`Free ${item.free_minut} min`}
                          </Text>
                        </View>
                      </View>
                    </View> */}
                    </ImageBackground>

                  </TouchableOpacity>
                ))}
            </ScrollView>
          )}

        </ScrollView>
      </View>

    </View >
  );
};

const mapStateToProps = state => ({
  customerData: state.customer.customerData,
  wallet: state.customer.wallet,
  notificationData: state.customer.notificationData,
  firebaseId: state.customer.firebaseId,
});

const mapDispatchToProps = dispatch => ({ dispatch });

export default connect(mapStateToProps, mapDispatchToProps)(Home);

const styles = StyleSheet.create({
  panchangContainer: {
    width: width * 0.16,
    height: width * 0.16,
    backgroundColor: colors.background_theme2,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    // shadowOffset: { width: 2, height: 1 },
    // shadowColor: colors.black_color4,
    // shadowOpacity: 0.3,
    marginHorizontal: 10,
  },
  panchangImage: {
    width: width * 0.11,
    height: width * 0.11,
    resizeMode: 'contain',
  },
  punchangText: {
    fontSize: 12,
    fontFamily: fonts.medium,
    marginTop: 4,
    textAlign: 'center'
  },
});
