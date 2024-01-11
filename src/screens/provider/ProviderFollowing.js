import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
} from 'react-native';
import React from 'react';
import { useEffect } from 'react';
import {
  api_getfollowinglist,
  api_url,
  colors,
  fonts,
  get_following_list_astro,
  img_url,
  provider_img_url,
} from '../../config/Constants';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useState } from 'react';
import MyLoader from '../../components/MyLoader';
import axios from 'axios';
import { connect } from 'react-redux';
import MyHeader from '../../components/MyHeader';

const { width, height } = Dimensions.get('screen');

const ProviderFollowing = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [followingData, setFollowingData] = useState(null);
  useEffect(() => {
    props.navigation.setOptions({
      header: () => (
        <MyHeader
          title="My Followers"
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
    get_following();
  }, []);

  const get_following = async () => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + get_following_list_astro,
      data: {
        astro_id: props.providerData.id,
      },
    })
      .then(res => {
        console.log(res.data)
        setIsLoading(false);
        setFollowingData(res.data.records);
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const renderItem = ({ item, index }) => {
    return (
      <View
        style={{
          flex: 0,
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.background_theme1,
          borderRadius: 5,
          paddingHorizontal: 15,
          paddingVertical: 10,
          marginBottom: 15,
          elevation: 3
        }}>
        {provider_img_url ? <Image
          source={{ uri: provider_img_url + item.user_profile_image }}
          style={{
            width: 50, height: 50,
            borderRadius: 10,
          }}
        /> :
          <View style={{ width: 40, height: 40, backgroundColor: colors.background_theme4, borderRadius: 50, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 20, color: colors.background_theme1 }}>{item.username[0]}</Text>
          </View>
        }
        <Text
          style={{
            fontSize: 16,
            color: colors.black_color8,
            fontFamily: fonts.semi_bold,
            marginLeft: 10,
          }}>
          {item.username}
        </Text>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.black_color1 }}>
      <MyLoader isVisible={isLoading} />
      {followingData && (
        <FlatList
          data={followingData}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 15 }}
        />
      )}
    </View>
  );
};

const mapStateToProps = state => ({
  providerData: state.provider.providerData,
});

export default connect(mapStateToProps, null)(ProviderFollowing);
