import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import CreatRequest from '../screens/provider/CreatRequest';
import LiveList from '../screens/provider/LiveList';
import View from 'react-native'

import { colors } from '../config/Constants';
import MyHeader from '../components/MyHeader';
import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

const Tab = createMaterialTopTabNavigator();


const TopNavigation = (props) => {

    const navigation = useNavigation();

    useEffect(() => {
        props.navigation.setOptions({
            headerShown: true,
            header: () => (
                <MyHeader
                    title="Schedule Live"
                    socialIcons={false}
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

        // <View style={{ flex: 1 }}>

        <Tab.Navigator
            initialRouteName="ApplyForLive"
            tabBarOptions={{
                activeTintColor: colors.white_color,
                indicatorStyle: { backgroundColor: '#fff' },
                labelStyle: { fontSize: 14, },
                style: { backgroundColor: colors.background_theme2 },
            }}
        >

            <Tab.Screen
                name="LiveList"
                component={LiveList}
                options={{ tabBarLabel: 'ALL REQUEST', color: '#fff' }}
            />
            <Tab.Screen
                name="CreatRequest"
                component={CreatRequest}
                options={{ tabBarLabel: 'CREAT REQUEST' }}
            />
        </Tab.Navigator>
        // </View>

    );
}
export default TopNavigation