import { View, Text, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import React from 'react';
import { useEffect } from 'react';
import MyHeader from '../../components/MyHeader';
import { colors, fonts } from '../../config/Constants';
import { connect } from 'react-redux';
import { Image } from 'react-native';

const { width, height } = Dimensions.get('screen');

const Notifications = props => {
  useEffect(() => {
    props.navigation.setOptions({
      header: () => (
        <MyHeader
          title="Notifications"
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

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() =>
          props.navigation.navigate('notificationDetailes', {
            notificationData: item,
          })
        }
        style={{
          flex: 0,
          width: '90%',
          padding: 10,
          marginHorizontal: 10,
          backgroundColor:
            item.read == 0
              ? colors.yellow_color1
              : colors.background_theme1,
          marginBottom: 15,
          borderRadius: 10,
          elevation: 5,
          alignItems: 'center',
        }}>
        <View style={{ flex: 0, flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={item.image_url.length != 0 ? { uri: item.image_url } : require('../../assets/images/logo.png')}
            style={{
              width: width * 0.18,
              height: width * 0.18,
              borderRadius: 1000,
            }}
          />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text
              numberOfLines={1}
              style={{
                fontSize: 16,
                color:
                  item.read == 0
                    ? colors.background_theme1
                    : colors.black_color7,
                fontFamily: fonts.semi_bold,
                marginBottom: 5,
              }}>
              {item.title}
            </Text>
            <Text
              numberOfLines={2}
              style={{
                fontSize: 12,
                color:
                  item.read == 0
                    ? colors.background_theme1
                    : colors.black_color6,
                fontFamily: fonts.medium,
              }}>
              {item.description}
            </Text>
          </View>
        </View>
        <Text
          style={{
            textAlign: 'right',
            fontSize: 12,
            color:
              item.read == 0 ? colors.background_theme1 : colors.gray,
            fontFamily: fonts.medium,
          }}>
          {item.created_date}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.black_color1, width: '100%', justifyContent: 'center', padding: 10 }}>
      {props.notificationData && (
        <FlatList
          data={props.notificationData}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          style={{ width: width }}
        />
      )}
    </View>
  );
};

const mapStateToProps = state => ({
  notificationData: state.customer.notificationData,
});

export default connect(mapStateToProps, null)(Notifications);
