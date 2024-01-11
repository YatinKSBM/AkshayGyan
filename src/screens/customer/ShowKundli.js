import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import React from 'react';
import MyHeader from '../../components/MyHeader';
import { useEffect } from 'react';
import {
  api_url,
  colors,
  fonts,
  kundli_get_planets,
} from '../../config/Constants';
import { useState } from 'react';
import ShowKundliBasic from '../../navigations/ShowKundliBasic';
import ShowKundliCharts from '../../navigations/ShowKundliCharts';
import ShowKundliPlanets from '../../navigations/ShowKundliPlanets';
import ShowKundliDasha from '../../navigations/ShowKundliDasha';
import MyLoader from '../../components/MyLoader';
import axios from 'axios';
import { connect } from 'react-redux';

const { width, height } = Dimensions.get('screen');

const ShowKundli = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [planetData, setPlanetData] = useState(null)
  const [whatShow, setWhatShow] = useState({
    basic: true,
    charts: false,
    dasha: false,
    planets: false,
  });
  useEffect(() => {
    props.navigation.setOptions({
      header: () => (
        <MyHeader
          title="Show Kundli"
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
    get_planets()
  }, [])

  const get_planets = async () => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + kundli_get_planets,
      data: {
        user_id: props.customerData.id,
        date_of_birth: props.route.params.data.dob,
        time_of_birth: props.route.params.data.tob,
        lat: props.route.params.data.latitude,
        lon: props.route.params.data.longitude,
        customer_name: props.route.params.data.customer_name,
        timezone: "+5:30",
        address: props.route.params.data.place,
      },
    }).then((res) => {
      console.log(res.data)
      setPlanetData(res.data.data)
      setIsLoading(false)
    }).catch(err => {
      setIsLoading(false);
      console.log(err)
    });
  };
  return (
    <View style={{ flex: 1, backgroundColor: colors.background_theme1 }}>
      <MyLoader isVisible={isLoading} />
      <View
        style={{
          flex: 0,
          width: '92%',
          alignSelf: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: 15,
        }}>
        <TouchableOpacity
          onPress={() =>
            setWhatShow({ basic: true, charts: false, dasha: false, planets: false })
          }
          style={{
            width: '23%',
            paddingVertical: 10,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: whatShow.basic
              ? colors.background_theme4
              : colors.background_theme1,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderLeftWidth: 1,
            borderBottomLeftRadius: 10,
            borderTopLeftRadius: 10,
          }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: whatShow.basic ? 'bold' : '',
              color: whatShow.basic
                ? colors.white_color
                : colors.black_color7,
              fontFamily: fonts.medium,
            }}>
            Basic
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            setWhatShow({ basic: false, charts: true, dasha: false, planets: false })
          }
          style={{
            width: '23%',
            paddingVertical: 10,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: whatShow.charts
              ? colors.background_theme4
              : colors.background_theme1,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderLeftWidth: 1,
          }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: whatShow.charts ? 'bold' : '',
              color: whatShow.charts
                ? colors.background_theme1
                : colors.black_color7,
              fontFamily: fonts.medium,
            }}>
            Charts
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            setWhatShow({ basic: false, charts: false, dasha: true, planets: false })
          }
          style={{
            width: '23%',
            paddingVertical: 10,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: whatShow.dasha
              ? colors.background_theme4
              : colors.background_theme1,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderLeftWidth: 1,
          }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: whatShow.dasha ? 'bold' : '',
              color: whatShow.dasha
                ? colors.background_theme1
                : colors.black_color7,
              fontFamily: fonts.medium,
            }}>
            Dasha
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            setWhatShow({ basic: false, charts: false, dasha: false, planets: true })
          }
          style={{
            width: '23%',
            paddingVertical: 10,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: whatShow.planets
              ? colors.background_theme4
              : colors.background_theme1,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderWidth: 1,
            borderBottomRightRadius: 10,
            borderTopRightRadius: 10,
          }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: whatShow.planets ? 'bold' : '',
              color: whatShow.planets
                ? colors.background_theme1
                : colors.black_color7,
              fontFamily: fonts.medium,
            }}>
            Planets
          </Text>
        </TouchableOpacity>
      </View>
      {whatShow.basic ?
        (<ShowKundliBasic
          navigation={props.navigation}
          data={props.route.params.data}
        />)
        :
        planetData && whatShow.charts ?
          (<ShowKundliCharts
            navigation={props.navigation}
            data={props.route.params.data}
            planetData={planetData}
          />)
          :
          planetData && whatShow.dasha ? (
            <ShowKundliDasha
              navigation={props.navigation}
              data={props.route.params.data}
            />) :
            <ShowKundliPlanets
              navigation={props.navigation}
              data={props.route.params.data}
              planetData={planetData}
            />
      }
    </View>
  );
};

const mapStateToProps = state => ({
  customerData: state.customer.customerData,
  wallet: state.customer.wallet,
});


export default connect(mapStateToProps, null)(ShowKundli);
