import {View, Text, FlatList, Image, Dimensions} from 'react-native';
import React from 'react';
import {useEffect} from 'react';
import {api_getfollowinglist, api_url, colors, fonts, img_url} from '../../config/Constants';
import MyHeader from '../../components/MyHeader';
import {useState} from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import MyLoader from '../../components/MyLoader';

const {width, height} = Dimensions.get('screen');

const Following = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [followingData, setFollowingData] = useState(null);
  useEffect(() => {
    props.navigation.setOptions({
      header: () => (
        <MyHeader
          title="Following"
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
      url: api_url + api_getfollowinglist,
      data: {
        user_id: props.customerData.id,
      },
    })
      .then(res => {
        setIsLoading(false);
        console.log(res.data);
        setFollowingData(res.data.records);
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
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.background_theme1,
          borderRadius: 5,
          paddingHorizontal: 15,
          paddingVertical: 10,
          marginBottom: 15,
          shadowColor: colors.black_color2,
          shadowOffset: {width: 0, height: 1},
          shadowOpacity: 0.3,
          shadowRadius: 5
        }}>
          <Image source={{uri: img_url + item.img_url}} style={{width: width*0.12, height: width*0.12, borderRadius: 10000}} />
          <Text style={{fontSize: 16, color: colors.black_color8, fontFamily: fonts.semi_bold, marginLeft: 10}}>{item.owner_name}</Text>
        </View>
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.black_color1}}>
      <MyLoader isVisible={isLoading} />
      {followingData && (
        <FlatList
          data={followingData}
          renderItem={renderItem}
          contentContainerStyle={{padding: 15}}
        />
      )}
    </View>
  );
};

const mapStateToProps = state => ({
  customerData: state.customer.customerData,
});

export default connect(mapStateToProps, null)(Following);
