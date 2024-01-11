import { View, Text } from 'react-native';
import React from 'react';
import { useEffect } from 'react';
import MyHeader from '../components/MyHeader';
import { colors } from '../config/Constants';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import KundliMoonSign from '../screens/customer/KundliMoonSign';
import KundliNakshatra from '../screens/customer/KundliNakshatra';
import CustomTopTabBar from '../components/CustomTopTabBar';

const Tab = createMaterialTopTabNavigator();

const ShowKundliPlanets = props => {
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
      <Tab.Screen
        name="kundliMoonSign"
        component={KundliMoonSign}
        initialParams={{ planetData: props.planetData }}
      />
      <Tab.Screen
        name="kundliNakshatra"
        component={KundliNakshatra}
        initialParams={{ planetData: props.planetData }}
      />
    </Tab.Navigator>
  );
};

export default ShowKundliPlanets;
