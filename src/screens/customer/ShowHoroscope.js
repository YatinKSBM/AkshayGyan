import {View, Text, ScrollView, Dimensions, Image} from 'react-native';
import React from 'react';
import {useEffect} from 'react';
import MyHeader from '../../components/MyHeader';
import {colors, fonts} from '../../config/Constants';
import {useState} from 'react';

const {width, height} = Dimensions.get('screen');

const ShowHoroscope = props => {
  const [horoscopeData] = useState(props.route.params.data);
  useEffect(() => {
    props.navigation.setOptions({
      header: () => (
        <MyHeader
          title="Horoscope"
          navigation={props.navigation}
          statusBar={{
            backgroundColor: colors.background_theme2,
            barStyle: 'light-content',
          }}
        />
      ),
    });
  }, []);
  return (
    <View style={{flex: 1, backgroundColor: colors.background_theme3}}>
      <View
        style={{
          flex: 1,
          margin: 20,
          backgroundColor: colors.background_theme1,
          borderRadius: 10,
          shadowColor: colors.black_color5,
          shadowOffset: {width: 0, height: 1},
          shadowOpacity: 0.3,
          shadowRadius: 5,
        }}>
        <View
          style={{
            flex: 0,
            flexDirection: 'row',
            alignItems: 'center',
            padding: 10,
          }}>
          <Image
            source={require('../../assets/images/Aries.png')}
            style={{
              width: width * 0.25,
              height: width * 0.25,
              resizeMode: 'contain',
            }}
          />
          <View style={{flex: 1, marginLeft: 15}}>
            <Text
              style={{
                fontSize: 18,
                color: colors.black_color,
                fontFamily: fonts.bold,
              }}>
              Monthly Horoscope
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: colors.black_color,
                fontFamily: fonts.semi_bold,
                textTransform: 'capitalize'
              }}>
              {`Sign: ${horoscopeData?.sun_sign} (${horoscopeData?.prediction_month})`}
            </Text>
          </View>
        </View>
        <ScrollView contentContainerStyle={{padding: 10}}>
          {horoscopeData?.prediction.map((item, index) => (
            <Text
              key={index}
              style={{
                fontSize: 14,
                color: colors.black_color7,
                fontFamily: fonts.medium,
              }}>
              {item}
            </Text>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default ShowHoroscope;
