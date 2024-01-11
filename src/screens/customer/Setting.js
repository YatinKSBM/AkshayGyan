import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {useEffect} from 'react';
import MyHeader from '../../components/MyHeader';
import {colors, fonts} from '../../config/Constants';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Setting = props => {
  useEffect(() => {
    props.navigation.setOptions({
      header: () => (
        <MyHeader
          title="Setting"
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
    <View style={{flex: 1, backgroundColor: colors.black_color1}}>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={()=>props.navigation.navigate('customerAccount')}
          style={{
            width: '90%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            backgroundColor: colors.background_theme1,
            borderRadius: 10,
            height: 70,
            shadowColor: colors.black_color5,
            shadowOffset: {width: 1, height: 2},
            shadowOpacity: 0.1,
            shadowRadius: 5,
          }}>
          <MaterialCommunityIcons
            name="card-account-details"
            color={colors.background_theme2}
            size={40}
          />
          <Text
            style={{
              flex: 0.7,
              fontSize: 16,
              color: colors.black_color8,
              fontFamily: fonts.semi_bold,
            }}>
            Update your account
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Setting;
