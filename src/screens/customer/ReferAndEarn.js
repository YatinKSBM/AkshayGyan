import React, { useEffect } from 'react';
import { View, Text, Image, Dimensions, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import MyHeader from '../../components/MyHeader';
import { colors } from '../../config/Constants';
import CustomTopTabBar from '../../components/CustomTopTabBar';
import Icon from 'react-native-vector-icons/Feather'
import ADIcon from 'react-native-vector-icons/AntDesign'


const Tab = createMaterialTopTabNavigator();
const { width, height } = Dimensions.get('screen')
export default function ReferAndEarn(props) {
    useEffect(() => {
        props.navigation.setOptions({
            header: () => (
                <MyHeader
                    title="Refer & Earn"
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
        >
            <Tab.Screen name="Invite" component={Invite} />
            <Tab.Screen name="History" component={History} />
        </Tab.Navigator>
    );
}


const Invite = () => {
    return (
        <View style={{ alignItems: 'center', padding: 20 }}>
            <Image source={require('../../assets/images/refer&earn.jpg')}
                resizeMode='contain'
                style={{ marginTop: 30, marginBottom: 20, width: width * 0.5, height: height * 0.2 }} />
            <Text style={{ fontSize: 22, fontWeight: 'bold', color: colors.black_color }}>Refer to your Friend</Text>
            <Text style={{ marginBottom: 10, fontSize: 22, fontWeight: 'bold', color: colors.black_color }}>and Earn</Text>
            <Text style={{ fontSize: 16, color: colors.black_color, textAlign: 'center' }}>It is a long established fact that a reader will be distracted
                by the readable content of a page when looking at its layout.
                The point of using Lorem Ipsum is that it has a more-or-less
                normal distribution of letters.</Text>
            <TouchableOpacity style={{ backgroundColor: colors.background_theme2, padding: 20, borderRadius: 20, marginTop: 20 }}>
                <Text style={{ fontSize: 16, color: colors.white_color, fontWeight: 'bold' }}>
                    Invite a Friend {" "}
                    <Icon name='send' style={{ fontSize: 18 }} />
                </Text>
            </TouchableOpacity>
        </View >
    )
}

const History = () => {
    return (
        <View style={{ flex: 1 }}>
            <View style={{ flex: 1, alignItems: 'center' }}>
                <View style={{
                    width: width * 0.9,
                    marginVertical: 10,
                    borderRadius: 30,
                    borderWidth: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingHorizontal: 10,
                    borderColor: colors.black_color
                }}>
                    <TextInput placeholder='Search Refferal by name' style={{ width: '80%' }} cursorColor={colors.background_theme2} />
                    <TouchableOpacity style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 100, width: 40, height: 40,
                    }}>
                        <ADIcon name="search1" style={{ fontSize: 20, color: colors.black_color }} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}
