import { View, Text } from 'react-native'
import React from 'react'
import { useEffect } from 'react';
import MyHeader from '../components/MyHeader';
import { colors } from '../config/Constants';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import KundliBirthDetailes from '../screens/customer/KundliBirthDetailes';
import KundliPunchangDetailes from '../screens/customer/KundliPunchangDetailes';
import CustomTopTabBar from '../components/CustomTopTabBar';

const Tab = createMaterialTopTabNavigator();

const ShowKundliBasic = (props) => {
  useEffect(() => {
    props.navigation.setOptions({
      headerShown: true,
      header: () => (
        <MyHeader
          title="Kundli"
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
      tabBar={props => <CustomTopTabBar {...props} />}>
      <Tab.Screen name="kundliBirthDetailes" component={KundliBirthDetailes} initialParams={{ data: props.data }} />
      <Tab.Screen name="kundliPunchangDetailes" component={KundliPunchangDetailes} initialParams={{ data: props.data }} />
    </Tab.Navigator>
  )
}

export default ShowKundliBasic