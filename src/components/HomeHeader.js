import { View, Text, TouchableOpacity, Image, Dimensions } from 'react-native';
import React from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors, fonts } from '../config/Constants';
import { connect } from 'react-redux';
import { openFacebook, openInstagram, openYoutube } from './Methods';
const { width, height } = Dimensions.get('screen');
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
          fontSize: width * 0.038
        }}>
        {props.headerTitle}
      </Text>
      <TouchableOpacity
        onPress={() => props.navigation.navigate('notifications')}
        style={{ marginRight: 10, position: 'relative' }}>
        <Ionicons name="notifications" color={colors.white_color} size={20} />
        <View style={{
          position: 'absolute',
          backgroundColor: colors.background_theme4,
          borderRadius: 50,
          width: width * 0.03,
          height: width * 0.03,
          right: -width * 0.005, top: -width * 0.01
        }}>
          <Text style={{ fontSize: width * 0.02, textAlign: 'center', color: colors.white_color }}>{props.notificationCounts}</Text>
        </View>
      </TouchableOpacity >

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
        <Ionicons name="wallet" color={colors.white_color} size={20} />
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
    </View >
  );
};

const mapStateToProps = state => ({
  customerData: state.customer.customerData,
  wallet: state.customer.wallet,
  notificationData: state.customer.notificationData,
  notificationCounts: state.customer.notificationCounts,
});

export default connect(mapStateToProps)(HomeHeader);
