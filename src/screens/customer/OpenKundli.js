import {
  View,
  Text,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import React from 'react';
import { useEffect } from 'react';
import { api2_my_kundali, api_url, colors, fonts } from '../../config/Constants';
import Ionicons from 'react-native-vector-icons/Ionicons';

import MuiIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { useState } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
const { width, height } = Dimensions.get('screen');

const OpenKundli = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState(search);
  const [kundliList, setKundliList] = useState(null);

  useEffect(() => {
    props.navigation.setOptions({
      tabBarLabel: 'OPEN KUNDLI',
    });
  }, []);

  useEffect(() => {
    get_kundli();
  }, []);

  const get_kundli = async () => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + api2_my_kundali,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        user_id: props.customerData.id,
      },
    })
      .then(res => {
        console.log(res.data);
        setKundliList(res.data.kudali);
      })
      .catch(err => {
        console.log(err);
      });
  };
  return (
    <View style={{ flex: 1, backgroundColor: colors.black_color1 }}>
      {/* <View
        style={{
          flex: 0,
          flexDirection: 'row',
          width: '90%',
          alignSelf: 'center',
          marginVertical: 15,
          borderRadius: 1000,
          borderWidth: 1,
          borderColor: colors.black_color7,
          padding: 5,
        }}>
        <Ionicons name="search" color={colors.black_color7} size={25} />
        <TextInput
          placeholder="Search kundli by name..."
          placeholderTextColor={colors.black_color5}
          style={{
            fontSize: 14,
            color: colors.black_color7,
            fontFamily: fonts.medium,
            padding: 5,
          }}
        />
      </View> */}
      <View
        style={{
          flex: 0,
          backgroundColor: colors.background_theme1,
          paddingVertical: 10,
        }}>
        <View
          style={{
            flex: 0,
            width: '95%',
            alignSelf: 'center',
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 10,
            borderRadius: 1000,
            // borderWidth: 1,
            backgroundColor: colors.black_color3
          }}>
          <Ionicons name="search" color={colors.black_color6} size={22} />
          <TextInput
            value={search}
            placeholder="Search Kundli by Name..."
            placeholderTextColor={colors.black_color6}
            onChangeText={text => searchFilterFunction(text)}
            style={{
              width: '100%',
              fontFamily: fonts.medium,
              color: colors.black_color8,
              padding: 8,
            }}
          />
        </View>
      </View>



      <View style={{ width: '100%', alignSelf: 'center', marginTop: 10, }}>
        <Text
          style={{
            fontSize: 16,
            marginBottom: 10,
            fontFamily: fonts.medium,
            color: colors.black_color7,
            marginLeft:10
          }}>
          Recent kundli
        </Text>
        {kundliList && (
          <FlatList

            data={kundliList}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() => props.navigation.navigate('showKundli', { data: item })}
                activeOpacity={0.6}
                key={index}
                style={{
                  flex: 0,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingHorizontal: 15,
                  paddingVertical: 10,
                  backgroundColor: colors.background_theme1,
                  marginBottom: 15,
                  marginHorizontal: 10,
                  borderRadius: 5,
                  elevation: 5,
                  width: '95%',

                }}>
                <View
                  style={{ flex: 0, width: width * 0.7, flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ width: 40, height: 40, backgroundColor: colors.background_theme4, borderRadius: 50, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 20, color: colors.background_theme1 }}>{item.customer_name[0]}</Text>
                  </View>
                  <View style={{ marginLeft: 15 }}>
                    <Text
                      style={{
                        fontSize: 14,
                        color: colors.black_color7,
                        fontFamily: fonts.bold,
                      }}>
                      {item.customer_name}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: colors.black_color7,
                        fontFamily: fonts.medium,
                      }}>
                      {`${item.dob} ${item.tob}`}
                    </Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', width: width * 0.2, justifyContent: 'space-around', }}>
                  <TouchableOpacity>
                    <Ionicons
                      name="ellipsis-vertical-sharp"
                      color={colors.black_color7}
                      size={25}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <MuiIcons
                      name="delete"
                      color={colors.black_color7}
                      size={25}
                    />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </View >
  );
};

const mapStateToProps = state => ({
  customerData: state.customer.customerData,
  wallet: state.customer.wallet,
});

export default connect(mapStateToProps, null)(OpenKundli);
