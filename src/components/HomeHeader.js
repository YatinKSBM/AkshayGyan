import { View, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors, fonts } from '../config/Constants';
import { connect } from 'react-redux';
import { openFacebook, openInstagram, openYoutube } from './Methods';

const HomeHeader = props => {
  return (
    <View
      style={{
        flex: 0,
        width: '100%',
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        backgroundColor: colors.background_theme2,
      }}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => props.navigation.openDrawer()}
        style={{ flex: 0.2 }}>
        <Image source={require('../assets/images/Menu.png')} style={{ width: 25, height: 25 }} />
      </TouchableOpacity>
      <Text
        style={{
          flex: 0.8,
          fontFamily: fonts.bold,
          color: colors.white_color,
          fontSize: 16
        }}>
        {props.headerTitle}
      </Text>
      {/* <View style={{flex: 0, flexDirection: 'row'}}>
        <TouchableOpacity onPress={()=>openYoutube()}>
          <Image
            source={require('../assets/images/youtube_logo.jpeg')}
            style={{width: 20, height: 20, borderRadius: 100, marginRight: 5}}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>openInstagram()}>
          <Image
            source={require('../assets/images/instagram_logo.png')}
            style={{width: 20, height: 20, borderRadius: 100, marginRight: 5}}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>openFacebook()}>
          <Image
            source={require('../assets/images/facebook_logo.png')}
            style={{width: 20, height: 20, borderRadius: 100, marginRight: 5}}
          />
        </TouchableOpacity>
      </View> */}
      {/* <TouchableOpacity
        onPress={() => props.navigation.navigate('notifications')}
        style={{flex: 0.2, flexDirection: 'row'}}>
          {
            props?.notificationCounts != 0 &&  <View
            style={{
              flex: 0,
              width: 20,
              height: 20,
              backgroundColor: colors.red_color1,
              borderRadius: 9,
              justifyContent: 'center',
              position: 'relative',
              left: 10,
              bottom: 5,
              zIndex: 1,
            }}>
            <Text
              style={{
                fontSize: 12,
                fontFamily: fonts.medium,
                textAlign: 'center',
                color: colors.white_color,
              }}>
              {props?.notificationCounts}
            </Text>
          </View>
          }
        <FontAwesome name="bell" color={colors.black_color8} size={20} />
      </TouchableOpacity> */}
      <TouchableOpacity
        onPress={() => props.navigation.navigate('wallet')}
        style={{
          flex: 0,
          flexDirection: 'row',
          backgroundColor: colors.background_theme2,
          padding: 6,
          borderRadius: 15,
          justifyContent: 'center',
          alignItems: 'center'
        }}>
        <Ionicons name="wallet" color={colors.white_color} size={15} />

        <Text
          style={{
            fontSize: 16,
            color: colors.white_color,
            fontFamily: fonts.medium,
            fontWeight: '400',
            marginLeft: 2.5
          }}>
          {`${' '}₹ ${parseFloat(props.wallet).toFixed(0)}`}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const mapStateToProps = state => ({
  customerData: state.customer.customerData,
  wallet: state.customer.wallet,
  notificationData: state.customer.notificationData,
  notificationCounts: state.customer.notificationCounts,
});

export default connect(mapStateToProps)(HomeHeader);
