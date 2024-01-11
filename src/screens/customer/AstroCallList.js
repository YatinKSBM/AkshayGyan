import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  ImageBackground,
  FlatList,
} from 'react-native';
import React from 'react';
import { useEffect } from 'react';
import { api_astrolist1, api_url, colors, fonts } from '../../config/Constants';
import { useState } from 'react';
import MyLoader from '../../components/MyLoader';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';

const { width, height } = Dimensions.get('screen');

const AstroCallList = props => {
  console.log(props.astoListData)
  const [astoListData] = useState(props.astoListData);
  useEffect(() => {
    props.navigation.setOptions({
      tabBarLabel: 'CALL',
    });
  }, []);

  // const renderItems = ({item, index}) => {
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
  //         shadowOffset: {width: 2, height: 1},
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
  //         <View style={{flex: 0.28, overflow: 'hidden'}}>
  //           <View
  //             style={{
  //               width: width * 0.14,
  //               height: 10,
  //               backgroundColor: colors.green_color1,
  //               transform: [{rotate: '-30deg'}],
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
  //           <View style={{flex: 1, padding: 2, alignItems: 'center'}}>
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
  //                 {item.followers}
  //             </Text>
  //             <Image
  //               source={require('../../assets/images/green-button.png')}
  //               style={{width: width * 0.07, height: width * 0.07}}
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
  //         <View style={{flex: 0.4}}>
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
  //             source={{uri: item.image}}
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
  //           <TouchableOpacity  onPress={() => props.navigation.navigate('allRemedies')}>
  //             <Ionicons name="eye" color={colors.black_color6} size={20} />
  //           </TouchableOpacity>
  //         </View>
  //       </View>
  //       <View style={{height: 16}}>
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
  //             {`₹ ${
  //               parseFloat(item?.call_commission) +
  //               parseFloat(item?.call_price_m)
  //             }/min`}
  //           </Text>
  //         </TouchableOpacity>
  //       </View>
  //     </TouchableOpacity>
  //   );
  // };

  const renderItems = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() =>
          props.navigation.navigate('astrologerDetailes', {
            data: item,
            type: 'chat',
          })
        }
        key={index}
        style={{
          backgroundColor: colors.white_color,
          width: width * 0.42,
          height: width / 1.5,
          marginHorizontal: 10,
          marginTop: 15,
          marginBottom: 15,
          borderRadius: 15,
          elevation: 5,
          overflow: 'hidden',
        }}>
        <View style={{ height: '50%', alignItems: 'center' }}>
          <ImageBackground source={require('../../assets/images/pandit.jpg')} resizeMode='cover'
            style={{ height: '100%', width: '100%', position: 'relative' }} >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 10 }}>
              <View style={{ width: 25, height: 25, borderRadius: 50, alignItems: 'center', justifyContent: 'center' }}>
                <Image source={require('../../assets/images/verified.png')} resizeMode='cover'
                  style={{ width: 30, height: 30, }} />
              </View>
              <View style={{ width: 25, height: 30, alignItems: 'center' }}>
                <Image source={require('../../assets/images/star.png')} resizeMode='contain'
                  style={{ width: 20, height: 20 }} />
                <Text style={{ color: colors.black_color }} numberOfLines={1}> {item.avg_rating}</Text>
              </View>
            </View>
          </ImageBackground>
          <View style={{ position: 'absolute', bottom: '-8%', backgroundColor: colors.background_theme4, padding: 5, borderRadius: 5 }}>
            <Text style={{ color: colors.white_color }}>{item.followers} {" "} Followers</Text>
          </View>
          <View style={{ paddingTop: 20, marginHorizontal: 10 }}>
            <Text style={{ fontSize: 14, color: colors.black_color, fontWeight: 'bold', textAlign: 'center' }}>
              {item.shop_name}
            </Text>
            <Text style={{ fontSize: 12, color: colors.black_color7, fontWeight: 'bold', textAlign: 'center' }}>
              Exp{' '}{item.experience} Year
            </Text>
            <Text numberOfLines={1} style={{ fontSize: 11, color: colors.black_color6, fontWeight: 'bold', textAlign: 'center' }}>
              {item.language}
            </Text>
            <TouchableOpacity style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 5,
              borderRadius: 10,
              padding: 10,
              backgroundColor:
                item.astro_status == 'Online' ? colors.green_color1 : item.astro_status == "Busy" ? colors.yellow_color2 : colors.gray2
            }}>
              <Ionicons name="call" style={{ color: colors.white_color, fontSize: 18 }} />
              <Text>{"  "}</Text>
              <Text style={{ textDecorationLine: 'line-through', color: colors.white_color, fontSize: 10, fontWeight: 'bold' }}>
                {`₹ ${item.consultation_price}`}
              </Text>
              <Text style={{ fontSize: 14, color: colors.white_color, fontWeight: 'bold' }}>
                {" "}{`₹ ${parseFloat(item?.call_commission) +
                  parseFloat(item?.call_price_m)
                  }/min`}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

      </TouchableOpacity >
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.black_color1, paddingBottom: 30, paddingHorizontal:10}}>
      {props.astoListData && (
        <FlatList
          data={props.astoListData}
          renderItem={renderItems}
          keyExtractor={item => item.id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const mapStateToProps = state => ({
  astoListData: state.astrologer.astrologerList
})

export default connect(mapStateToProps, null)(AstroCallList);
