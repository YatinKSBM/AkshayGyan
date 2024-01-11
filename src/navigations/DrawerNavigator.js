import {
  View,
  Text,
  Dimensions,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { DrawerActions } from '@react-navigation/native';
import React, { useEffect } from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import TabNavigator from './TabNavigator';
import { api2_logout, api_url, base_url, colors, fonts } from '../config/Constants';
import { connect } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { CommonActions, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import FontAwesome6Brands from 'react-native-vector-icons/FontAwesome6Pro'



import { openFacebook, openInstagram, openLinkedIn } from '../components/Methods';
import { color } from 'react-native-reanimated';
const { width, height } = Dimensions.get('screen');
const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  const navigation = useNavigation()
  const logout = () => {
    Alert.alert(
      'Logout',
      'You sure, you want to Logout?',
      [
        {
          text: 'CANCEL',
          style: 'cancel'
        },
        {
          style: 'destructive',
          text: 'LOGOUT',
          onPress: () => on_logout()
        }
      ]
    )
  }

  const on_logout = async () => {
    await axios({
      method: 'post',
      url: api_url + api2_logout,
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      data: {
        user_id: props.props?.customerData?.id
      }
    }).then((res) => {
      if (res.data.status) {
        AsyncStorage.clear();
        go_login();
      }
    }).catch((err) => {
      console.log(err)
    })
  }

  const go_login = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'login' }]
      })
    )
  }


  return (
    <View style={{
      flex: 1,
      backgroundColor: colors.yellow_color2,

    }}>
      <View style={{ height: 25 }} />
      <DrawerContentScrollView {...props.props1} showsVerticalScrollIndicator={false} >
        <View
          style={{
            // flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
            // top: -30,
          }}>
          {/* <TouchableOpacity
            onPress={()=>navigation.navigate('customerAccount')}
            style={{
              width: 25,
              height: 25,
              borderRadius: 13,
              borderWidth: 1,
              borderColor: colors.background_theme1,
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
              top: 20,
              right: 30,
              zIndex: 1,
              backgroundColor: colors.background_theme2,
            }}> */}
          {/* <Ionicons
              name="ios-pencil"
              color={colors.background_theme1}
              size={20}
            /> */}
          {/* </TouchableOpacity> */}
          {props.props?.customerData?.user_profile_image ? (
            <Image
              source={{
                uri: base_url + 'admin/' + props.props?.customerData?.user_profile_image,
              }}
              style={{
                width: width * 0.25,
                height: width * 0.25,
                borderRadius: (width * 0.25) / 2,
              }}
            />) :
            <Image source={require('../assets/images/Pro_pic.png')} style={{
              width: width * 0.3,
              height: width * 0.3,
              borderRadius: 1000,
              zIndex: 1
            }} />
          }
          <Text
            style={{
              fontSize: 16,
              color: colors.black_color,
              fontFamily: fonts.medium,
              marginTop: height * 0.01,
              fontWeight: '600'
            }}>
            {props.props.customerData?.username ? props.props.customerData.username : 'Sujeet'}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('customerAccount')} >
            <View style={{ width: 83, height: 21, borderWidth: 1, borderRadius: 10, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginTop: height * 0.01, }}>
              <Text>Profile</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 0, width: '90%', alignSelf: 'center', marginTop: height * 0.04 }}>
          <TouchableOpacity onPress={() => navigation.navigate('home3')} style={styles.buttonContainer}>
            <Entypo name={'home'}
              size={20}
              color={colors.black_color}
            />
            <Text style={styles.buttonText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('wallet')} style={styles.buttonContainer}>
            <Entypo name={'wallet'}
              size={20}
              color={colors.black_color}
            />
            <Text style={styles.buttonText}>Wallet</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('customerOrderHistory')} style={styles.buttonContainer}>
            <Image
              source={require('../assets/images/OrderHistory.png')}
              style={styles.buttonImage}
            />
            <Text style={styles.buttonText}>Order History</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('notifications')} style={styles.buttonContainer}>
            <Ionicons name='notifications-sharp'
              size={20}
              color={colors.black_color}
            />
            <Text style={styles.buttonText}>Notifications</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonContainer}>
            <FontAwesome5 name={'shopping-bag'}
              size={20}
              color={colors.black_color}
            />
            <Text style={styles.buttonText}>Astromall</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('AstroForChat')} style={styles.buttonContainer}>
            <Ionicons name={'chatbubble-ellipses-sharp'}
              size={20}
              color={colors.black_color}
            />
            <Text style={styles.buttonText}>Chat with Astrologer</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('referAndEarn')} style={styles.buttonContainer}>
            <Image
              source={require('../assets/images/referIcon.png')}
              style={styles.buttonImage}
            />
            <Text style={styles.buttonText}>Refer & Earn</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={navigation.navigate('home')} style={styles.buttonContainer}>
            <Ionicons name={'bag-check'}
              size={20}
              color={colors.black_color}
            />
            <Text style={styles.buttonText}>Astrology Blog</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Book_puja')} style={styles.buttonContainer}>
            <Image
              source={require('../assets/images/puja.png')}
              style={styles.buttonImage}
            />
            <Text style={styles.buttonText}>Book a Pooja</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('helpSupport')} style={styles.buttonContainer}>
            <AntDesign name={'customerservice'} size={20} />
            <Text style={styles.buttonText}>Customer Support Chat</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={logout} style={styles.buttonContainer}>
            <Entypo name={'log-out'}
              size={20}
              color={colors.black_color}
            />
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
          <Text style={{ textAlign: 'center', marginTop: height * 0.05 }}>version 11.32</Text>
        </View>

        {/* <View
          style={{
            flex: 0,
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: 10,
          }}>
          <Text
            style={{
              fontSize: 14,
              color: colors.background_theme1,
              fontFamily: fonts.medium,
              marginBottom: 10,
            }}>
            Available on
          </Text>
          <View
            style={{
              flex: 0,
              flexDirection: 'row',
              alignSelf: 'center',
              alignItems: 'center',
            }}>
            <TouchableOpacity onPress={()=>openFacebook()} style={{marginHorizontal: 5}}>
              <Image
                source={require('../assets/images/facebook.png')}
                style={styles.socialLogo}
              />
            </TouchableOpacity>
            <TouchableOpacity style={{marginHorizontal: 5}}>
              <Image
                source={require('../assets/images/linkedin.png')}
                style={styles.socialLogo}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>openInstagram()} style={{marginHorizontal: 5}}>
              <Image
                source={require('../assets/images/instagram.webp')}
                style={styles.socialLogo}
              />
            </TouchableOpacity>
          </View>
        </View> */}
      </DrawerContentScrollView>
    </View>
  );
}

const DrawerNavigator = props => {
  return (
    <Drawer.Navigator
      drawerContent={props1 => (
        <CustomDrawerContent props1={props1} props={props} />
      )}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: width * 0.75,
          alignSelf: 'center',
          backgroundColor: '',
          // elevation: 8,
          shadowColor: colors.black_color6,
        },
      }}>
      <Drawer.Screen name="home2" component={TabNavigator} />
    </Drawer.Navigator>
  );
};

const mapStateToProps = state => ({
  customerData: state.customer.customerData,
  wallet: state.customer.wallet,
});

export default connect(mapStateToProps, null)(DrawerNavigator);

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    height: height * 0.05,
    marginBottom: height * 0.005,
    paddingLeft: 10,
    // borderColor: colors.background_theme2,
    // borderRadius: 10,
    // borderWidth: 1
    // backgroundColor: 'red',

  },
  buttonImage: {
    width: width * 0.05,
    height: width * 0.05,
  },
  buttonText: {
    fontSize: 13,
    color: colors.black_color,
    fontFamily: fonts.medium,
    marginLeft: height * 0.02,
  },
  socialLogo: {
    width: width * 0.08,
    height: width * 0.08,
  },
});
