import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
  TextInput,
} from 'react-native';
import React from 'react';
import { useEffect } from 'react';
import { api_astrolist1, api_url, colors, fonts, Sizes } from '../../config/Constants';
import { useState } from 'react';
import MyLoader from '../../components/MyLoader';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MyHeader from '../../components/MyHeader';
import LinearGradient from 'react-native-linear-gradient';
import HomeHeader from '../../components/HomeHeader';

const { width, height } = Dimensions.get('screen');

const AstroForCall = props => {
  const [astoListData, setAstroListData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [masterDataSource, setMasterDataSource] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    props.navigation.setOptions({
      header: () => (
        <MyHeader
          title="Astrologer"
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
    props.navigation.setOptions({
      header: () => (
        <MyHeader
          title="Astrologer"
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
    get_astrologer();
  }, []);

  const get_astrologer = async () => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + api_astrolist1,
    })
      .then(res => {
        setIsLoading(false);
        let arr = res.data.records
        let filter_arr = arr.filter(item => item.astro_status == 'Online')
        setAstroListData(filter_arr);
        setMasterDataSource(filter_arr);
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const searchFilterFunction = text => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource and update FilteredDataSource
      const newData = masterDataSource.filter(function (item) {
        // Applying filter for the inserted text in search bar
        const itemData = item.shop_name
          ? item.shop_name.toUpperCase()
          : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setAstroListData(newData);
      setSearch(text);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setAstroListData(masterDataSource);
      setSearch(text);
    }
  };

  // const renderItems = ({ item, index }) => {
  //   return (
  //     <TouchableOpacity
  //       onPress={() =>
  //         props.navigation.navigate('astrologerDetailes', {
  //           data: item,
  //           type: 'call',
  //         })
  //       }
  //       key={index}
  //       style={{
  //         flex: 0,
  //         width: width * 0.45,
  //         marginHorizontal: width * 0.025,
  //         alignSelf: 'center',
  //         backgroundColor: colors.white_color,
  //         borderRadius: 5,
  //         marginVertical: 10,
  //         shadowColor: colors.black_color5,
  //         shadowOffset: { width: 2, height: 1 },
  //         shadowOpacity: 0.1,
  //         shadowRadius: 10,
  //         zIndex: 100,
  //       }}>
  //       <View
  //         style={{
  //           flex: 0,
  //           flexDirection: 'row',
  //           backgroundColor: colors.background_theme3,
  //           borderTopRightRadius: 10,
  //           borderTopLeftRadius: 10,
  //           paddingBottom: 20,
  //         }}>
  //         <View style={{ flex: 0.28, overflow: 'hidden' }}>
  //           <View
  //             style={{
  //               width: width * 0.14,
  //               height: 10,
  //               backgroundColor: colors.green_color1,
  //               transform: [{ rotate: '-30deg' }],
  //               marginBottom: 15,
  //               marginTop: 5,
  //               position: 'relative',
  //               right: 5,
  //               top: 5,
  //             }}>
  //             <Text
  //               style={{
  //                 fontSize: 8,
  //                 color: colors.background_theme1,
  //                 fontFamily: fonts.medium,
  //                 textAlign: 'center',
  //               }}>
  //               Best Choice
  //             </Text>
  //           </View>
  //           <View style={{ flex: 1, padding: 2, alignItems: 'center' }}>
  //             <Text
  //               style={{
  //                 fontSize: 9,
  //                 fontFamily: fonts.semi_bold,
  //                 color: colors.black_color8,
  //               }}>
  //               Followers
  //             </Text>
  //             <Text
  //               style={{
  //                 fontSize: 11,
  //                 fontFamily: fonts.semi_bold,
  //                 color: colors.black_color8,
  //               }}>
  //               {item.followers}
  //             </Text>
  //             <Image
  //               source={require('../../assets/images/green-button.png')}
  //               style={{ width: width * 0.07, height: width * 0.07 }}
  //             />
  //             <View
  //               style={{
  //                 flex: 0,
  //                 marginTop: 5,
  //                 paddingHorizontal: 5,
  //                 paddingVertical: 2,
  //                 backgroundColor:
  //                   item.astro_status == 'Online'
  //                     ? colors.green_color2
  //                     : colors.black_color7,
  //                 borderRadius: 5,
  //               }}>
  //               <Text
  //                 style={{
  //                   fontSize: 9,
  //                   fontFamily: fonts.medium,
  //                   color: colors.background_theme1,
  //                 }}>
  //                 {item.astro_status}
  //               </Text>
  //             </View>
  //           </View>
  //         </View>
  //         <View style={{ flex: 0.4 }}>
  //           <View
  //             style={{
  //               flex: 0,
  //               backgroundColor: colors.background_theme2,
  //               paddingVertical: 1,
  //               borderTopRightRadius: 10,
  //               borderBottomLeftRadius: 10,
  //               marginBottom: 5,
  //             }}>
  //             <Text
  //               style={{
  //                 fontSize: 9,
  //                 textAlign: 'center',
  //                 fontFamily: fonts.medium,
  //                 color: colors.white_color,
  //               }}>
  //               special offer
  //             </Text>
  //           </View>

  //           <Image
  //             source={{ uri: item.image }}
  //             style={{
  //               width: width * 0.18,
  //               height: width * 0.25,
  //               // borderRadius: 5,
  //               borderWidth: 0.5,
  //               borderColor: colors.black_color8,
  //             }}
  //           />
  //         </View>
  //         <View
  //           style={{
  //             flex: 0.3,
  //             justifyContent: 'space-around',
  //             alignItems: 'center',
  //           }}>
  //           <Text
  //             style={{
  //               fontSize: 9,
  //               color: colors.black_color,
  //               fontFamily: fonts.medium,
  //               marginTop: 5,
  //               textAlign: 'center',
  //             }}>
  //             <Ionicons name="star" color={colors.yellow_color1} size={20} />
  //             {'\n'}
  //             {`${parseFloat(item.avg_rating).toFixed(1)} / 5`}
  //           </Text>
  //           <TouchableOpacity onPress={() => props.navigation.navigate('allRemedies')}>
  //             <Ionicons name="eye" color={colors.black_color6} size={20} />
  //           </TouchableOpacity>
  //         </View>
  //       </View>
  //       <View style={{ height: 16 }}>
  //         {item.offer_deal != 0 && (
  //           <View
  //             style={{
  //               flex: 0,
  //               alignSelf: 'center',
  //               backgroundColor: colors.background_theme2,
  //               paddingHorizontal: 10,
  //               paddingVertical: 1,
  //               borderTopRightRadius: 10,
  //               borderBottomLeftRadius: 10,
  //               position: 'relative',
  //               bottom: 8,
  //             }}>
  //             <Text
  //               style={{
  //                 fontSize: 12,
  //                 fontFamily: fonts.medium,
  //                 color: colors.white_color,
  //               }}>
  //               {item.offer_deal}
  //             </Text>
  //           </View>
  //         )}
  //       </View>
  //       <View
  //         style={{
  //           flex: 0,
  //           width: '80%',
  //           alignSelf: 'center',
  //           alignItems: 'center',
  //         }}>
  //         <Text
  //           style={{
  //             fontSize: 14,
  //             color: colors.black_color9,
  //             fontFamily: fonts.semi_bold,
  //             textAlign: 'center',
  //           }}>
  //           {item.shop_name}
  //         </Text>
  //         <Text
  //           style={{
  //             fontSize: 12,
  //             textAlign: 'center',
  //             color: colors.black_color7,
  //             fontFamily: fonts.medium,
  //           }}>
  //           {item.language}
  //         </Text>
  //         <Text
  //           style={{
  //             fontSize: 12,
  //             color: colors.black_color9,
  //             fontFamily: fonts.semi_bold,
  //             textAlign: 'center',
  //           }}>
  //           {`Exp ${item.experience} Year`}
  //         </Text>
  //         <TouchableOpacity
  //           onPress={() =>
  //             props.navigation.navigate('astrologerDetailes', {
  //               data: item,
  //               type: 'call',
  //             })
  //           }
  //           style={{
  //             flex: 0,
  //             width: '100%',
  //             flexDirection: 'row',
  //             alignItems: 'center',
  //             justifyContent: 'center',
  //             paddingVertical: 2,
  //             backgroundColor: colors.background_theme2,
  //             marginVertical: 20,
  //             borderRadius: 5,
  //           }}>
  //           <Ionicons
  //             name="ios-call"
  //             color={colors.background_theme1}
  //             size={20}
  //           />
  //           <Text
  //             style={{
  //               fontSize: 9,
  //               color: colors.background_theme1,
  //               fontFamily: fonts.medium,
  //               textDecorationLine: 'line-through',
  //               marginLeft: 5,
  //             }}>
  //             {`₹ ${item.consultation_price}`}
  //           </Text>
  //           <Text
  //             style={{
  //               fontSize: 11,
  //               color: colors.background_theme1,
  //               fontFamily: fonts.medium,
  //               marginLeft: 5,
  //             }}>
  //             {`₹ ${parseFloat(item?.call_commission) +
  //               parseFloat(item?.call_price_m)
  //               }/min`}
  //           </Text>
  //         </TouchableOpacity>
  //       </View>
  //     </TouchableOpacity>
  //   );
  // };





  return (
    <View style={{ flex: 1, backgroundColor: colors.black_color1 }}>
      <MyLoader isVisible={isLoading} />
      <HomeHeader navigation={props.navigation} headerTitle={"Astrologers for Call"} />
      {searchInfo()}
      <FlatList
        ListHeaderComponent={
          <View style={{ width: width * 0.95, alignSelf: 'center' }}>
            {astrologerlistInnfo()}
          </View>
        }
      />
    </View>
  );

  function astrologerlistInnfo() {
    const renderItems = ({ item, index }) => {

      const formatFollowers = (followers) => {
        if (followers >= 1000) {
          const formattedValue = Math.floor(followers / 1000); // Get the floor value for thousands
          return `${formattedValue}k`;
        }
        return followers.toString();
      };

      return (
        <TouchableOpacity
          onPress={() =>
            props.navigation.navigate('astrologerDetailes', {
              data: item,
              type: 'call',
            })
          }
          key={index}
          activeOpacity={1}
          style={{
            width: width * 0.43,
            padding: Sizes.fixPadding,
            backgroundColor: colors.background_theme1,
            borderRadius: Sizes.fixPadding,
            elevation: 5,
            marginHorizontal: 5,
            marginVertical: 20,
          }}>
          {/* image and status */}
          <View style={{
            width: width * 0.15,
            height: width * 0.15,
            alignSelf: 'center',
            // marginTop: 10,
            marginVertical: 10
          }}>
            <View style={{
              width: width * 0.15,
              height: width * 0.15,
              borderRadius: 100,
              backgroundColor: 'white',
              overflow: 'hidden',
              borderWidth: 2,
              borderColor: item.astro_status == 'Online'
                ? colors.green_color2
                : item.astro_status == 'Busy' ? colors.red_color1 : colors.black_color5,
              elevation: 3,
              position: 'relative'
            }}>
              <Image source={{ uri: item.image }}
                style={{
                  width: '100%',
                  height: '100%',
                  resizeMode: 'cover'
                }} />
            </View>
            <View style={{
              padding: Sizes.fixPadding * 0.7,
              backgroundColor:
                item.astro_status == 'Online'
                  ? colors.green_color2
                  : item.astro_status == 'Busy' ? colors.red_color1 : colors.black_color5,
              position: 'absolute', borderRadius: 100,
              right: 0,
              bottom: 5
            }}></View>
          </View>
          {/* image and status */}
          {/* Details */}
          <View style={{
            maxWidth: '80%',
            alignItems: 'center',
            alignSelf: 'center'
          }}>
            <Text
              numberOfLines={1}
              style={{
                fontSize: 14,
                fontFamily: fonts.semi_bold,
                color: colors.black_color,
              }}>
              {item.shop_name}
            </Text>
            <Text
              numberOfLines={1}
              style={{
                fontSize: 12,
                textAlign: 'center',
                color: colors.background_theme2,
                fontFamily: fonts.medium,
              }}>
              {item.language}
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: colors.black_color9,
                fontFamily: fonts.semi_bold,
                textAlign: 'center',
              }}>
              {`Exp- ${item.experience} Year`}
            </Text>
          </View>
          {/* Details */}
          <LinearGradient
            colors={[colors.yellow_color3, colors.background_theme2]}
            onPress={() =>
              props.navigation.navigate('astrologerDetailes', {
                data: item,
                type: 'call',
              })
            }
            style={{
              width: '100%',
              paddingVertical: Sizes.fixPadding * 0.8,
              borderRadius: Sizes.fixPadding,
              marginTop: 10
            }}>
            <TouchableOpacity
              onPress={() =>
                props.navigation.navigate('astrologerDetailes', {
                  data: item,
                  type: 'call',
                })
              }
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Ionicons
                name="call"
                color={colors.background_theme1}
                size={20}
              />
              <Text
                style={{
                  fontSize: 12,
                  color: colors.background_theme1,
                  fontFamily: fonts.medium,
                  textDecorationLine: 'line-through',
                  marginLeft: 5,
                  textAlignVertical: 'center'
                }}>
                {`₹ ${item.consultation_price}`}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: colors.background_theme1,
                  fontFamily: fonts.medium,
                  marginLeft: 5,
                  textAlignVertical: 'center'
                }}>
                {`₹ ${parseFloat(item?.chat_commission) +
                  parseFloat(item?.chat_price_m)
                  }/min`}
              </Text>
            </TouchableOpacity>
          </LinearGradient>
          {/* Special  Offer tag */}
          <View
            style={{
              paddingHorizontal: Sizes.fixPadding * 0.3,
              paddingVertical: Sizes.fixPadding * 0.2,
              backgroundColor: colors.background_theme2,
              width: width * 0.2,
              borderRadius: 10,
              alignSelf: 'center',
              alignItems: 'center',
              position: 'absolute',
              top: -10,
            }}>
            <Text
              style={{
                fontSize: width * 0.025,
                fontFamily: fonts.medium,
                color: colors.white_color,
                textTransform: 'capitalize',
              }}>
              Special Offer
            </Text>
          </View>
          {/* Special  Offer tag */}

          {/* Followers Number */}
          <View
            style={{
              padding: Sizes.fixPadding * 0.5,
              width: width * 0.08,
              height: width * 0.1,
              position: 'absolute',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: colors.yellow_color2,
              borderBottomEndRadius: 10,
              borderTopLeftRadius: Sizes.fixPadding,
              left: 0
            }}>
            <Ionicons name="people" style={{ fontSize: 10 }} />
            <Text
              style={{
                fontSize: width * 0.025,
                fontFamily: fonts.semi_bold,
                color: colors.background_theme2,
              }}>
              {formatFollowers(item.followers)}
            </Text>
          </View>
          {/* Followers Number */}
          {/* Rating Star */}
          <View
            style={{
              padding: Sizes.fixPadding * 0.5,
              width: width * 0.08,
              height: width * 0.1,
              position: 'absolute',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: colors.yellow_color2,
              borderBottomLeftRadius: 10,
              borderTopRightRadius: Sizes.fixPadding,
              right: 0
            }}>
            <Ionicons name="star" style={{ fontSize: 10 }} />
            <Text
              style={{
                fontSize: width * 0.025,
                fontFamily: fonts.semi_bold,
                color: colors.background_theme2,
              }}>
              {`${parseFloat(item.avg_rating).toFixed(1)}` == 0.0 ? 0 : `${parseFloat(item.avg_rating).toFixed(1)}`}
            </Text>
          </View>
          {/* Followers Number */}

        </TouchableOpacity >
      );
    };
    return (
      <>
        {astoListData && (
          <FlatList
            data={astoListData}
            renderItem={renderItems}
            keyExtractor={item => item.id}
            numColumns={2}
            showsVerticalScrollIndicator={false}
          />
        )}
      </>
    )
  }

  function searchInfo() {
    return (
      <View
        style={{
          flex: 0,
          backgroundColor: colors.background_theme1,
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
          }}>
          <Ionicons name="search" color={colors.black_color6} size={22} />
          <TextInput
            value={search}
            placeholder="Search Astrologer by name..."
            placeholderTextColor={colors.black_color6}
            onChangeText={text => searchFilterFunction(text)}
            style={{
              width: '100%',
              fontFamily: fonts.medium,
              color: colors.black_color8,
              padding: 8,
            }}
          />
        </View>
      </View>
    )
  }

};

export default AstroForCall;
