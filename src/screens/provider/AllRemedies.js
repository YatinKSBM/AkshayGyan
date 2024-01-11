import {
  View,
  Text,
  FlatList,
  Dimensions,
  Image,
  TouchableOpacity,
  Switch,
  Alert,
  TouchableWithoutFeedback,
} from 'react-native';
import React from 'react';
import { useEffect } from 'react';
import { api_url, colors, delete_blog, fonts, get_blogs, toggle_blog } from '../../config/Constants';
import { Picker, PickerIOS } from '@react-native-picker/picker';
import Entypo from 'react-native-vector-icons/Entypo';
import { useState } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { success_toast } from '../../components/MyToastMessage';
import MyLoader from '../../components/MyLoader';
// import { Switch } from 'react-native-switch';

const { width, height } = Dimensions.get('screen');

const AllRemedies = props => {
  const [editOpen, setEditOpen] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [remediesData, setRemediesData] = useState(null);
  useEffect(() => {
    props.navigation.setOptions({
      tabBarLabel: 'ALL REMEDIES',
    });
  }, []);

  useEffect(() => {
    props.navigation.addListener('focus', () => {
      get_remedies();
    })

  }, []);

  const get_remedies = async () => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + get_blogs,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        astro_id: props.providerData.id,
      },
    })
      .then(res => {
        setIsLoading(false);
        console.log(res.data);
        if (res.data.status) {
          setRemediesData(res.data.blogs);
        }
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const delete_my_blog = async (blog_id) => {
    setIsLoading(true)
    await axios({
      method: 'post',
      url: api_url + delete_blog,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        blog_id: blog_id
      }
    }).then(res => {
      console.log(res.data)
      setIsLoading(false)
      success_toast('Successfully deleted.');
      get_remedies();
    }).catch(err => {
      setIsLoading(false)
      console.log(err)
    })
  }

  const change_status = async (blog_id) => {
    setIsLoading(true)
    await axios({
      method: 'post',
      url: api_url + toggle_blog,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        blog_id: blog_id
      }
    }).then(res => {
      console.log(res.data)
      setIsLoading(false)
      get_remedies();
    }).catch(err => {
      setIsLoading(false)
      console.log(err)
    })
  }


  // const renderItem = ({ item, indes }) => {

  //   return (
  //     <View
  //       style={{
  //         flex: 0,
  //         flexDirection: 'row',
  //         backgroundColor: colors.background_theme1,
  //         marginBottom: 10,
  //         elevation: 5,
  //         borderRadius: 10,
  //         // overflow: 'hidden',
  //       }}>
  //       <Image
  //         source={{ uri: item.image }}
  //         style={{
  //           width: 40,
  //           height: 40,
  //           resizeMode: 'contain',
  //         }}
  //       />
  //       <View style={{ flex: 1 }}>
  //         <View
  //           style={{
  //             flex: 1,
  //             flexDirection: 'row',

  //             justifyContent: 'space-between',
  //             alignItems: 'center'
  //           }}>
  //           <View style={{ padding: 10 }}>
  //             <Text
  //               style={{
  //                 fontSize: 16,
  //                 color: colors.black_color9,
  //                 fontFamily: fonts.medium,
  //               }}>
  //               {item.title}
  //             </Text>
  //             <Text
  //               style={{
  //                 fontSize: 14,
  //                 color: colors.black_color7,
  //                 fontFamily: fonts.medium,
  //               }}>
  //               {item.description}
  //             </Text>
  //           </View>
  //           <TouchableOpacity
  //             onPress={() => setEditOpen(item.blog_id)}
  //             style={{ padding: 10 }}>
  //             <Image source={require('../../assets/images/3dot.png')}
  //               style={{ height: 20, width: 20 }} resizeMode='contain' />
  //           </TouchableOpacity>
  //           {editOpen == item.blog_id && (

  //             <View
  //               style={{
  //                 backgroundColor: colors.background_theme1,
  //                 position: 'absolute',
  //                 padding: 5,
  //                 zIndex: 999,
  //                 top: '30%',
  //                 right: '10%',
  //                 borderRadius: 10,
  //                 elevation: 3,
  //                 overflow: 'hidden'
  //               }}>
  //               <TouchableOpacity onPress={() => handleSelectEdit(item)}>
  //                 <Text style={{ fontSize: 14, padding: 10 }} >Edit</Text>
  //               </TouchableOpacity>

  //               <View style={{ backgroundColor: colors.gray, height: 1 }}></View>
  //               <TouchableOpacity onPress={() => handleSelectDelete(item)}>
  //                 <Text style={{ fontSize: 14, padding: 10 }} >Delete</Text>
  //               </TouchableOpacity >

  //             </View>
  //             // <Picker
  //             //   selectedValue={'edit'}
  //             //   mode="list"
  //             //   selectionColor={colors.background_theme2}
  //             //   itemStyle={{
  //             //     color: colors.black_color8,
  //             //     fontFamily: fonts.medium,
  //             //     fontSize: 14,
  //             //   }}
  //             //   onValueChange={(itemValue, itemIndex) => {
  //             //     setEditOpen(null);
  //             //     if (itemValue == 'delete') {
  //             //       Alert.alert('Delete', 'Really want to delete Blog ?', [
  //             //         {
  //             //           text: 'Delete',
  //             //           style: 'cancel',
  //             //           onPress: () => delete_my_blog(item.blog_id),
  //             //         },
  //             //         {
  //             //           text: 'No',
  //             //           style: 'destructive',
  //             //           onPress: () => console.log('no'),
  //             //         },
  //             //       ]);
  //             //     } else {
  //             //       props.navigation.navigate('createRemedies', {
  //             //         data: item,
  //             //       });
  //             //     }
  //             //     //   searchFilterFunctionByFilter(itemValue);
  //             //   }}
  //             //   style={{
  //             //     width: '50%',
  //             //     position: 'absolute',
  //             //     top: 1,
  //             //     backgroundColor: colors.background_theme3,
  //             //     shadowColor: colors.black_color3,
  //             //     shadowOffset: { width: 1, height: 1 },
  //             //     shadowOpacity: 0.3,
  //             //     right: 0,
  //             //     zIndex: 99,
  //             //   }}>
  //             //   <Picker.Item key={'1'} label={'Edit'} value={'edit'} />
  //             //   <Picker.Item key={'2'} label={'Delete'} value={'delete'} />
  //             // </Picker>
  //           )}
  //         </View>
  //         {/* <View
  //           style={{
  //             flex: 0,
  //             width: '50%',
  //             flexDirection: 'row',
  //             justifyContent: 'space-between',
  //             alignItems: 'center',
  //             backgroundColor: colors.background_theme2,
  //             alignSelf: 'flex-end',
  //             margin: 5,
  //             borderRadius: 5,
  //             paddingHorizontal: 10,
  //             paddingVertical: 4,
  //             zIndex: -1,
  //           }}>
  //           <Text
  //             style={{
  //               fontSize: 12,
  //               color: colors.background_theme1,
  //               fontFamily: fonts.medium,
  //               marginRight: 5,
  //             }}>
  //             {item.status == '1' ? 'Active' : 'Inactive'}
  //           </Text>
  //           <Switch
  //             value={item.status == '1'}
  //             trackColor={{
  //               false: colors.black_color5,
  //               true: colors.green_color2,
  //             }}
  //             onValueChange={() => {
  //               change_status(item.blog_id)
  //             }}
  //             ios_backgroundColor="#3e3e3e"
  //             style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
  //           />
  //         </View> */}
  //       </View>
  //     </View>
  //   );
  // };

  const renderItem = ({ item, index }) => {
    return (
      <View
        style={{
          flex: 0,
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.background_theme1,
          marginBottom: 10,
          elevation: 5,
          borderRadius: 10,
        }}>
        <Image
          source={require('../../assets/images/logo.png')}
          style={{
            width: 40,
            height: 40,
            resizeMode: 'contain',
            margin: 10,
          }}
        />
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View style={{ padding: 10 }}>
            <Text
              style={{
                fontSize: 16,
                color: colors.black_color9,
                fontFamily: fonts.medium,
              }}>
              {item.title}
            </Text>
            <Text
              style={{
                width: width * 0.6,
                fontSize: 14,
                color: colors.black_color7,
                fontFamily: fonts.medium,
              }}>
              {item.description}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setEditOpen(item.blog_id)}
            style={{ padding: 10 }}>
            <Image
              source={require('../../assets/images/3dot.png')}
              style={{ height: 20, width: 20 }}
              resizeMode='contain'
            />
          </TouchableOpacity>
        </View>
        {editOpen == item.blog_id && (
          <View
            style={{
              backgroundColor: colors.background_theme1,
              position: 'absolute',
              top: 0,
              right: 0,
              padding: 0,
              zIndex: 999,
              borderRadius: 10,
              elevation: 3,
              overflow: 'hidden',
            }}>
            <TouchableOpacity onPress={() => handleSelectEdit(item)}>
              <Text style={{ fontSize: 14, paddingHorizontal: 10, paddingVertical: 8 }}>Edit</Text>
            </TouchableOpacity>
            <View style={{ backgroundColor: colors.gray, height: 1 }}></View>
            <TouchableOpacity onPress={() => handleSelectDelete(item)}>
              <Text style={{ fontSize: 14, paddingHorizontal: 10, paddingVertical: 8 }}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };


  function handleSelectEdit(item) {
    props.navigation.navigate('createRemedies', {
      data: item,
    });
  }

  function handleSelectDelete(item) {
    setEditOpen(null);
    Alert.alert('Delete', 'Really want to delete Blog ?', [
      {
        text: 'Delete',
        style: 'cancel',
        onPress: () => delete_my_blog(item.blog_id),
      },
      {
        text: 'No',
        style: 'destructive',
        onPress: () => console.log('no'),
      },
    ]);

  }
  return (
    <TouchableWithoutFeedback onPress={() => setEditOpen(false)}>
      <View style={{ flex: 1, backgroundColor: colors.background_theme1, }}>
        <MyLoader isVisible={isLoading} />
        {remediesData && (
          <FlatList
            data={remediesData}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 100, paddingTop: 10, paddingHorizontal: 10 }}

          />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const mapStateToProps = state => ({
  providerData: state.provider.providerData,
});

export default connect(mapStateToProps, null)(AllRemedies);
