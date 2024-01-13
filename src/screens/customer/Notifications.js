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
          width: '95%',
          padding: width * 0.02,
          backgroundColor:
            item.read == 0
              ? colors.white_color
              : colors.black_color3,
          marginBottom: 15,
          borderRadius: 10,
          elevation: 3,
          alignSelf: 'center'
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ width: '20%', }}>
            <View style={{ width: width * 0.15, height: width * 0.15 }}>
              <Image
                source={item.image_url.length != 0 ? { uri: item.image_url } : require('../../assets/images/logo.png')}
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 1000,
                }}
              />
            </View>
          </View>
          <View style={{ width: '80%', }}>
            <Text
              numberOfLines={1}
              style={{
                fontSize: 16,
                color:
                  item.read == 0
                    ? colors.black_color
                    : colors.black_color7,
                fontFamily: fonts.semi_bold,
                marginBottom: 5,
              }}>
              {item.title}
            </Text>
            <Text
              numberOfLines={32}
              style={{
                fontSize: 12,
                color:
                  item.read == 0
                    ? colors.black_color
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
              item.read == 0 ? colors.black_color6 : colors.gray,
            fontFamily: fonts.medium,
          }}>
          {item.created_date}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{
      flex: 1, backgroundColor: colors.black_color1,
      width: '100%',
      justifyContent: 'center',
      paddingHorizontal: width * 0.02,
      paddingVertical: width * 0.04
    }}>
      {props.notificationData && (
        <FlatList
          data={props.notificationData}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      )}
    </View>
  );
};

const mapStateToProps = state => ({
  notificationData: state.customer.notificationData,
});

export default connect(mapStateToProps, null)(Notifications);
