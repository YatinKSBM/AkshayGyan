import { View, Text, ScrollView, Image, Dimensions, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import MyHeader from '../../components/MyHeader';
import { colors, fonts } from '../../config/Constants';
import MyStatusBar from '../../components/MyStatusbar';
const { width, height } = Dimensions.get('screen');


export default function ProductDetails({ props, route, navigation }) {
    const data = route.params.data

    // console.log("sdsd", data)
    useEffect(() => {
        navigation.setOptions({
            header: () => (
                <MyHeader
                    title="Product Details"
                    navigation={navigation}
                    statusBar={{
                        backgroundColor: colors.background_theme2,
                        barStyle: 'light-content',
                    }}
                />
            ),
        });
    }, []);
    return (
        <View style={{ flex: 1 }}>
            <ScrollView
                showsVerticalScrollIndicator={false}
            >
                <View style={{
                    width: width,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <View style={{
                        width: width * 0.9,
                        height: height * 0.2,
                        backgroundColor: 'green',
                        borderRadius: 20,
                        overflow: 'hidden',
                        marginTop: 20
                    }}
                    >
                        <Image source={data.image}
                            resizeMode='cover' style={{ width: '100%', height: '100%' }} />
                    </View>
                    <View style={{
                        width: width * 0.9,
                        marginVertical: 10
                    }}>
                        < Text style={{ fontSize: 22, fontWeight: 'bold', color: colors.black_color }}>
                            {data.name}
                        </Text>
                        <Text style={{ fontSize: 16, color: colors.black_color, marginVertical: 10, textAlign: 'justify' }}>
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                        </Text>
                    </View>
                    <View style={{
                        width: width * 0.9,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <TouchableOpacity style={{ backgroundColor: colors.background_theme4, width: width * 0.3, padding: 10, borderRadius: 10 }}>
                            < Text style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'center', color: colors.white_color }}>
                                Book Now
                            </Text>
                        </TouchableOpacity>

                        <Text style={{ fontSize: 22, color: colors.black_color, fontWeight: 'bold' }}>
                            ₹ 500/-
                        </Text>
                    </View>
                    {ProductDescriptionCards()}
                </View >
            </ScrollView >


        </View >
    )
    function ProductDescriptionCards() {
        return (
            <View style={{
                marginTop: 20, width: width * 0.9, padding: 10, borderRadius: 15,
                borderColor: colors.black_color,
                borderWidth: 1
            }}>

                <Text style={{ fontSize: 20, color: colors.black_color }}>
                    Benefits of E-Pooja
                </Text>
                <Text style={{ fontSize: 14, marginTop: 5, textAlign: 'justify' }}>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                </Text>
            </View>
        )
    }

}
