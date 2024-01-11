import { View, Text } from 'react-native'
import React from 'react'
import { useEffect } from 'react';
import MyHeader from '../components/MyHeader';
import { colors } from '../config/Constants';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import CustomTopTabBar from '../components/CustomTopTabBar';
import VimShottariDasha from '../screens/customer/VimShottariDasha';

const Tab = createMaterialTopTabNavigator();

const ShowKundliDasha = (props) => {
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
      <Tab.Screen name="VimShottariDasha" component={VimShottariDasha} initialParams={{ data: props.data }} />
    </Tab.Navigator>
  )
}

export default ShowKundliDasha