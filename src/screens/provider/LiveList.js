import {
  View,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Image,
  RefreshControl,
  Alert,
} from 'react-native';
import { useEffect, useState } from 'react';
import {
  api_url,
  colors,
  fonts,
  get_astrologer_live_details,
  go_live,
} from '../../config/Constants';
import { connect } from 'react-redux';
const { width, height } = Dimensions.get('screen');
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';

const LiveList = props => {
  const [AstrologeData, setAstrologeData] = useState(null);
  const [AstrologeImg, setAstrologeImg] = useState(null);
  const navigation = useNavigation();
  const [state, setState] = useState({
    isLoading: false,
    refreshing: false,
    astrologeData: null,
    astrologeImg: null,
  });
  const dummydata = [
    { id: 1, },
    { id: 2 },
    { id: 3 }
  ]

  const updateState = data => setState({ ...state, ...data });

  useEffect(() => {
    get_Astrologers();
    console.log(props.providerData.id, 'providerData');
  }, []);

  const get_Astrologers = async () => {
    try {
      await axios({
        method: 'post', // Change the method to 'get'
        url: api_url + get_astrologer_live_details, // Assuming postdata is a query parameter
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: {
          user_id: props.providerData.id,
        },
      })
        .then(res => {
          console.log(res.data, 'youa');
          setAstrologeData(res.data.data.reverse());
          setAstrologeImg(res.data.image);
        })
        .catch(err => {
          console.log(err);
        });

      // console.log(response.data, 'erdftikojl');r
    } catch (error) {
      console.error(error);
    }
  };

  const get_astrologer_on_refresh = async () => {
    updateState({ refreshing: true });
    await axios({
      method: 'post',
      url: api_url + get_astrologer_live_details,
      data: {
        user_id: props.providerData.id,
      },
    })
      .then(res => {
        updateState({ refreshing: false });
        setAstrologeData(res.data.data);
        setAstrologeImg(res.data.image);
      })
      .catch(err => {
        updateState({ refreshing });
        console.log(err);
      });
  };
  const Astro_golive = async () => {
    console.log('going live');
    try {
      const response = await axios({
        method: 'post',
        url: api_url + go_live,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: {
          astro_id: props.providerData.id,
          status: 'live',
        },
      });
    } catch (error) {
      console.error(error, 'erer');

      Alert.alert(error.message);
    }
  };

  const { isLoading, refreshing, astrologeData, astrologeImg } = state;

  return (
    <View style={{ flex: 1, backgroundColor: colors.white_color }}>
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={get_astrologer_on_refresh}
          />
        }
        ListHeaderComponent={<>{AstrologeData && astrologerListInfo()}</>}
      />
    </View>
  );

  function astrologerListInfo() {
    const renderItem = ({ item }) => {
      return (
        <View
          style={{
            flex: 0,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: colors.background_theme1,
            marginHorizontal: 15,
            padding: 10,
            marginTop: 10,
            marginBottom: 10,
            elevation: 5,
            borderRadius: 15,
          }}>
          <View style={{ flexDirection: 'row' }}>
            {AstrologeImg ? (
              <Image
                source={{ uri: AstrologeImg }}
                style={{ width: width * 0.1, height: width * 0.1, marginRight: 15 }}
                resizeMode="contain"
              />
            ) : (
              <Image
                source={require('../../assets/images/logo1.png')}
                style={{ width: width * 0.1, height: width * 0.1, marginRight: 15 }}
                resizeMode="contain"
              />
            )}
            <View>
              <Text
                style={{
                  color: colors.black_color,
                  fontSize: 15,
                  fontFamily: fonts.bold
                  // textAlign: 'center',
                }}>
                Ritik Likhar
                {/* {item.title} */}
              </Text>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ color: colors.black_color7, fontSize: 13 }}>
                  12/10/2023{" "}
                  {/* {item.date && moment(item.date).format('Do MMM YYYY')} */}
                </Text>
                <Text style={{ color: colors.black_color7, fontSize: 13 }}>
                  10:30 PM
                  {/* {item.time && moment(item.time, 'HH:mm').format('hh:mm A')} */}
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => {
              if ('Live') {
                navigation.navigate('HostPage'), Astro_golive();
                return false;
              }
            }}
            style={{
              flex: 0,
              flexDirection: 'row',
              alignItems: 'center',
              borderRadius: 20,
              padding: 5,
              width: width * 0.2,
              justifyContent: 'center',
              backgroundColor: colors.background_theme4,
            }}>
            <Text style={{ color: colors.white_color, fontSize: 12 }}>
              {AstrologeData.is_live == 0 ? 'End Live' : 'Start Live '}
              {/* hi */}
            </Text>
          </TouchableOpacity>
        </View>
      );
    };


    const renderHistoryItem = ({ item }) => {
      return (
        <View
          style={{
            flex: 0,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: colors.background_theme1,
            marginHorizontal: 15,
            padding: 10,
            marginTop: 10,
            marginBottom: 10,
            elevation: 3,
            borderRadius: 15,
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image source={require('../../assets/images/order_history.png')}
              resizeMode='contain'
              style={{ width: 30, height: 30, marginRight: 10 }} />
            <Text style={{ fontSize: 15 }}>Purpose goes here...</Text>
          </View>
          <View >
            <Text style={{ color: colors.green_color2, fontSize: 16, fontFamily: fonts.bold }}>Completed</Text>
            <Text style={{ color: colors.black_color7, textAlign: 'center' }}>
              Date: 10-09-2023,{"\n"}Time: 03:15:00 PM
            </Text>
          </View>
        </View>
      );
    };
    return (
      <View style={{ paddingVertical: 10 }}>
        <FlatList
          data={dummydata}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingVertical: 10 }}
        />
        <View style={{ paddingHorizontal: 15, paddingVertical: 10 }}>
          <Text style={{ fontSize: 16, fontFamily: fonts.bold }}>
            Your Live History
          </Text>
        </View>
        <FlatList
          data={dummydata}
          renderItem={renderHistoryItem}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingVertical: 10 }}
        />
      </View>
    );
  }
};
const mapStateToProps = state => ({
  providerData: state.provider.providerData,
  dashboard: state.provider.dashboard,
});

export default connect(mapStateToProps, null)(LiveList);
