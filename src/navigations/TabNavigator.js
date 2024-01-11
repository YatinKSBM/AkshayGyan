import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  StyleSheet,
} from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Consult from '../screens/Consult';
import Services from '../screens/Services';
import Article from '../screens/Article';
import Home from '../screens/customer/Home';
import AstroForCall from '../screens/customer/AstroForCall';
import AstroForChat from '../screens/customer/AstroForChat';
import AstroBlogs from '../screens/customer/AstroBlogs';
import AstroDate from '../screens/customer/AstroDate';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

import { colors, fonts } from '../config/Constants';

import AudiencePage from '../screens/customer/AudiencePage';
import AstroLive from '../screens/customer/AstroLive';
import AstroMall from '../screens/customer/AstroMall';
// import HomePage from '../screens/HomePage';
const { width, height } = Dimensions.get('screen');

const Tab = createBottomTabNavigator();

function MyTabBar({ state, descriptors, accessibilityState, navigation }) {
  return (
    <View
      style={styles.tabContainer}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,

            // userID: userID,
            // userName: userID,
            // liveID: liveID,
          });

          if (!isFocused && !event.defaultPrevented) {
            // The `merge: true` option makes sure that the params inside the tab screen are preserved
            navigation.navigate({ name: route.name, merge: true });
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };
        return (
          <TouchableOpacity
            key={label}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={
              label == 'home3' ? styles.middleButton : styles.tabButton
            }>
            {label == 'home3' ? (
              <View
                style={{
                  flex: 0,
                  width: width * 0.14,
                  height: width * 0.14,
                  borderRadius: (width * 0.14) / 2,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: colors.white_color,
                  elevation: 8,
                  shadowColor: colors.black_color4
                }}>
                <Image
                  source={require('../assets/images/tabIcons/home.png')}
                  style={{ width: width * 0.08, height: width * 0.08, tintColor: isFocused ? colors.background_theme2 : colors.gray }}
                />
              </View>
            ) : label == 'AudiencePage' ? (
              <Image
                source={require('../assets/images/tabIcons/live.png')}
                style={{ width: width * 0.07, height: width * 0.07, tintColor: isFocused ? colors.background_theme2 : colors.gray }}
              />
            ) : label == 'astroForChat' ? (
              <Image
                source={require('../assets/images/tabIcons/chat.png')}
                style={{ width: width * 0.05, height: width * 0.05, tintColor: isFocused ? colors.background_theme2 : colors.gray }}
              />
              // <AntDesign name={'wechat'} size={25} color={colors.black_color} />
            ) : label == 'astroMall' ? (
              <Image
                source={require('../assets/images/tabIcons/mall.png')}
                style={{ width: width * 0.06, height: width * 0.06, tintColor: isFocused ? colors.background_theme2 : colors.gray }}
              />
              // <Ionicons name={'bag-outline'} size={25} color={colors.black_color} />
            ) : (
              <Image
                source={require('../assets/images/tabIcons/profile.png')}
                style={{ width: width * 0.06, height: width * 0.06, tintColor: isFocused ? colors.background_theme2 : colors.gray }}
              />
              // <EvilIcons name={'user'} size={30} color={colors.black_color} />

            )}
            {isFocused ?
              <Text
                style={{
                  color: colors.black_color,
                  fontFamily: fonts.semi_bold,
                  marginTop: 5,
                  fontSize: 12,
                }}>
                {label == 'astroForChat'
                  ? 'Chat'
                  : label == 'AudiencePage'
                    ? 'Live'
                    : label == 'home3'
                      ? 'Home'
                      : label == 'astroMall'
                        ? 'Astro Mall'
                        : 'Profile'}
              </Text > : <></>}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const TabNavigator = (props) => {
  return (
    <Tab.Navigator
      abBarOptions={{
        // Set your desired background color here
      }}
      initialRouteName={props.route.params?.flag == 1 ? 'astroDate' : 'home3'}
      tabBar={props => <MyTabBar {...props} />}
      screenOptions={{ headerShown: true, headerShadowVisible: false }}>
      <Tab.Screen name="astroForChat" component={AstroForChat} />
      <Tab.Screen name="AudiencePage" component={AstroLive} />
      <Tab.Screen name="home3" component={Home} />
      <Tab.Screen name="astroMall" component={AstroMall} />
      <Tab.Screen name="astroDate" component={AstroDate} />
    </Tab.Navigator>
  );
};

export default TabNavigator;

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white_color,
    shadowColor: colors.background_theme2,
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.3,
    paddingHorizontal: 2,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  middleButton: {
    flex: 0,
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: (width * 0.15) / 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    position: 'relative',
    bottom: 25,
    backfaceVisibility: 'hidden',
    shadowOffset: {
      width: 2,
      height: 1,
    },
    shadowColor: colors.black_color8,
    shadowOpacity: 0.3,
  },
});
