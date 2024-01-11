import {
  View,
  Text,
  ImageBackground,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
  Animated,
  PanResponder,
  StyleSheet,
  TextInput,
  Linking,
} from 'react-native';
import React from 'react';
import { useEffect } from 'react';
import MyHeader from '../../components/MyHeader';
import {
  api_addwallet,
  api_getRechargeplans,
  api_url,
  colors,
  fonts,
  vedic_images,
} from '../../config/Constants';
import { useState } from 'react';
import axios from 'axios';
import RazorpayCheckout from 'react-native-razorpay';
import { connect } from 'react-redux';
import { success_toast, warnign_toast } from '../../components/MyToastMessage';
import * as CustomerActions from '../../redux/actions/CustomerActions';
import { useRef } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FIcon from 'react-native-vector-icons/FontAwesome'
import MyLoader from '../../components/MyLoader';
import { composeWithDevTools } from '@reduxjs/toolkit/dist/devtoolsExtension';

const { width, height } = Dimensions.get('screen');

const Wallet = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [amountData, setAmountData] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [firstOffer, setFirstOffer] = useState(null);
  const [amount, setAmount] = useState('');
  const [billDetailesOpen, setBillDetailesOpen] = useState(false);
  const pan = useRef(new Animated.ValueXY()).current;

  const data = [
    { id: 1 },
    { id: 1 },
    { id: 1 },
  ]

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value,
        });
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }]),
      onPanResponderRelease: () => {
        pan.flattenOffset();
      },
    }),
  ).current;

  useEffect(() => {
    props.navigation.setOptions({
      header: () => (
        <MyHeader
          title="Recharge"
          navigation={props.navigation}
          socialIcons={false}
          statusBar={{
            backgroundColor: colors.background_theme2,
            barStyle: 'light-content',
          }}
        />
      ),
    });
  }, []);

  useEffect(() => {
    get_wallet_amount();
  }, []);

  const get_wallet_amount = async () => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + api_getRechargeplans,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: JSON.stringify({
        user_id: props.customerData.id,
      }),
    })
      .then(res => {
        console.log(res.data)
        setIsLoading(false);
        setImageData(res.data.firstoffer);
        setAmountData(res.data.records);
        setFirstOffer(res.data.records2);
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };
  console.log("amountData", amountData)
  const razorpay_payment = async amount => {
    var options = {
      description: 'Add amount to your wallet',
      // image: 'https://i.imgur.com/3g7nmJC.jpg',
      currency: 'INR',
      key: 'rzp_test_WuQwvZVOaPQbZC',
      amount: amount * 100,
      name: 'Astro King',
      // order_id: 'order_DslnoIgkIDL8Zt', //Replace this with an order_id created using Orders API.
      prefill: {
        email: props.customerData?.email,
        contact: props.customerData?.phone,
        name: props.customerData?.username,
      },
      theme: { color: colors.background_theme2 },
    };
    await RazorpayCheckout.open(options)
      .then(async data => {
        await axios({
          method: 'post',
          url: api_url + api_addwallet,
          data: {
            amount: amount,
            gift: '',
            tax: '',
            firstoffer: '',
            user_id: props.customerData.id,
          },
        })
          .then(res => {
            props.dispatch(
              CustomerActions.setWallet(res.data.updated_wallet.toFixed(2)),
            );
            get_wallet_amount();
            success_toast('Amount has been added to your wallet');
          })
          .catch(err => {
            console.log(err);
            warnign_toast(
              'Your payment has not been completed. If any balance deducted, It will be refunded.',
            );
          });
        // alert(`Success: ${data.razorpay_payment_id}`);
      })
      .catch(error => {
        // handle failure
        // alert(`Error: ${error.code} | ${error.description}`);
        warnign_toast(
          `Payment has been declined Error: ${error.code} | ${error.description}`,
        );
      });
  };

  const add_money = () => {
    if (amount.length != 0) {
      razorpay_payment(amount);
    } else {
      warnign_toast('Please Enter your amount to add your wallet.');
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/images/back.png')}
      style={{ flex: 1 }}>
      <MyLoader isVisible={isLoading} />
      {billDetailesOpen ? (
        <View style={{ flex: 1, width: '90%', alignSelf: 'center' }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text
              style={{
                fontSize: 16,
                color: colors.black_color,
                fontFamily: fonts.semi_bold,
                // alignSelf: 'center',
                marginVertical: 20,
              }}>
              Payment Details
            </Text>
            <View style={styles.rowContainer}>
              <Text style={styles.rowText}>Total Amount</Text>
              <Text style={styles.rowText}>
                ₹ {parseFloat(firstOffer[0].recharge_of).toFixed(1)}
              </Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={styles.rowText}>GST @ 18%</Text>
              <Text style={styles.rowText}>
                ₹ {parseFloat(firstOffer[0].recharge_of).toFixed(1)}
              </Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={styles.rowText}>Gift Amount</Text>
              <Text style={styles.rowText}>
                ₹ {parseFloat(firstOffer[0].recharge_of).toFixed(1)}
              </Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={styles.rowText}>Total Payable Amount</Text>
              <Text style={styles.rowText}>
                ₹ {parseFloat(firstOffer[0].recharge_of).toFixed(1)}
              </Text>
            </View>
            <TouchableOpacity
              style={{
                flex: 0,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: colors.background_theme2,
                paddingVertical: 10,
                borderRadius: 5,
                marginVertical: 20,
              }}>
              <Text
                style={{
                  fontSize: 16,
                  color: colors.background_theme1,
                  fontFamily: fonts.medium,
                }}>
                Proceed payment
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text
              style={{
                fontSize: 18,
                color: colors.black_color,
                fontFamily: fonts.semi_bold,
                alignSelf: 'center',
                marginVertical: 20,
              }}>
              Available Balance:{' '}
              <Text style={{ color: colors.background_theme2 }}>
                {props.wallet}
              </Text>
            </Text>
            <View
              style={{
                flex: 0,
                width: '95%',
                padding: 15,
                borderRadius: 10,
                borderColor: colors.black_color8,
                // borderWidth: 1,
                alignSelf: 'center',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 15,
              }}>
              <TextInput
                placeholder="Enter Amount"
                cursorColor={colors.background_theme2}
                placeholderTextColor={colors.black_color7}
                keyboardType="number-pad"
                returnKeyType="done"
                onChangeText={setAmount}
                style={styles.amountInput}
              />

              <TouchableOpacity
                onPress={add_money}
                style={{
                  width: '70%',
                  height: width * 0.15,
                  backgroundColor: colors.background_theme2,
                  justifyContent: 'center',
                  borderRadius: 20,
                  paddingVertical: 8,
                  marginTop: 20,
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    color: colors.background_theme1,
                    fontFamily: fonts.medium,
                    textAlign: 'center',
                  }}>
                  Add Money
                </Text>
              </TouchableOpacity>
            </View>
            {imageData == '0' && (
              <TouchableOpacity
                style={{
                  width: width * 0.90,
                  height: width * 0.35,
                  alignSelf: 'center',
                  borderRadius: 10,
                  overflow: 'hidden',
                  // borderWidth: 1,
                  elevation: 5,
                  // borderColor: colors.black_color,
                  marginBottom: 20,
                  backgroundColor: colors.white_color,
                  overflow: 'hidden',
                  // padding: 5
                }}
                onPress={() => setBillDetailesOpen(true)}>
                <ImageBackground
                  source={require('../../assets/images/permotional_banner.jpeg')}
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                  resizeMode="stretch">
                  <View
                    style={{
                      width: '50%',
                      height: '100%',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        fontSize: 18,
                        color: colors.black_color8,
                        fontFamily: fonts.medium,
                        textAlign: 'center',
                      }}>
                      Get ₹ {firstOffer && (parseFloat(firstOffer[0]?.recharge_get) + parseFloat(firstOffer[0]?.recharge_of))}.0
                    </Text>
                    <Text
                      style={{
                        fontSize: 13,
                        color: colors.black_color8,
                        fontFamily: fonts.medium,
                        textAlign: 'center',
                      }}>
                      First Recharge offer{'\n'}Recharge with {'\n'}₹ {firstOffer && parseFloat(firstOffer[0]?.recharge_of)}
                    </Text>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            )}
            <View
              style={{
                width: '90%',
                alignSelf: 'center',
                flexDirection: 'row',
                flexWrap: 'wrap',
              }}>
              {amountData &&
                amountData.map((item, index) => (
                  <TouchableOpacity
                    onPress={() => razorpay_payment(item.recharge_plan_amount)}
                    key={index}
                    style={{
                      flex: 0,
                      width: '40%',
                      height: width * 0.18,
                      justifyContent: 'center',
                      alignItems: 'center',
                      // borderWidth: 1,
                      borderRadius: 5,
                      borderColor: colors.black_color,
                      backgroundColor: colors.yellow_color4,
                      marginHorizontal: '5%',
                      marginBottom: '10%',
                      overflow: 'hidden',
                    }}>
                    <View style={styles.box1}>
                      <Text
                        style={
                          styles.bannerText
                        }>{`Gift ₹ ${item.recharge_plan_extra_percent}`}</Text>
                    </View>
                    <Text
                      style={{
                        fontSize: 14,
                        color: colors.black_color,
                        fontFamily: fonts.medium,
                      }}>
                      ₹ {item.recharge_plan_amount}
                    </Text>
                  </TouchableOpacity>
                ))}
            </View>
          </ScrollView>
        </View>
      )}

      <View style={{ flex: 0 }}>
        <Text
          style={{
            fontSize: 14,
            color: colors.black_color,
            fontFamily: fonts.bold,
            textAlign: 'center',
          }}>
          GST excluded
        </Text>
        <Text
          style={{
            fontSize: 12,
            color: colors.black_color,
            fontFamily: fonts.medium,
            textAlign: 'center',
            width: '95%',
            alignSelf: 'center',
            marginBottom: 30,
          }}>
          For Payment 3rd party services going to be used. Refresh your network
          connection if it is slow. If you face any issue please contact us.
        </Text>
      </View>
      {/* <Animated.View
        style={{
          transform: [{translateX: pan.x}, {translateY: pan.y}],
        }}
        {...panResponder.panHandlers}>
        <TouchableOpacity
          onPress={() => props.navigation.navigate('userGuide')}
          style={styles.box}>
          <FIcon
            name="whatsapp"
            color={colors.green_color1}
            size={35}
          />
        </TouchableOpacity>
      </Animated.View> */}
    </ImageBackground>
  );
};

const mapStateToProps = state => ({
  customerData: state.customer.customerData,
  wallet: state.customer.wallet,
});

const mapDispatchToProps = dispatch => ({ dispatch });

export default connect(mapStateToProps, mapDispatchToProps)(Wallet);

const styles = StyleSheet.create({
  box: {
    height: 50,
    width: 50,
    backgroundColor: colors.background_theme1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  amountInput: {
    textAlign: 'center',
    fontSize: 18,
    borderBottomWidth: 1,
    width: '70%',
    borderBottomColor: colors.black_color8,
    fontFamily: fonts.medium,
  },

  box1: {
    width: width * 0.25,
    height: 20,
    backgroundColor: colors.background_theme4,
    justifyContent: 'center',
    position: 'absolute',
    alignItems: 'center',
    transform: [{ rotate: '-50deg' }],
    overflow: 'hidden',
    right: width * 0.18,
    top: width * 0.05,
  },
  bannerText: {
    color: 'white',
    fontFamily: fonts.medium,
    fontSize: 10,
    textAlign: 'center',
  },

  rowContainer: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  rowText: {
    fontSize: 14,
    color: colors.black_color7,
    fontFamily: fonts.medium,
  },
});
