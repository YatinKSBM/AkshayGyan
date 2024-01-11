import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import AstroCallList from '../screens/customer/AstroCallList';
import AstroChatList from '../screens/customer/AstroChatList';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useEffect } from 'react';
import { colors, fonts } from '../config/Constants';
import MyStatusBar from '../components/MyStatusbar';
import OpenKundli from '../screens/customer/OpenKundli';
import NewKundli from '../screens/customer/NewKundli';
import MyHeader from '../components/MyHeader';
import NewMatching from '../screens/customer/NewMatching';
import CustomTopTabBar from '../components/CustomTopTabBar';

const Tab = createMaterialTopTabNavigator();

const Matching = props => {
  useEffect(() => {
    props.navigation.setOptions({
      headerShown: true,
      header: () => (
        <MyHeader
          title="Matching"
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
    <Tab.Navigator
      tabBar={(item) => CustomTopTabBar(item)}>
      <Tab.Screen name="openKundli" component={OpenKundli} />
      <Tab.Screen name="newMatching" component={NewMatching} />
    </Tab.Navigator >
  );
};

export default Matching;
