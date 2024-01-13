import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { View, StyleSheet, Image, Text } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler';
import Animated, { BounceIn, FlipInEasyY } from 'react-native-reanimated';
import AstroForChat from '../screens/customer/AstroForChat';
import AstroLive from '../screens/customer/AstroLive';
import Home from '../screens/customer/Home';
import AstroMall from '../screens/customer/AstroMall';
import { colors, fonts } from '../config/Constants';
import AstroForCall from '../screens/customer/AstroForCall';
import AstroDate from '../screens/customer/AstroDate';
var Tab = createBottomTabNavigator()

const BottomTabs = () => {
  const TabArr = [
    { id: 1, route: 'home', title: 'Home', deactiveIcon: require(`../assets/images/tabIcons/home1.png`), activeIcon: require(`../assets/images/tabIcons/home2.png`), component: Home, bwidth: '20%' },
    { id: 2, route: 'call', title: 'Call', deactiveIcon: require(`../assets/images/tabIcons/call1.png`), activeIcon: require(`../assets/images/tabIcons/call2.png`), component: AstroForCall, bwidth: '20%' },
    { id: 3, route: 'chat', title: 'Chat', deactiveIcon: require(`../assets/images/tabIcons/chat1.png`), activeIcon: require(`../assets/images/tabIcons/chat2.png`), component: AstroForChat, bwidth: '20%' },
    { id: 4, route: 'live', title: 'Live', deactiveIcon: require(`../assets/images/tabIcons/live1.png`), activeIcon: require(`../assets/images/tabIcons/live2.png`), component: AstroLive, bwidth: '20%' },
    { id: 5, route: 'mall', title: 'Mall', deactiveIcon: require(`../assets/images/tabIcons/mall1.png`), activeIcon: require(`../assets/images/tabIcons/mall2.png`), component: AstroMall, bwidth: '20%' }
  ]

  const CustomTabbarButton = (props) => {
    const { item, onPress, accessibilityState } = props;
    const focused = accessibilityState.selected
    return (
      <View style={{ alignItems: 'center', width: item.bwidth, justifyContent: 'center' }}>
        {focused ?
          <TouchableOpacity
            style={styles.CustomButtonContainer2}
            onPress={onPress}
          >
            <Animated.View style={styles.btn} entering={BounceIn} >
              <Image
                source={item.activeIcon}
                resizeMode='contain'
                style={{
                  width: 22,
                  height: 22,
                  tintColor: colors.background_theme2,
                  marginBottom: 5,
                }}
              />
            </Animated.View>
            <Animated.View style={styles.btn} entering={FlipInEasyY} >
              <Text style={{ color: colors.background_theme2, fontFamily: fonts.medium, fontSize: 12 }} > {item.title}</Text>
            </Animated.View>
          </TouchableOpacity> :
          <TouchableOpacity
            style={styles.CustomButtonContainer2}
            onPress={onPress}
          >
            <View style={styles.btn} >
              <Image
                source={item.deactiveIcon}
                resizeMode='contain'
                style={{
                  width: 22,
                  height: 22,
                  tintColor: colors.gray,
                  marginBottom: 5,
                }}
              />
            </View>
            <Text style={{ fontFamily: fonts.medium, color: colors.gray, fontSize: 12 }} > {item.title}</Text>
          </TouchableOpacity>
        }
      </View >
    )
  }

  return (
    <>
      <Tab.Navigator
        initialRouteName='Home'
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle:
          {
            height: 70,
            backgroundColor: '#fff',
            elevation: 20
          }
        }}>
        {TabArr.map((item) => {
          return (
            <Tab.Screen name={item.route} component={item.component} key={item.id}
              options={{
                tabBarButton: (props) => <CustomTabbarButton {...props} item={item} />
              }}
            />
          )
        })
        }
      </Tab.Navigator >
    </>
  )
}
export default BottomTabs;
const styles = StyleSheet.create({
  CustomButtonContainer: {
    top: -30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red'
  },
  CustomButtonContainer2: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  btn: {
    alignItems: 'center',
  }
})