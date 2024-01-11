import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Image,
  Linking,
} from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors, fonts } from '../config/Constants';
import { openFacebook, openInstagram, openYoutube } from './Methods';

const MyHeader = ({ navigation, title, statusBar, socialIcons = true }) => {
  return (
    <SafeAreaView
      style={{ backgroundColor: colors.background_theme2 }}
      forceInset={{ top: 'always', bottom: 'never' }}>
      <View
        style={{
          flex: 0,
          // height: Platform.OS == 'ios' ? 0 : StatusBar.currentHeight,
          backgroundColor: statusBar?.backgroundColor,
        }}>
        <StatusBar
          translucent
          backgroundColor={statusBar?.backgroundColor}
          barStyle={statusBar?.barStyle}
        />
      </View>
      <View
        style={{
          flex: 0,
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          paddingVertical: 12,
        }}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={{
            flex: 0,
            width: '15%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Ionicons
            name="arrow-back"
            color={colors.background_theme1}
            size={25}
          />
        </TouchableOpacity>
        <View style={{ flex: 0 }}>
          <Text
            numberOfLines={1}
            style={{
              fontSize: 16,
              color: colors.background_theme1,
              fontFamily: fonts.medium,
            }}>
            {title}
          </Text>
        </View>
        {/* {socialIcons && (
          <View style={{flex: 0, flexDirection: 'row', marginLeft: 10}}>
            <TouchableOpacity onPress={()=>openYoutube()}>
              <Image
                source={require('../assets/images/youtube_logo.jpeg')}
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 100,
                  marginRight: 5,
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
            onPress={()=>openInstagram()}
            >
              <Image
                source={require('../assets/images/instagram_logo.png')}
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 100,
                  marginRight: 5,
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
            onPress={()=>openFacebook()}
            >
              <Image
                source={require('../assets/images/facebook_logo.png')}
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 100,
                  marginRight: 5,
                }}
              />
            </TouchableOpacity>
          </View>
        )} */}
      </View>
    </SafeAreaView>
  );
};

export default MyHeader;
