import {View, Text, FlatList, StyleSheet, Dimensions} from 'react-native';
import React from 'react';
import MyHeader from '../../components/MyHeader';
import {
  api_paymenthistory,
  api_url,
  colors,
  fonts,
} from '../../config/Constants';
import {useEffect} from 'react';
import {useState} from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import MyLoader from '../../components/MyLoader';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const {width, height} = Dimensions.get('screen')

const BillHistory = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [historyData, setHistoryData] = useState(null);

  useEffect(() => {
    props.navigation.setOptions({
      header: () => (
        <MyHeader
          title="Payment Bill History"
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
    get_history();
  }, []);

  const get_history = async () => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + api_paymenthistory,
      data: {
        user_id: props.customerData.id,
      },
    })
      .then(res => {
        setIsLoading(false);
        console.log(res.data);
        if (res.data.status == 1) {
          setHistoryData(res.data.records);
        }
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const renderItem = ({item, index}) => {
    return (
      <View
        style={{
          flex: 0,
          backgroundColor: colors.background_theme1,
          borderRadius: 10,
          height: 250,
          shadowColor: colors.black_color2,
          shadowOffset: {width: 0, height: 1},
          shadowOpacity: 0.3,
          shadowRadius: 10,
          marginBottom: 15,
          padding: 15,
        }}>
        <View style={styles.row}>
          <View style={{flex: 0, flexDirection: 'row', alignItems: 'center'}}>
            <FontAwesome
              name="check-circle"
              color={colors.background_theme2}
              size={25}
            />
            <Text
              style={{
                fontSize: 16,
                color: colors.green_color1,
                fontFamily: fonts.bold,
                marginLeft: 10,
              }}>
              Balnace Added
            </Text>
          </View>

          <Text
            style={{
              fontSize: 16,
              color: colors.green_color1,
              fontFamily: fonts.bold,
            }}>
          ₹ {parseFloat(item.cramount)}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowText}>ID</Text>
          <Text style={styles.rowText}>{item.trans_id}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowText}>Time</Text>
          <Text style={styles.rowText}>{item.transdate}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowText}>Gift</Text>
          <Text style={styles.rowText}>₹ {item.gift_amt}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowText}>Sub Total</Text>
          <Text style={styles.rowText}>
          ₹ {parseFloat(item.gift_amt) + parseFloat(item.cramount)}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowText}>Tax</Text>
          <Text style={styles.rowText}>
            ₹ 
            {((parseFloat(item.gift_amt) + parseFloat(item.cramount)) / 100) *
              18}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowText}>Total Paid</Text>
          <Text style={styles.rowText}>
            ₹ 
            {((parseFloat(item.gift_amt) + parseFloat(item.cramount)) / 100) *
              18 +
              parseFloat(item.cramount)}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowText}>Method</Text>
          <Text style={styles.rowText}>
            {item.bal_type == '5' ? 'Online' : 'Admin'}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.black_color1}}>
      <MyLoader isVisible={isLoading} />
      {historyData && (
        <FlatList
          data={historyData}
          renderItem={renderItem}
          contentContainerStyle={{padding: 15}}
          ListEmptyComponent={() => (
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center', height: height*0.7, padding: 20}}>
              <Text style={{fontSize: 16, color: colors.red_color1, fontFamily: fonts.medium, textAlign: 'center'}}>You have not any transaction history yet.</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const mapStateToProps = state => ({
  customerData: state.customer.customerData,
});

export default connect(mapStateToProps, null)(BillHistory);

const styles = StyleSheet.create({
  row: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  rowText: {
    fontSize: 14,
    color: colors.black_color7,
    fontFamily: fonts.medium,
  },
});
