import {
  View,
  Text,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Image,
  BackHandler,
  Alert,
  KeyboardAvoidingView,
  Modal,
  TouchableWithoutFeedback,
  StyleSheet,
  FlatList,
} from 'react-native';
import React, {useCallback} from 'react';
import {useState} from 'react';
import {useEffect} from 'react';
import {
  api2_tarot_cards,
  api_url,
  colors,
  deductwallet,
  fonts,
} from '../../config/Constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import MyStatusBar from '../../components/MyStatusbar';
import {vedic_images} from '../../config/Constants';
import {CommonActions, useFocusEffect} from '@react-navigation/native';
import database from '@react-native-firebase/database';
import {connect} from 'react-redux';
import moment from 'moment';
import {useMemo} from 'react';
import CardFlip from 'react-native-card-flip';
import axios from 'axios';
import {useRef} from 'react';
import MyLoader from '../../components/MyLoader';
import * as ImagePicker from 'react-native-image-picker';
import {actions} from '../../config/data';
import RNFetchBlob from 'rn-fetch-blob';
import * as ProviderActions from '../../redux/actions/ProviderActions';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {width, height} = Dimensions.get('screen');

const ProviderChat = props => {;
  console.log(props.providerData)
  let listRef = useRef(null);
  const [message, setMessage] = useState('');
  const [chatData, setChatData] = useState(null);
  const [tarotCardVisible, setTarotCardVisible] = useState(false);
  const [tarotCards, setTarotCards] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectImage, setSelectImage] = useState(null);
  const [totalTime, setTotalTime] = useState(0)
  const [timeLeft, setTimeLeft] = useState(
    (
      parseFloat(1000) /
      parseFloat(props.providerData.chat_price_m)
    ).toFixed(0) * 60,
  );
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const memoizedArray = useMemo(() => chatData, [chatData]);
  useEffect(() => {
    props.navigation.setOptions({
      headerShown: false,
    });
  }, []);

  useEffect(()=>{
    get_chats()
  }, [])

  const is_typing = focus => {
    database()
      .ref(`/UserId/${props.route.params.customerData.user_id}`)
      .on('value', snapshot => {
        database().ref(`/Chat/${props.firebaseId}/${snapshot.val()}`).update({
          typing: focus,
        });
        database().ref(`/Chat/${snapshot.val()}/${props.firebaseId}`).update({
          typing: focus,
        });
      });
  };

  const get_chats = () => {
    console.log(`/UserId/${props.route.params.customerData.user_id}`)
    database()
      .ref(`/UserId/${props.route.params.customerData.user_id}`)
      .on('value', snapshot => {
        console.log(`/Messages/${props.firebaseId}/${snapshot.val()}`)
        database()
          .ref(`/Messages/${props.firebaseId}/${snapshot.val()}`)
          .on('value', value => {
            const myDataObject = value.val();
            const myDataArray = Object.keys(myDataObject)
              .sort()
              .map(key => myDataObject[key]);
            setChatData(myDataArray.reverse());
          });
      });
  };

  const add_message = async (image = null) => {
    setChatData(prev => [
      ...prev,
      {
        from: props.firebaseId,
        message: image != null ? image.uri : message,
        timestamp: new Date().getTime(),
        to: 'dsfnsdhfjhsdjfh',
        type: image != null ? 'image' : 'text',
      },
    ]);
    if (image != null) {
      // try {
      //   const storageRef = storage().ref(`message_images/${image.base64}`);
      //   const downloadUrl = await storageRef.getDownloadURL();
      //   console.log('Image URL:', downloadUrl);
      // } catch (error) {
      //   console.log('Error retrieving image URL:', error);
      // }
    }
    database()
      .ref(`/UserId/${props.route.params.customerData.user_id}`)
      .on('value', snapshot => {
        const send_msg = {
          message:
            image != null
              ? RNFetchBlob.wrap(image.uri.replace('file://', ''))
              : message,
          timestamp: moment(new Date()).format('DD-MM-YYYY HH:MM:ss '),
          to: snapshot.val(),
          type: image != null ? 'image' : 'text',
        };
        const node = database()
          .ref(`/UserId/${props.route.params.customerData.user_id}`)
          .push();
        const key = node.key;
        console.log(`/Messages/${props.firebaseId}/${snapshot.val()}/${key}`);
        database()
          .ref(`/Messages/${props.firebaseId}/${snapshot.val()}/${key}`)
          .set({
            from: props.firebaseId,
            image: 'image = null',
            message: image != null ? image.uri : message,
            timestamp: new Date().getTime(),
            to: snapshot.val(),
            type: image != null ? 'image' : 'text',
          });
        database()
          .ref(`/Messages/${snapshot.val()}/${props.firebaseId}/${key}`)
          .set({
            from: props.firebaseId,
            image: 'image = null',
            message: image != null ? image.uri : message,
            timestamp: new Date().getTime(),
            to: snapshot.val(),
            type: image != null ? 'image' : 'text',
          });
        database()
          .ref(`/Chat/${props.firebaseId}/${snapshot.val()}`)
          .update(send_msg);
        database()
          .ref(`/Chat/${snapshot.val()}/${props.firebaseId}`)
          .update(send_msg);
        setMessage('');
        // get_chats();
      });
  };

  const end_chat = async() => {
    await AsyncStorage.setItem('request', '0')
    Alert.alert('Alert!', 'Are you sure to end your chat?', [
      {
        text: 'No',
        style: 'cancel',
      },
      {
        text: 'Yes',
        style: 'destructive',
        onPress: () => go_home(),
      },
    ]);
  };

  const getDateOrTime = timestamp => {
    const now = Date.now();
    const diff = now - timestamp;
    const oneDay = 24 * 60 * 60 * 1000;

    if (diff < oneDay) {
      // Within last 24 hours, return time
      const date = new Date(timestamp);
      const hours = date.getHours();
      const minutes = date.getMinutes();
      return `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
    } else if (diff < 2 * oneDay) {
      // Between 24 and 48 hours ago, return "Yesterday" and time
      const yesterday = new Date(timestamp);
      const hours = yesterday.getHours();
      const minutes = yesterday.getMinutes();
      return `Yesterday ${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
    } else {
      // Before yesterday, return date and time
      const date = new Date(timestamp);
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const hours = date.getHours();
      const minutes = date.getMinutes();
      return `${day}/${month}/${year} ${hours}:${
        minutes < 10 ? '0' + minutes : minutes
      }`;
    }
  };

  const go_home = async(image = null) => {
    setChatData(prev => [
      ...prev,
      {
        from: props.firebaseId,
        message: 'Astrologer ended in chat',
        timestamp: new Date().getTime(),
        to: 'dsfnsdhfjhsdjfh',
        type: image != null ? 'image' : 'text',
      },
    ]);
    props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'providerHome'}],
      }),
    );
  };

  const render_chat = ({item, index}) => {
    return (
      <View
        key={index}
        style={{
          transform: [{scaleY: -1}],
        }}>
        {item.from != props.firebaseId ? (
          <View
            style={{
              flex: 0,
              flexDirection: 'row',
              alignItems: 'flex-start',
              marginTop: 15,
            }}>
            <Image
              source={require('../../assets/images/logo.png')}
              style={{width: 40, height: 40, resizeMode: 'contain'}}
            />
            <View
              style={{
                flex: 0,
                maxWidth: width * 0.7,
                backgroundColor: '#ddd',
                padding: 10,
                borderRadius: 10,
                shadowColor: colors.black_color8,
                shadowOffset: {width: -2, height: 2},
                shadowOpacity: 0.3,
                shadowRadius: 3,
                marginLeft: 10,
              }}>
              {item.type != 'image' ? (
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.black_color8,
                  }}>
                  {item.message}{' '}
                </Text>
              ) : (
                <Image
                  source={{uri: item.message}}
                  style={{width: width * 0.3, height: width * 0.4}}
                />
              )}
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: fonts.medium,
                  color: colors.black_color8,
                }}>
                {getDateOrTime(item.timestamp)}
              </Text>
            </View>
          </View>
        ) : (
          <View
            style={{
              flex: 0,
              flexDirection: 'row',
              alignItems: 'flex-start',
              justifyContent: 'flex-end',
              marginTop: 15,
            }}>
            <View
              style={{
                flex: 0,
                maxWidth: width * 0.7,
                backgroundColor: colors.background_theme2,
                padding: 10,
                borderRadius: 10,
                shadowColor: colors.black_color8,
                shadowOffset: {width: -2, height: 2},
                shadowOpacity: 0.3,
                shadowRadius: 3,
                marginRight: 10,
              }}>
              {item.type != 'image' ? (
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.background_theme1,
                  }}>
                  {item.message}{' '}
                </Text>
              ) : (
                <Image
                  source={{uri: item.message}}
                  style={{width: width * 0.3, height: width * 0.4}}
                />
              )}
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: fonts.medium,
                  color: colors.background_theme1,
                  textAlign: 'right',
                }}>
                {getDateOrTime(item.timestamp)}
              </Text>
            </View>
            <Image
              source={require('../../assets/images/logo.png')}
              style={{width: 40, height: 40, resizeMode: 'contain'}}
            />
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.white_color}}>
      <MyStatusBar
        backgroundColor={colors.background_theme2}
        barStyle="light-content"
      />
      <MyLoader isVisible={isLoading} />
      <View
        style={{
          flex: 0,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: colors.background_theme2,
          paddingVertical: 10,
          paddingHorizontal: 10,
        }}>
        <View style={{flex: 0, flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity
            onPress={() => {
              Alert.alert('Confirm', 'Are you sure you want to go back?', [
                {text: "Don't leave", style: 'cancel', onPress: () => {}},
                {
                  text: 'Yes, leave',
                  style: 'destructive',
                  onPress: () => go_home(),
                },
              ]);
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
          <Image
            source={require('../../assets/images/logo.png')}
            style={{
              width: width * 0.1,
              height: width * 0.1,
              borderRadius: (width * 0.1) / 2,
              borderWidth: 2,
              borderColor: colors.background_theme1,
              marginLeft: 10,
            }}
          />
          <View style={{flex: 0, marginLeft: 10}}>
            <Text
              style={{
                fontSize: 16,
                color: colors.background_theme1,
                fontFamily: fonts.semi_bold,
              }}>
              {props.route.params?.customerData?.username}
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: colors.background_theme1,
                fontFamily: fonts.medium,
              }}>{`${minutes.toString().padStart(2, '0')}:${seconds
              .toString()
              .padStart(2, '0')} min`}</Text>
          </View>
        </View>
        <View style={{flex: 0, flexDirection: 'row', alignItems: 'center'}}>
          <Ionicons name="wallet" color={colors.white_color} size={28} />
          <TouchableOpacity
            onPress={end_chat}
            style={{
              flex: 0,
              paddingHorizontal: 15,
              paddingVertical: 5,
              backgroundColor: colors.background_theme1,
              borderRadius: 15,
              marginLeft: 10,
            }}>
            <Text
              style={{
                fontSize: 14,
                color: colors.black_color,
                fontFamily: fonts.medium,
              }}>
              End Chat
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <ImageBackground
        source={vedic_images.chat_background}
        style={{flex: 1, width: width}}>
        <View
          style={{flex: 1, paddingHorizontal: 10, transform: [{scaleY: -1}]}}>
          {chatData && (
            <FlatList
              ref={listRef}
              data={memoizedArray}
              renderItem={render_chat}
            />
          )}
        </View>
      </ImageBackground>
      <KeyboardAvoidingView >
        <View
          style={{
            flex: 0,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: colors.white_color,
            paddingVertical: 10,
            paddingHorizontal: 5,
          }}>
          <TouchableOpacity
            // onPress={()=>get_profile_pick(actions[1].type, actions[1].options)}
            style={{flex: 0, justifyContent: 'center', alignItems: 'center'}}>
            <Ionicons name="images" color={colors.black_color7} size={30} />
          </TouchableOpacity>
          <TextInput
            value={message}
            placeholder="Type here.."
            placeholderTextColor={colors.black_color8}
            onFocus={() => is_typing(1)}
            onBlur={() => is_typing(0)}
            // onSubmitEditing={add_message}
            onChangeText={text => {
              setMessage(text);
            }}
            style={{
              flex: 0,
              width: '70%',
              fontSize: 16,
              color: colors.black_color9,
              fontWeight: 'normal',
              borderWidth: 1,
              borderColor: colors.black_color8,
              borderRadius: 5,
              paddingVertical: 10,
              paddingHorizontal: 5,
            }}
          />
          <TouchableOpacity
            disabled={message.length == 0 || message.trim() === ''}
            onPress={() => add_message()}
            style={{
              flex: 0,
              width: 50,
              height: 50,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: colors.background_theme2,
              borderRadius: 30,
              shadowColor: colors.black_color8,
              shadowOffset: {width: -2, height: 2},
              shadowOpacity: 0.3,
              shadowRadius: 5,
            }}>
            <Octicons name="arrow-right" color={colors.white_color} size={30} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const mapStateToProps = state => ({
  providerData: state.provider.providerData,
  dashboard: state.provider.dashboard,
  firebaseId: state.provider.firebaseId,
});

const mapDispatchToProps = dispatch =>({dispatch})

export default connect(mapStateToProps, mapDispatchToProps)(ProviderChat);
