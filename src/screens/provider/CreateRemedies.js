import {
  View,
  Text,
  ScrollView,
  Dimensions,
  TextInput,
  Image,
  TouchableOpacity,
  Modal,
} from 'react-native';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { api_url, colors, create_blog, fonts } from '../../config/Constants';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { actions } from '../../config/data';
import * as ImagePicker from 'react-native-image-picker';
import { useCallback } from 'react';
import RNFetchBlob from 'rn-fetch-blob';
import { success_toast, warnign_toast } from '../../components/MyToastMessage';
import MyLoader from '../../components/MyLoader';
import { connect } from 'react-redux';

const { width, height } = Dimensions.get('screen');

const CreateRemedies = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [remediesTitle, setRemediesTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [baseSixtyFourData, setbaseSixtyFourData] = useState(null);
  useEffect(() => {
    props.navigation.setOptions({
      tabBarLabel: 'CREATE REMEDIES',
    });
  }, []);

  useEffect(() => {
    props.navigation.addListener('focus', () => {
      if (typeof props.route.params?.data != 'undefined') {
        setRemediesTitle(props.route.params.data.title);
        setDescription(props.route.params.data.description);
        setProfileImage(props.route.params.data.image);
      }
    });
  }, []);

  const get_profile_pick = useCallback((type, options) => {
    if (type == 'capture') {
      ImagePicker.launchCamera(options, res => {
        setImageModalVisible(false);
        if (res.didCancel) {
          console.log('user cancel');
        } else if (res.errorCode) {
          console.log(res.errorCode);
        } else if (res.errorMessage) {
          console.log(res.errorMessage);
        } else {
          setProfileImage(res.assets[0].uri);
          setbaseSixtyFourData(res.assets[0].base64);
          // profile_picture_update(res.assets[0].uri);
        }
      });
    } else {
      ImagePicker.launchImageLibrary(options, res => {
        setImageModalVisible(false);
        if (res.didCancel) {
          console.log('user cancel');
        } else if (res.errorCode) {
          console.log(res.errorCode);
        } else if (res.errorMessage) {
          console.log(res.errorMessage);
        } else {
          setProfileImage(res.assets[0].uri);
          setbaseSixtyFourData(res.assets[0].base64);
          // profile_picture_update(res.assets[0].uri);
        }
      });
    }
  }, []);

  const validation = () => {
    if (remediesTitle.length == 0) {
      warnign_toast('Please enter the title.');
      return false;
    } else if (description.length == 0) {
      warnign_toast('Please enter the description.');
      return false;
    } else if (profileImage == null) {
      warnign_toast('Please select an image.');
      return false;
    } else {
      return true;
    }
  };

  const create_remedies = async () => {
    if (validation()) {
      setIsLoading(true);
      await RNFetchBlob.fetch(
        'POST',
        api_url + create_blog,
        {
          'Content-Type': 'multipart/form-data',
        },
        [
          { name: 'astro_id', data: props.providerData.id.toString() },
          { name: 'title', data: remediesTitle },
          { name: 'description', data: description },
          {
            name: 'image',
            data: baseSixtyFourData.toString(),
          },
        ],
      )
        .then(res => {
          setIsLoading(false);
          if (JSON.parse(res.data).status) {
            success_toast('Successfully created.');
            setRemediesTitle('');
            setDescription('');
            setProfileImage(null);
            setbaseSixtyFourData(null);
          } else {
            warnign_toast('Please try again.');
          }
        })
        .catch(err => {
          setIsLoading(false);
          console.log(err);
        });
    }
  };

  const update_remedies = async () => {
    if (validation()) {
      setIsLoading(true);
      let arr = [
        { name: 'astro_id', data: props.providerData.id.toString() },
        { name: 'title', data: remediesTitle },
        { name: 'description', data: description },
      ];
      if (profileImage.slice(0, 4) == 'http') {
        arr.push({
          name: 'image',
          data: '0',
        });
      }
      await RNFetchBlob.fetch(
        'POST',
        api_url + create_blog,
        {
          'Content-Type': 'multipart/form-data',
        },
        arr,
      )
        .then(res => {
          setIsLoading(false);
          console.log(res.data)
          if (JSON.parse(res.data).status) {
            success_toast('Successfully updated.');
          } else {
            warnign_toast('Please try again.');
          }
        })
        .catch(err => {
          setIsLoading(false);
          console.log(err);
        });
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.black_color1 }}>
      <MyLoader isVisible={isLoading} />
      <ScrollView>
        <View
          style={{
            flex: 0,
            width: '92%',
            backgroundColor: colors.background_theme1,
            alignSelf: 'center',
            marginVertical: 20,
            borderRadius: 10,
            elevation: 3,
            padding: 15,
          }}>
          <Text
            style={{
              fontSize: 13,
              color: colors.black_color9,
              fontFamily: fonts.medium,
              marginBottom: 10,
            }}>
            Remedies Title
          </Text>
          <TextInput
            value={remediesTitle}
            cursorColor={colors.background_theme2}
            placeholder="Enter Title"
            placeholderTextColor={colors.black_color7}
            onChangeText={setRemediesTitle}
            style={{
              width: '100%',
              padding: 10,
              borderRadius: 15,
              marginBottom: 15,
              backgroundColor: colors.black_color3,
            }}
          />
          <Text
            style={{
              fontSize: 13,
              color: colors.black_color9,
              fontFamily: fonts.medium,
              marginBottom: 10,
            }}>
            Remedies Description
          </Text>
          <TextInput
            value={description}
            placeholder="Enter Description"
            placeholderTextColor={colors.black_color7}
            onChangeText={setDescription}
            multiline
            style={{
              width: '100%',
              padding: 10,
              borderRadius: 10,
              backgroundColor: colors.black_color3,
              marginBottom: 15,
              height: height * 0.18,
            }}
          />
          <View
            style={{
              flex: 0,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                fontSize: 13,
                color: colors.black_color9,
                fontFamily: fonts.medium,
              }}>
              Remedies Image
            </Text>
            <TouchableOpacity onPress={() => setImageModalVisible(true)}>
              <Image
                source={
                  profileImage != null
                    ? { uri: profileImage }
                    : require('../../assets/images/logo.png')
                }
                style={{
                  width: width * 0.28,
                  height: width * 0.28,
                  resizeMode: 'contain',
                  borderRadius: 15
                }}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => {
              if (typeof props.route.params?.data != 'undefined') {
                update_remedies();
              } else {
                create_remedies();
              }
            }}
            style={{
              flex: 0,
              backgroundColor: colors.background_theme2,
              paddingVertical: 12,
              borderRadius: 15,
              marginVertical: 20,
            }}>
            <Text
              style={{
                fontSize: 16,
                color: colors.background_theme1,
                fontFamily: fonts.semi_bold,
                textAlign: 'center',
              }}>
              {typeof props.route.params?.data != 'undefined'
                ? 'Update Blog'
                : 'Create Remedies'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Modal
        visible={imageModalVisible}
        transparent={true}
        animationType="slide">
        <View
          style={{
            flex: 1,
            backgroundColor: colors.black_color9 + '80',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              flex: 0,
              width: '90%',
              backgroundColor: colors.black_color2,
              borderRadius: 20,
              paddingHorizontal: 15,
              paddingTop: 15,
              borderWidth: 1,
              borderColor: colors.background_theme2,
            }}>
            <View style={{ flex: 0, flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity style={{ padding: 5 }}>
                <AntDesign name="left" size={22} color={colors.black_color9} />
              </TouchableOpacity>
              <Text
                style={{
                  flex: 0.95,
                  fontSize: 20,
                  color: colors.black_color9,
                  fontFamily: fonts.bold,
                  textAlign: 'center',
                }}>
                Upload Image
              </Text>
            </View>
            <View
              style={{
                flex: 0,
                width: '95%',
                margin: 20,
                alignSelf: 'center',
                backgroundColor: colors.background_theme1,
                marginTop: 60,
                borderRadius: 10,
                shadowColor: colors.black_color5,
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.3,
                shadowRadius: 5,
              }}>
              <View
                style={{ position: 'absolute', top: -40, alignSelf: 'center' }}>
                <Ionicons
                  name="cloud-upload"
                  color={colors.background_theme2}
                  size={80}
                />
              </View>
              <View style={{ marginTop: 50, width: '90%', alignSelf: 'center' }}>
                {actions.map((item, index) => (
                  <TouchableOpacity
                    onPress={() => get_profile_pick(item.type, item.options)}
                    style={{
                      flex: 0,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: colors.background_theme2,
                      marginBottom: 20,
                      padding: 10,
                      borderRadius: 5,
                      shadowColor: colors.black_color3,
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.3,
                      shadowRadius: 5,
                    }}>
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 100,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: colors.background_theme1,
                      }}>
                      <Ionicons
                        name="camera-outline"
                        color={colors.background_theme2}
                        size={30}
                      />
                    </View>
                    <View style={{ flex: 0.8 }}>
                      <Text
                        style={{
                          fontSize: 18,
                          color: colors.background_theme1,
                          fontFamily: fonts.semi_bold,
                        }}>
                        {item.title == 'Camera' ? 'Take Photo' : 'Upload Photo'}
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          color: colors.background_theme1,
                          fontFamily: fonts.medium,
                        }}>
                        Size: 2.5
                      </Text>
                    </View>
                    <AntDesign
                      name="right"
                      color={colors.background_theme1}
                      size={20}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const mapStateToProps = state => ({
  providerData: state.provider.providerData,
});

export default connect(mapStateToProps, null)(CreateRemedies);
