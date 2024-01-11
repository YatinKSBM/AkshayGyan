import { View, Text } from 'react-native';
import React from 'react';
import { useEffect } from 'react';
import MyHeader from '../components/MyHeader';
import { colors, fonts } from '../config/Constants';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Sun from '../screens/customer/showkundli/Sun';
import KundliBirthDetailes from '../screens/customer/KundliBirthDetailes';
import KundliPunchangDetailes from '../screens/customer/KundliPunchangDetailes';
import Moon from '../screens/customer/showkundli/Moon';
import Chalit from '../screens/customer/showkundli/Chalit';
import Birth from '../screens/customer/showkundli/Birth';
import Hora from '../screens/customer/showkundli/Hora';
import Dreshkan from '../screens/customer/showkundli/Dreshkan';
import Chathurthamasha from '../screens/customer/showkundli/Chathurthamasha';
import Panchmansha from '../screens/customer/showkundli/Panchmansha';
import Saptamansha from '../screens/customer/showkundli/Saptamansha';
import Ashtamansha from '../screens/customer/showkundli/Ashtamansha';
import Navamansha from '../screens/customer/showkundli/Navamansha';
import Dashamansha from '../screens/customer/showkundli/Dashamansha';
import Dwadashamsha from '../screens/customer/showkundli/Dwadashamsha';
import Shodashamsha from '../screens/customer/showkundli/Shodashamsha';
import Vishamansha from '../screens/customer/showkundli/Vishamansha';
import Chaturvimshamsha from '../screens/customer/showkundli/Chaturvimshamsha';
import Bhamsha from '../screens/customer/showkundli/Bhamsha';
import Trishamansha from '../screens/customer/showkundli/Trishamansha';
import Khavedamsha from '../screens/customer/showkundli/Khavedamsha';
import Akshvedansha from '../screens/customer/showkundli/Akshvedansha';
import Shashtymsha from '../screens/customer/showkundli/Shashtymsha';
import CustomTopTabBar from '../components/CustomTopTabBar';

const Tab = createMaterialTopTabNavigator();

const ShowKundliCharts = props => {
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
      tabBar={props => <CustomTopTabBar {...props} />}
      screenOptions={{
        tabBarScrollEnabled: true,
        // tabBarLabelStyle: { fontSize: 13, fontFamily: fonts.medium },
        // tabBarGap: 0,
        // tabBarStyle: { flex: 0 },
        // tabBarItemStyle: { flex: 0, paddingHorizontal: 0, margin: 0 },
      }}
    >
      <Tab.Screen
        name="Chalit"
        component={Chalit}
        initialParams={{ data: props.data, planetData: props.planetData }}
      />
      <Tab.Screen
        name="Sun"
        component={Sun}
        initialParams={{ data: props.data, planetData: props.planetData }}
      />
      <Tab.Screen
        name="Moon"
        component={Moon}
        initialParams={{ data: props.data, planetData: props.planetData }}
      />
      <Tab.Screen
        name="Birth"
        component={Birth}
        initialParams={{ data: props.data, planetData: props.planetData }}
      />
      {/* <Tab.Screen
        name="Hora"
        component={Hora}
        initialParams={{ data: props.data, planetData: props.planetData }}
      />
      <Tab.Screen
        name="Dreshkan"
        component={Dreshkan}
        initialParams={{ data: props.data, planetData: props.planetData }}
      />
      <Tab.Screen
        name="Chathurthamasha"
        component={Chathurthamasha}
        initialParams={{ data: props.data, planetData: props.planetData }}
      />
      <Tab.Screen
        name="Panchmansha"
        component={Panchmansha}
        initialParams={{ data: props.data, planetData: props.planetData }}
      />
      <Tab.Screen
        name="Saptamansha"
        component={Saptamansha}
        initialParams={{ data: props.data, planetData: props.planetData }}
      /> 
     <Tab.Screen
        name="Ashtamansha"
        component={Ashtamansha}
        initialParams={{ data: props.data, planetData: props.planetData }}
      />
      <Tab.Screen
        name="Navamansha"
        component={Navamansha}
        initialParams={{ data: props.data, planetData: props.planetData }}
      />
      <Tab.Screen
        name="Dashamansha"
        component={Dashamansha}
        initialParams={{ data: props.data, planetData: props.planetData }}
      />
      <Tab.Screen
        name="Dwadashamsha"
        component={Dwadashamsha}
        initialParams={{ data: props.data, planetData: props.planetData }}
      />
      <Tab.Screen
        name="Shodashamsha"
        component={Shodashamsha}
        initialParams={{ data: props.data, planetData: props.planetData }}
      />
      <Tab.Screen
        name="Vishamansha"
        component={Vishamansha}
        initialParams={{ data: props.data, planetData: props.planetData }}
      />
      <Tab.Screen
        name="Chaturvimshamsha"
        component={Chaturvimshamsha}
        initialParams={{ data: props.data, planetData: props.planetData }}
      /> 
      <Tab.Screen
        name="Bhamsha"
        component={Bhamsha}
        initialParams={{ data: props.data, planetData: props.planetData }}
      />
      <Tab.Screen
        name="Trishamansha"
        component={Trishamansha}
        initialParams={{ data: props.data, planetData: props.planetData }}
      />
      <Tab.Screen
        name="Khavedamsha"
        component={Khavedamsha}
        initialParams={{ data: props.data, planetData: props.planetData }}
      />
      <Tab.Screen
        name="Akshvedansha"
        component={Akshvedansha}
        initialParams={{ data: props.data, planetData: props.planetData }}
      />
      <Tab.Screen
        name="Shashtymsha"
        component={Shashtymsha}
        initialParams={{ data: props.data, planetData: props.planetData }}
      /> */}
    </Tab.Navigator>
  );
};

export default ShowKundliCharts;
