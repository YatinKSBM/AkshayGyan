import {
    View,
    Text,
    ScrollView,
    Dimensions,
    Image,
    TouchableOpacity,
} from 'react-native';
import React from 'react';
import { useEffect } from 'react';
import { api_astrolist1, api_url, colors, fonts } from '../../config/Constants';
import { StyleSheet } from 'react-native';
import { useState } from 'react';
import axios from 'axios';
import MyLoader from '../../components/MyLoader';
import moment from 'moment';
import { FlatList } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('screen');

const VimShottariDasha = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [astoListData, setAstroListData] = useState(null);
    useEffect(() => {
        props.navigation.setOptions({
            tabBarLabel: 'VimShottari Maha Dasha',
        });
    }, []);

    const dashaData = [
        { id: 1, name: 'Ke', date: '12-09-2023' },
        { id: 2, name: 've', date: '12-09-2023' },
        { id: 3, name: 'Su', date: '12-09-2023' },
        { id: 4, name: 'Mo', date: '12-09-2023' },
        { id: 5, name: 'Ma', date: '12-09-2023' },
        { id: 6, name: 'Ra', date: '12-09-2023' },
        { id: 7, name: 'Ju', date: '12-09-2023' },
        { id: 8, name: 'Sa', date: '12-09-2023' },
        { id: 9, name: 'Me', date: '12-09-2023' }
    ]

    const RenderData = () => {
        return (
            <ScrollView showsVerticalScrollIndicator={false}>
                <View
                    style={{
                        flex: 0,
                        width: '95%',
                        alignSelf: 'center',
                        backgroundColor: colors.background_theme1,
                        marginVertical: 10,
                        borderRadius: 15,
                        borderWidth: 1,
                        elevation: 4
                    }}>

                    {dashaData && dashaData.map((item) => (
                        <View style={styles.itmeContainer}>
                            <Text style={styles.itemText}>{item.name}</Text>
                            <Text style={styles.itemText}>
                                {item.date}
                            </Text>
                        </View>
                    ))}
                </View>
            </ScrollView>
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor: colors.black_color1 }}>
            <MyLoader isVisible={isLoading} />
            {/* <ScrollView showsVerticalScrollIndicator={false}>
                <View
                    style={{
                        flex: 0,
                        width: '95%',
                        alignSelf: 'center',
                        backgroundColor: colors.background_theme1,
                        marginVertical: 10,
                        borderRadius: 15,
                        borderWidth: 1,
                        elevation: 4
                    }}>
                    <View style={styles.itmeContainer}>
                        <Text style={styles.itemText}>Name</Text>
                        <Text style={styles.itemText}>
                            {props.route.params.data.customer_name}
                        </Text>
                    </View>
                    <View
                        style={{
                            ...styles.itmeContainer,
                            backgroundColor: colors.yellow_color5,
                        }}>
                        <Text style={{ ...styles.itemText, color: colors.black_color }}>
                            Date
                        </Text>
                        <Text style={{ ...styles.itemText, color: colors.black_color }}>
                            {moment(props.route.params.data.dob, 'YYYY-MM-DD').format(
                                'DD MMM YYYY',
                            )}
                        </Text>
                    </View>
                    <View style={styles.itmeContainer}>
                        <Text style={styles.itemText}>Time</Text>
                        <Text style={styles.itemText}>
                            {moment(props.route.params.data.tob, 'hh:mm:ss').format(
                                'hh:mm A',
                            )}
                        </Text>
                    </View>
                    <View
                        style={{
                            ...styles.itmeContainer,
                            backgroundColor: colors.yellow_color5,
                        }}>
                        <Text style={{ ...styles.itemText, color: colors.black_color }}>
                            Place
                        </Text>
                        <Text style={{ ...styles.itemText, color: colors.black_color }}>
                            {props.route.params.data.place}
                        </Text>
                    </View>
                    <View style={styles.itmeContainer}>
                        <Text style={styles.itemText}>Latitude</Text>
                        <Text style={styles.itemText}>
                            {props.route.params.data.latitude}
                        </Text>
                    </View>
                    <View
                        style={{
                            ...styles.itmeContainer,
                            backgroundColor: colors.yellow_color5,
                        }}>
                        <Text style={{ ...styles.itemText, color: colors.black_color }}>
                            Longitude
                        </Text>
                        <Text style={{ ...styles.itemText, color: colors.black_color }}>
                            {props.route.params.data.longitude}
                        </Text>
                    </View>
                    <View style={styles.itmeContainer}>
                        <Text style={styles.itemText}>Time Zone</Text>
                        <Text style={styles.itemText}>GMT+05:30</Text>
                    </View>
                </View>
            </ScrollView> */}
            <RenderData />
        </View>
    );
};

export default VimShottariDasha;




const styles = StyleSheet.create({
    itmeContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
    },
    itemText: {
        flex: 0.5,
        fontSize: 14,
        textAlign: 'center',
        color: colors.black_color8,
        fontFamily: fonts.medium,
    },
});
