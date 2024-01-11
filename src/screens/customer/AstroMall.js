import { View, Text, ScrollView, Dimensions, TextInput, TouchableOpacity, ImageBackground, StyleSheet, RefreshControl } from 'react-native'
import React, { useEffect } from 'react'
import MyStatusBar from '../../components/MyStatusbar';
import { colors } from '../../config/Constants';
import HomeHeader from '../../components/HomeHeader';
import Icon from 'react-native-vector-icons/AntDesign'
import { FlatList } from 'react-native-gesture-handler';
const { width, height } = Dimensions.get('screen');

export default function AstroMall(props) {

    const products = [
        { id: '1', name: 'E-pooja', image: require('../../assets/images/fire.jpg') },
        { id: '2', name: 'E-pooja', image: require('../../assets/images/fire.jpg') },
        { id: '3', name: 'E-pooja', image: require('../../assets/images/fire.jpg') },
        { id: '4', name: 'E-pooja', image: require('../../assets/images/fire.jpg') },
        { id: '5', name: 'E-pooja', image: require('../../assets/images/fire.jpg') },
        { id: '6', name: 'E-pooja', image: require('../../assets/images/fire.jpg') },
        { id: '7', name: 'E-pooja', image: require('../../assets/images/fire.jpg') },
        { id: '8', name: 'E-pooja', image: require('../../assets/images/fire.jpg') },
        { id: '9', name: 'E-pooja', image: require('../../assets/images/fire.jpg') },
    ]
    useEffect(() => {
        props.navigation.setOptions({
            headerShown: false
        });
    }, [props.notificationData]);

    return (
        <View style={{ flex: 1 }}>
            <MyStatusBar
                backgroundColor={colors.background_theme2}
                barStyle="light-content"
            />
            <View style={{ flex: 0, backgroundColor: colors.black_color1 }}>
            <HomeHeader navigation={props.navigation} headerTitle={"Astro Mall"} />

                <ScrollView
                    showsVerticalScrollIndicator={false}
                >
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
                            <TextInput placeholder='Search Here...' style={{ width: '80%' }} cursorColor={colors.background_theme2} />
                            <TouchableOpacity style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 100, width: 40, height: 40,
                            }}>
                                <Icon name="search1" style={{ fontSize: 20, color: colors.black_color }} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ alignItems: 'center', paddingBottom: 60 }}>
                        <FlatList
                            data={products}
                            numColumns={2}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => <ProductCard product={item} navigation={props.navigation} />}
                        />
                    </View>
                </ScrollView>
            </View>
        </View>
    )
}

const ProductCard = (props) => {
    const { product, navigation } = props
    return (
        <TouchableOpacity style={styles.card}
            onPress={() =>
                navigation.navigate('productDetails', { data: product, navigation: navigation })
            }
        >
            <ImageBackground source={product.image} style={{ flex: 1 }}>
                <Text style={styles.name}>{product.name}</Text>
            </ImageBackground>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        width: width * 0.4,
        borderRadius: 10,
        overflow: 'hidden',
        height: height * 0.25,
        margin: 10,
        elevation: 4,
    },
    backgroundImage: {
        flex: 1, // Make the background cover the entire component
        resizeMode: 'cover', // Set how the image should be resized to cover the container
    },
    name: {
        fontSize: 18,
        position: 'absolute',
        bottom: 10,
        textAlign: 'center',
        color: colors.white_color,
        fontWeight: 'bold',
        width: '100%'
    }
});

