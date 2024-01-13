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
  FlatList,
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
import { TextInput } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('screen');

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const Home = props => {
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
        <HomeHeader navigation={props.navigation} headerTitle={"Akshya Gyaan"} />
        <FlatList
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={on_referesh} />
          }
          ListHeaderComponent={
            <>
              {searchBarInfo()}
              {bannerData && bannerInfo()}
              {freeInsights()}
              {astoListData && astroForChat()}
              {astoListData && astroForCall()}
              {astoListData && popularAstrologers()}
            </>
          } />
      </View>
    </View >
  );

  function popularAstrologers() {
    const renderItem = ({ item }) => {
      const formatFollowers = (followers) => {
        if (followers >= 1000) {
          const formattedValue = Math.floor(followers / 1000); // Get the floor value for thousands
          return `${formattedValue}k`;
        }
        return followers.toString();
      };

      return (
        <TouchableOpacity
          activeOpacity={0.8}
          key={item.id}
          onPress={() =>
            props.navigation.navigate('astrologerDetailes', {
              data: item,
              type: 'popular'
            })
          }
          style={{
            borderRadius: width * 0.03,
            marginHorizontal: width * 0.02,
            backgroundColor: colors.white_color,
            elevation: 5,
            borderColor: '#000',
            justifyContent: 'center',
            paddingVertical: width * 0.02,
            paddingHorizontal: width * 0.03,
            width: width * 0.35,
            position: 'relative'
          }}>
          <View
            style={{
              position: 'absolute',
              left: 1,
              top: 1,
              zIndex: 3
            }}>
            <Image
              source={require('../../assets/images/green-button.png')}
              style={{ width: width * 0.07, height: width * 0.07, }}
            />
          </View>
          <View
            style={{
              flex: 0,
              width: width * 0.2,
              height: width * 0.2,
              alignSelf: 'center',
              borderRadius: 100,
              overflow: 'hidden',
              borderWidth: 2.5,
              borderColor: colors.white_color,
              elevation: 5
            }}>
            <Image
              source={item.image ? { uri: item.image } : require('../../assets/images/logo.png')}
              style={{
                width: '100%',
                height: '100%',
                resizeMode: 'cover'
              }}
            />
          </View>
          <View style={{ marginTop: width * 0.02 }}>
            <Text
              numberOfLines={1}
              style={{
                fontSize: 14,
                color: colors.black_color7,
                fontFamily: fonts.medium,
                textAlign: 'center',
                fontWeight: '600',
                marginTop: 2,
                textTransform: 'capitalize'
              }}>
              {item.owner_name}
            </Text>
            <View style={{
              flexDirection: 'row', justifyContent: 'space-between',
              marginVertical: 3, alignItems: 'center'
            }}>
              <View style={{
                flexDirection: 'row', justifyContent: 'center', width: '50%'
              }}>
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: width * 0.03,
                    color: colors.black_color,
                    fontFamily: fonts.medium,
                    fontWeight: '600'
                  }}>
                  {`${parseFloat(item.avg_rating).toFixed(1)}/5`}
                </Text>
                <Image
                  source={require('../../assets/images/star.png')}
                  style={{ width: width * 0.04, height: width * 0.04 }}
                />
              </View>
              <View
                style={{
                  width: 1,
                  height: width * 0.05,
                  backgroundColor: colors.black_color4,
                  marginRight: 2
                }}
              />
              <View style={{ flexDirection: 'row', justifyContent: 'center', width: '40%' }}>
                <Ionicons name="people" style={{ fontSize: width * 0.04, color: colors.background_theme4 }} />
                <Text
                  style={{
                    fontSize: width * 0.03,
                    fontFamily: fonts.semi_bold,
                    color: colors.black_color7,
                    marginLeft: width * 0.01
                  }}>
                  {formatFollowers(item.followers)}
                </Text>
              </View>
            </View>
          </View >
        </TouchableOpacity >
      )
    }
    return (
      <>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 15,
            paddingTop: 5,
            paddingBottom: 15,
            paddingHorizontal: 15
          }}>
          <Text
            style={{
              fontSize: width * 0.042,
              color: colors.black_color,
              fontFamily: fonts.bold,
              fontWeight: '600'
            }}>
            Popular Astrologers
          </Text>
          <TouchableOpacity
            onPress={astrologer_list}
            style={{
              paddingHorizontal: width * 0.02,
              paddingVertical: width * 0.01,
              borderWidth: 1,
              borderColor: colors.background_theme2,
              borderRadius: 20,
            }}>
            <Text
              style={{
                fontSize: width * 0.025,
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
          <FlatList
            data={astoListData}
            renderItem={renderItem}
            horizontal
            contentContainerStyle={{ paddingHorizontal: width * 0.02, paddingBottom: width * 0.04 }}
          />
        )}
      </>
    )
  }

  function astroForCall() {
    const renderItem = ({ item }) => {
      const formatFollowers = (followers) => {
        if (followers >= 1000) {
          const formattedValue = Math.floor(followers / 1000); // Get the floor value for thousands
          return `${formattedValue}k`;
        }
        return followers.toString();
      };

      return (
        <TouchableOpacity
          activeOpacity={0.8}
          key={item.id}
          onPress={() =>
            props.navigation.navigate('astrologerDetailes', {
              data: item,
              type: 'call',
            })
          }
          style={{
            borderRadius: width * 0.03,
            marginHorizontal: width * 0.02,
            backgroundColor: colors.white_color,
            elevation: 5,
            borderColor: '#000',
            justifyContent: 'center',
            paddingVertical: width * 0.02,
            paddingHorizontal: width * 0.03,
            width: width * 0.35,
            position: 'relative'
          }}>
          <View
            style={{
              position: 'absolute',
              left: 1,
              top: 1,
              zIndex: 3
            }}>
            <Image
              source={require('../../assets/images/green-button.png')}
              style={{ width: width * 0.07, height: width * 0.07, }}
            />
          </View>
          {/* Followers Number */}
          <View
            style={{
              padding: width * 0.01,
              width: width * 0.06,
              height: width * 0.1,
              position: 'absolute',
              alignItems: 'center',
              zIndex: 10,
              justifyContent: 'center',
              backgroundColor: colors.yellow_color2,
              borderBottomLeftRadius: 10,
              borderTopRightRadius: width * 0.02,
              position: 'absolute',
              right: 0,
              top: 0,
            }}>
            <Ionicons name="people" style={{ fontSize: 10 }} />
            <Text
              style={{
                fontSize: width * 0.02,
                fontFamily: fonts.semi_bold,
                color: colors.background_theme2,
              }}>
              {formatFollowers(item.followers)}
            </Text>
          </View>
          {/* Followers Number */}
          <View
            style={{
              flex: 0,
              width: width * 0.2,
              height: width * 0.2,
              alignSelf: 'center',
              borderRadius: 100,
              overflow: 'hidden',
              borderWidth: 2.5,
              borderColor: colors.white_color,
              elevation: 5
            }}>
            <Image
              source={item.image ? { uri: item.image } : require('../../assets/images/logo.png')}
              style={{
                width: '100%',
                height: '100%',
                resizeMode: 'cover'
              }}
            />
          </View>
          <View style={{ marginTop: width * 0.02 }}>
            <Text
              numberOfLines={1}
              style={{
                fontSize: 14,
                color: colors.black_color7,
                fontFamily: fonts.medium,
                textAlign: 'center',
                fontWeight: '600',
                marginTop: 2,
                textTransform: 'capitalize'
              }}>
              {item.owner_name}
            </Text>
            <View style={{
              backgroundColor: colors.yellow_color2,
              borderRadius: 10,
              alignSelf: 'center',
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: width * 0.02,
              paddingVertical: width * 0.01,
              marginVertical: width * 0.015
            }}>
              <Ionicons name="call" style={{ marginHorizontal: width * 0.01, color: colors.background_theme2 }} />
              <Text
                numberOfLines={1}
                style={{
                  fontSize: width * 0.03,
                  color: colors.black_color7,
                  fontFamily: fonts.medium,
                  textAlign: 'center',
                  fontWeight: '600',
                }}>
                {`₹ ${parseFloat(item?.call_commission) +
                  parseFloat(item?.call_price_m)
                  }/min`}
              </Text>
            </View>
            <View style={{
              flexDirection: 'row', justifyContent: 'space-between',
              marginVertical: 3, alignItems: 'center'
            }}>
              <View style={{
                flexDirection: 'row', justifyContent: 'center', width: '40%'
              }}>
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: width * 0.025,
                    color: colors.black_color,
                    fontFamily: fonts.medium,
                    fontWeight: '600'
                  }}>
                  {`${parseFloat(item.avg_rating).toFixed(1)}/5`}
                </Text>
                <Image
                  source={require('../../assets/images/star.png')}
                  style={{ width: width * 0.04, height: width * 0.04 }}
                />
              </View>
              <View
                style={{
                  width: 1,
                  height: width * 0.05,
                  backgroundColor: colors.black_color4,
                }}
              />
              <View style={{ flexDirection: 'row', justifyContent: 'center', width: '60%' }}>
                <Text
                  style={{
                    fontSize: width * 0.025,
                    color: colors.green_color1,
                    fontFamily: fonts.medium,
                    textAlign: 'center',
                  }}>
                  {`Free ${item.free_minut} min`}
                </Text>
              </View>
            </View>
          </View >
        </TouchableOpacity >
      )
    }
    return (
      <>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 15,
            paddingTop: 5,
            paddingBottom: 15,
            paddingHorizontal: 15
          }}>
          <Text
            style={{
              fontSize: width * 0.042,
              color: colors.black_color,
              fontFamily: fonts.bold,
              fontWeight: '600'
            }}>
            Astrologers for Call
          </Text>
          <TouchableOpacity
            onPress={astrologer_list}
            style={{
              paddingHorizontal: width * 0.02,
              paddingVertical: width * 0.01,
              borderWidth: 1,
              borderColor: colors.background_theme2,
              borderRadius: 20,
            }}>
            <Text
              style={{
                fontSize: width * 0.025,
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
          <FlatList
            data={astoListData}
            renderItem={renderItem}
            horizontal
            contentContainerStyle={{ paddingHorizontal: width * 0.02, paddingBottom: width * 0.04 }}
          />
        )}
      </>
    )
  }

  function astroForChat() {
    const renderItem = ({ item }) => {
      const formatFollowers = (followers) => {
        if (followers >= 1000) {
          const formattedValue = Math.floor(followers / 1000); // Get the floor value for thousands
          return `${formattedValue}k`;
        }
        return followers.toString();
      };

      return (
        <TouchableOpacity
          activeOpacity={0.8}
          key={item.id}
          onPress={() =>
            props.navigation.navigate('astrologerDetailes', {
              data: item,
              type: 'chat',
            })
          }
          style={{
            borderRadius: width * 0.03,
            marginHorizontal: width * 0.02,
            backgroundColor: colors.white_color,
            elevation: 5,
            borderColor: '#000',
            justifyContent: 'center',
            paddingVertical: width * 0.02,
            paddingHorizontal: width * 0.03,
            width: width * 0.35,
            position: 'relative'
          }}>
          <View
            style={{
              position: 'absolute',
              left: 1,
              top: 1,
              zIndex: 3
            }}>
            <Image
              source={require('../../assets/images/green-button.png')}
              style={{ width: width * 0.07, height: width * 0.07, }}
            />
          </View>
          {/* Followers Number */}
          <View
            style={{
              padding: width * 0.01,
              width: width * 0.06,
              height: width * 0.1,
              position: 'absolute',
              alignItems: 'center',
              zIndex: 10,
              justifyContent: 'center',
              backgroundColor: colors.yellow_color2,
              borderBottomLeftRadius: 10,
              borderTopRightRadius: width * 0.02,
              position: 'absolute',
              right: 0,
              top: 0,
            }}>
            <Ionicons name="people" style={{ fontSize: 10 }} />
            <Text
              style={{
                fontSize: width * 0.02,
                fontFamily: fonts.semi_bold,
                color: colors.background_theme2,
              }}>
              {formatFollowers(item.followers)}
            </Text>
          </View>
          {/* Followers Number */}
          <View
            style={{
              flex: 0,
              width: width * 0.2,
              height: width * 0.2,
              alignSelf: 'center',
              borderRadius: 100,
              overflow: 'hidden',
              borderWidth: 2.5,
              borderColor: colors.white_color,
              elevation: 5
            }}>
            <Image
              source={item.image ? { uri: item.image } : require('../../assets/images/logo.png')}
              style={{
                width: '100%',
                height: '100%',
                resizeMode: 'cover'
              }}
            />
          </View>
          <View style={{ marginTop: width * 0.02 }}>
            <Text
              numberOfLines={1}
              style={{
                fontSize: 14,
                color: colors.black_color7,
                fontFamily: fonts.medium,
                textAlign: 'center',
                fontWeight: '600',
                marginTop: 2,
                textTransform: 'capitalize'
              }}>
              {item.owner_name}
            </Text>
            <View style={{
              backgroundColor: item.current_status ? colors.yellow_color2 : colors.yellow_color5,
              borderRadius: 10,
              alignSelf: 'center',
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: width * 0.02,
              paddingVertical: width * 0.01,
              marginVertical: width * 0.015
            }}>
              <Ionicons name="call" style={{ marginHorizontal: width * 0.01, color: colors.background_theme2 }} />
              <Text
                numberOfLines={1}
                style={{
                  fontSize: width * 0.03,
                  color: colors.black_color7,
                  fontFamily: fonts.medium,
                  textAlign: 'center',
                  fontWeight: '600',
                }}>
                {`₹ ${parseFloat(item?.chat_commission) +
                  parseFloat(item?.chat_price_m)
                  }/min`}
              </Text>
            </View>
            <View style={{
              flexDirection: 'row', justifyContent: 'space-between',
              marginVertical: 3, alignItems: 'center'
            }}>
              <View style={{
                flexDirection: 'row', justifyContent: 'center', width: '40%'
              }}>
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: width * 0.025,
                    color: colors.black_color,
                    fontFamily: fonts.medium,
                    fontWeight: '600'
                  }}>
                  {`${parseFloat(item.avg_rating).toFixed(1)}/5`}
                </Text>
                <Image
                  source={require('../../assets/images/star.png')}
                  style={{ width: width * 0.04, height: width * 0.04 }}
                />
              </View>
              <View
                style={{
                  width: 1,
                  height: width * 0.05,
                  backgroundColor: colors.black_color4,
                }}
              />
              <View style={{ flexDirection: 'row', justifyContent: 'center', width: '60%' }}>
                <Text
                  style={{
                    fontSize: width * 0.025,
                    color: colors.green_color1,
                    fontFamily: fonts.medium,
                    textAlign: 'center',
                  }}>
                  {`Free ${item.free_minut} min`}
                </Text>
              </View>
            </View>
          </View >
          {/* <View
            style={{
              flex: 0,
              position: 'relative',
              bottom: width * 0.03,
            }}>

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
          </View> */}
        </TouchableOpacity >
      )
    }
    return (
      <>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 15,
            paddingHorizontal: 15
          }}>
          <Text
            style={{
              fontSize: width * 0.042,
              color: colors.black_color,
              fontFamily: fonts.bold,
              fontWeight: '600'
            }}>
            Astrologers for Chat
          </Text>
          <TouchableOpacity
            onPress={astrologer_list}
            style={{
              paddingHorizontal: width * 0.02,
              paddingVertical: width * 0.01,
              borderWidth: 1,
              borderColor: colors.background_theme2,
              borderRadius: 20,
            }}>
            <Text
              style={{
                fontSize: width * 0.025,
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
          <FlatList
            data={astoListData}
            renderItem={renderItem}
            horizontal
            contentContainerStyle={{ paddingHorizontal: width * 0.02, paddingBottom: width * 0.04 }}
          />
        )}
      </>
    )
  }

  function freeInsights() {
    return (
      <ScrollView
        nestedScrollEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          padding: 10
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
    )
  }

  function bannerInfo() {
    const redner_banner = ({ index, item }) => {
      return (
        <View
          style={{
            flex: 1,
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
    return (
      <Carousel
        loop
        width={width}
        height={width / 2}
        autoPlay={true}
        data={bannerData}
        scrollAnimationDuration={1500}
        autoPlayInterval={5000}
        renderItem={redner_banner}
      />
    )

  }

  function searchBarInfo() {
    return (
      <TouchableOpacity
        style={{ backgroundColor: colors.background_theme1 }}
      // onPress={astrologer_list}
      >
        <View
          style={{
            flex: 0,
            backgroundColor: colors.white_color,
            paddingVertical: 10,
          }}>
          <View
            style={{
              flex: 0,
              width: '95%',
              alignSelf: 'center',
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 10,
              borderRadius: 1000,
              borderWidth: 1,
              backgroundColor: colors.background_theme1,
              borderColor: colors.background_theme2,
            }}>
            <Ionicons name="search" color={colors.background_theme2} size={22} />
            <TextInput
              editable={false}
              placeholder="Search Astrologer by name..."
              placeholderTextColor={colors.black_color6}
              style={{
                width: '80%',
                fontFamily: fonts.medium,
                color: colors.black_color8,
                padding: 5,
                backgroundColor: colors.background_theme1
              }}
            />
          </View>
        </View>
      </TouchableOpacity>
    )
  };
}
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
    marginHorizontal: 10,
  },
  panchangImage: {
    width: width * 0.1,
    height: width * 0.1,
    resizeMode: 'contain',
  },
  punchangText: {
    fontSize: 12,
    fontFamily: fonts.medium,
    marginTop: 4,
    textAlign: 'center'
  },
});
