import { View, Text, FlatList, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import MyHeader from '../../components/MyHeader';
import { api_url, colors, fonts, order_history } from '../../config/Constants';
import { Rating, AirbnbRating } from 'react-native-ratings';
import MyLoader from '../../components/MyLoader';
import axios from 'axios';
import { connect } from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('screen');

const CustomerOrderHistory = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [orderHistoryData, setOrderHistoryData] = useState(null);
  useEffect(() => {
    props.navigation.setOptions({
      header: () => (
        <MyHeader
          title="Order History"
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

  useEffect(() => {
    get_order_history();
  }, []);

  const get_order_history = async () => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + order_history,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        user_id: props.customerData.id,
      },
    })
      .then(res => {
        setOrderHistoryData(res.data.result);
        setIsLoading(false);
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };


  const data = [
    { id: 1, data: 'one' },
    { id: 1, data: 'two' },
    { id: 1, data: 'two' },
    { id: 1, data: 'two' },
    { id: 1, data: 'two' },
  ]
  const renderItem = ({ item, index }) => {
    return (
      <View
        style={{
          flex: 0,
          backgroundColor: colors.yellow_color2,
          padding: 15,
          marginBottom: 15,
          borderRadius: 10,
          shadowColor: colors.black_color3,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.3,
          shadowRadius: 5,
        }}>
        <View style={styles.rowContainer}>
          <Text style={styles.textHeading}>Transcation ID: </Text>
          <Text style={styles.textID}>228773476438712</Text>
        </View>
        <View style={styles.divider} />

        <View style={styles.rowContainer2}>
          <Text style={styles.textHeading}>Astrologer Name:</Text>
          <Text style={styles.textPara}>Brahama Vyas</Text>
        </View>
        <View style={styles.rowContainer2}>
          <Text style={styles.textHeading}>Time:</Text>
          <Text style={styles.textPara}>12-11-2023</Text>
        </View>
        <View style={styles.rowContainer2}>
          <Text style={styles.textHeading}>Time spent:</Text>
          <Text style={styles.textPara}>2:00 mins</Text>
        </View>
        <View style={styles.rowContainer2}>
          <Text style={styles.textHeading}>Charge:</Text>
          <Text style={styles.textPara}>₹  34</Text>
        </View>
        <View style={styles.rowContainer2}>
          <Text style={styles.textHeading}>Promotion:</Text>
          <Text style={styles.textPara}>₹ 10 {item.price_per_min}</Text>
        </View>
        <View style={styles.rowContainer2}>
          <Text style={{ ...styles.textHeading, fontSize: 16 }}>
            Total Charge:
          </Text>
          <Text style={{ ...styles.textPara, fontSize: 16 }}>
            ₹ 24
            {item.call_log_charge_amount == null
              ? '0'
              : item.call_log_charge_amount}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.black_color1 }}>
      <MyLoader isVisible={isLoading} />
      <View style={{ flex: 1, width: '95%', alignSelf: 'center' }}>
        {orderHistoryData && (
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={item => item.call_log_id}
            style={{ paddingTop: 15 }}
          />
        )}
      </View>
    </View>
  );
};

const mapStateToProps = state => ({
  customerData: state.customer.customerData,
  firebaseId: state.customer.firebaseId,
});

export default connect(mapStateToProps, null)(CustomerOrderHistory);

const styles = StyleSheet.create({
  divider: {
    height: 1, // Adjust the height as needed
    backgroundColor: colors.black_color6, // Adjust the color as needed
    marginVertical: 10, // Adjust the vertical margin as needed
  },
  textHeading: {
    fontSize: 13,
    color: colors.black_color,
    fontFamily: fonts.semi_bold,
  },
  textID: {
    fontSize: 14,
    color: colors.black_color7,
    fontFamily: fonts.semi_bold,
  },
  textPara: {
    fontSize: 12,
    color: colors.black_color7,
    fontFamily: fonts.medium,
  },
  rowContainer: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  rowContainer2: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  childRowContainer: {},
});
