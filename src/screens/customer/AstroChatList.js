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
import { color } from 'react-native-reanimated';

const { width, height } = Dimensions.get('screen');

const AstroChatList = props => {
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    props.navigation.setOptions({
      tabBarLabel: 'CHAT',
    });
  }, []);

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
                <Image source={require('../../assets/images/rating-star.png')} resizeMode='contain'
                  style={{ width: 20, height: 20 }} />
                <Text style={{ color: colors.black_color }}> 3.5</Text>
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
              <Image source={require('../../assets/images/chats.png')} resizeMode='cover' style={{ color: colors.white_color, width: 15, height: 15 }} />
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
    <View style={{ flex: 1, backgroundColor: colors.black_color1, paddingBottom: 30, paddingHorizontal: 10 }}>
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

export default connect(mapStateToProps, null)(AstroChatList);
