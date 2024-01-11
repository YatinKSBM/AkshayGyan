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
import { api_astrolist1, api_url, colors, fonts } from '../../config/Constants';
import { useState } from 'react';
import MyLoader from '../../components/MyLoader';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MyHeader from '../../components/MyHeader';
import { Rating } from 'react-native-ratings';
import MyStatusBar from '../../components/MyStatusbar';
import HomeHeader from '../../components/HomeHeader';

const { width, height } = Dimensions.get('screen');

const AstroForChat = props => {
  const [astoListData, setAstroListData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [masterDataSource, setMasterDataSource] = useState([]);
  const [search, setSearch] = useState('');


  useEffect(() => {
    props.navigation.setOptions({
      headerShown: false,

    });
    // console.log(astoListData, 'dcfvgbhnj')
  }, [props.notificationData]);

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
        setAstroListData(arr);
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

  const renderItems = ({ item, index }) => {
    return (
      <View style={{ width: '100%' }}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() =>
            props.navigation.navigate('astrologerDetailes', { data: item, type: 'chat' })
          }
          key={index}
          style={{
            width: width * 1,
            marginVertical: 10,
          }}>
          <View style={{
            backgroundColor: colors.white_color,
            borderRadius: 15,
            paddingBottom: 10,
            elevation: 2,
            paddingHorizontal: 15,
            paddingTop: 10,
            marginHorizontal: 15,
          }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <View style={{ alignItems: 'center', width: width * 0.25 }}>
                <Image
                  source={item.image != null ? { uri: item.image } : require('../../assets/images/Pro_pic.png')}
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 100,
                  }}
                />
                <Rating
                  readonly={true}
                  count={5}
                  imageSize={16}
                  startingValue={parseFloat(item.star).toFixed(1)}
                  ratingColor={colors.yellow_color1}
                  showRating={false}
                  selectedColor={colors.yellow_color1} whatsapp
                  style={{ marginTop: 5, marginHorizontal: 9 }}
                />
              </View>
              <View style={{ width: width * 0.55 }}>
                <Text style={{
                  fontSize: 16,
                  color: colors.black_color9,
                  fontFamily: fonts.semi_bold,
                }}>
                  {item.shop_name}
                </Text>
                <Text style={{
                  fontSize: 14,
                  color: colors.black_color7,
                  fontFamily: fonts.medium,
                }}>
                  {item.language}
                </Text>
                <Text style={{
                  fontSize: 12
                }}>
                  {`Exp ${item.experience} Year`}
                </Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                marginTop: 10,
                justifyContent: 'space-between',
              }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 10, height: 10, backgroundColor: colors.green_color2, borderRadius: 20, marginRight: 10 }}></View>
                <Text style={{
                  fontSize: 14,
                  color: colors.green_color2,
                  fontFamily: fonts.medium,
                }}>
                  Online
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{
                  fontSize: 14,
                  color: colors.red2,
                  fontFamily: fonts.semi_bold,
                  fontWeight: '600',
                  textDecorationLine: 'line-through', textDecorationStyle: 'solid'
                }}>
                  {`₹ ${item.consultation_price}`} {" "}
                </Text>
                <Text style={{
                  fontSize: 16, color: colors.black_color,
                  fontFamily: fonts.semi_bold,
                  fontWeight: '600',
                }}>
                  {" "}{`₹ ${parseFloat(item?.call_commission) +
                    parseFloat(item?.call_price_m)
                    }/min`}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity >
      </View >
    );
  };



  return (
    <View style={{ flex: 1, }}>
      <MyStatusBar
        backgroundColor={colors.background_theme2}
        barStyle="light-content"
      />
      <View style={{ backgroundColor: colors.black_color1 }}>
        <HomeHeader navigation={props.navigation} headerTitle={"Astrologers for Chat"} />
      </View>
      <View style={{ flex: 1, backgroundColor: colors.background_theme1, width: '100%' }}>
        <MyLoader isVisible={isLoading} />
        {astoListData && (
          <FlatList
            data={astoListData}
            renderItem={renderItems}
            keyExtractor={item => item.id}
            // numColumns={2}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View >
  );
};

export default AstroForChat;
