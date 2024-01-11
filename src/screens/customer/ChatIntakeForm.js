import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import React from 'react';
import { useEffect } from 'react';
import MyHeader from '../../components/MyHeader';
import {
  accept_chat,
  api_callintake,
  api_callintakesubmit,
  api_getastrochatstatus,
  api_url,
  base_url,
  colors,
  fonts,
  kundli_get_kundli,
  user_chat_in,
} from '../../config/Constants';
import DropDownPicker from 'react-native-dropdown-picker';
import { Picker, PickerIOS } from '@react-native-picker/picker';
import { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import axios from 'axios';
import { connect } from 'react-redux';
import MyLoader from '../../components/MyLoader';
import database from '@react-native-firebase/database';
import { CommonActions } from '@react-navigation/native';
import { warnign_toast } from '../../components/MyToastMessage';
const { width, height } = Dimensions.get('screen');

const ChatIntakeForm = props => {
  const [astroData] = useState(props.route.params.data);
  const [isLoading, setIsLoading] = useState(false);
  const [isBirthDetails, setIsBirthDetailes] = useState(true);
  const [isBirthPickerVisible, setBirthPickerVisible] = useState(false);
  const [isGenderPickerVisible, setIsGenderPickerVisible] = useState(false);
  const [gender, setGender] = useState('Male');
  const [isTarotPickerVisible, setIsTarotPickerVisible] = useState(false);
  const [tarot, setTarot] = useState('Select Category');
  const [dateVisible, setDateVisible] = useState(false);
  const [date, setDate] = useState(new Date());
  const [timeVisible, setTimeVisible] = useState(false);
  const [time, setTime] = useState(new Date());
  const [birthPlace, setBirthPlace] = useState(null);
  const [maritalPickerVisible, setMaritalPickerVisible] = useState(false);
  const [maritalStatus, setMaritalStatus] = useState('Select Marital');
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [occupation, setOccupation] = useState('');
  const [question, setQuestion] = useState('');
  const [kundliId, setKundliId] = useState(null);
  const [latLong, setLatLong] = useState(null);
  const [chatId, setChatId] = useState(null);




  console.log(isBirthDetails)
  useEffect(() => {
    props.navigation.setOptions({
      header: () => (
        <MyHeader
          title="Chat Intake Form"
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
    get_form_detailes();
    const interval = setInterval(() => {
      database()
        .ref(`/CurrentRequest/${astroData.id}`)
        .on('value', async snapshot => {
          if (snapshot.val()?.status == 'Accept') {
            await accept_chat_transid();
            clearInterval(interval)
          }
        });
    }, 5000);
    return () => {
      clearInterval(interval);
      database().ref(`/CurrentRequest/${astroData.id}`).off();
    };
  }, [chatId]);

  const go_to_chat = () => {
    database()
      .ref(`/CurrentRequest/${astroData.id}`)
      .on('value', async snapshot => {
        if (snapshot.val()?.status == 'Accept') {
          await accept_chat_transid();
        }
      });
  };

  const check_status = async () => {
    if (validation()) {
      setIsLoading(true);
      await axios({
        method: 'post',
        url: api_url + api_getastrochatstatus,
        data: {
          astro_id: astroData.id,
        },
      })
        .then(res => {
          setIsLoading(false);
          if (res.data.online) {
            get_kundali();
          } else {
            warnign_toast('Astrologer is Busy');
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  const validation = () => {
    if (birthPlace == null) {
      warnign_toast('Please enter your birth place');
      return false;
    } else {
      return true;
    }
  };

  const on_submit = async () => {
    if (validation()) {
      setModalVisible(false);
      setIsLoading(true);
      await axios({
        method: 'post',
        url: api_url + api_callintakesubmit,

        data: {
          user_id: props.customerData.id,
          firstname: name,
          lastname: '',
          countrycode: '+91',
          phone: phoneNumber,
          email: '',
          gender: gender,
          astro_id: astroData.id,
          chat_call: '1',
          dob: moment(date).format('DD-MM-YYYY'),
          tob: moment(time).format('HH:MM:SS'),
          city: 'New Delhi',
          state: '',
          country: 'New Delhi',
          marital: maritalStatus,
          occupation: occupation,
          topic: '',
          question: question,
          dob_current: 'yes',
          partner_name: '',
          partner_dob: '',
          partner_tob: '',
          partner_city: '',
          partner_state: '',
          partner_country: '',
          kundli_id: kundliId,

        }
      }
      )
        .then(res => {
          console.log(res.data, 'data hhhhh')
          setIsLoading(false);
          update_kundli_in_firebase();
          request_to_astrologer();
          current_request_for_chat();
          database()
            .ref(`UserId/${astroData.id}`)
            .on('value', snapshot => {
              const userMessage = database()
                .ref(`/Messages/${props.firebaseId}/${snapshot.val()}`)
                .push();
              const messageId = userMessage.key;
              const notificationRef = database().ref(
                `/Notifications/${snapshot.val()}`,
              );
              const notificationId = notificationRef.key;
              database().ref(`/Notifications/${notificationId}`).set({
                from: props.firebaseId,
                type: 'message',
              });
            });
          add_message();
          send_request();
        })
        .catch(err => {
          console.log(err, 'Errrrrrrrrr');
          setIsLoading(false);
        });

    }
  };

  const accept_chat_transid = async () => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + accept_chat,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        user_id: props.customerData.id,
        astro_id: astroData.id,
      },
    })
      .then(res => {
        setIsLoading(false);
        console.log(res.data)
        props.navigation.dispatch(
          CommonActions.reset({
            index: 3,
            routes: [
              {
                name: 'chatPickup',
                params: {
                  astro_id: astroData.id,
                  trans_id: res.data.result.transid,
                  chat_id: chatId
                },
              },
            ],
          }),
        );
        console.log(res.data);
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const update_kundli_in_firebase = () => {
    console.log(kundliId, 'kundliId');
    let id = `Uid=${props.customerData.id}Astroid=${astroData.id}`;
    console.log(id, 'chatid');
    database().ref(`KundaliID/${id}`).set(kundliId);
  };

  const send_request = async () => {
    setIsLoading(true);
    await axios({
      method: 'get',
      url: `https://akshyagyan.patialamart.com/user/chat_in.php?u_id=${props.customerData.id
        }&a_id=${astroData.id}&form_id=2&in_id=${moment(new Date()).format(
          'DD-MM-YYYY HH:MM:ss',
        )}&message=Chat in time`,
    })
      .then(res => {
        console.log(res.data, 'ranjeet console');
        setChatId(res.data.chat_id)
        setIsLoading(false);
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const add_message = () => {
    let message =
      'Name = ' +
      props.customerData.username +
      '\nDOB = ' +
      '12-23-12' +
      '\nCity = ' +
      'New Delhi' +
      '\nlatitude = ' +
      '28.4945984335' +
      '\nlongitude = ' +
      '26.454545434' +
      '\nCountry = ' +
      'India' +
      '\nOccupation = ' +
      'Job' +
      '\nTarot Category = ' +
      '' +
      '\nTopic of concern = ' +
      'no';
    database()
      .ref(`/UserId/${astroData.id}`)
      .on('value', snapshot => {
        const node = database().ref(`/UserId/${astroData.id}`).push();
        const key = node.key;
        database()
          .ref(`/Messages/${props.firebaseId}/${snapshot.val()}/${key}`)
          .set({
            from: props.firebaseId,
            image: 'image = null',
            message: message,
            timestamp: new Date().getTime(),
            to: snapshot.val(),
            type: 'text',
          });
        database()
          .ref(`/Messages/${snapshot.val()}/${props.firebaseId}/${key}`)
          .set({
            from: props.firebaseId,
            image: 'image = null',
            message: message,
            timestamp: new Date().getTime(),
            to: snapshot.val(),
            type: 'text',
          });
        // database()
        //   .ref(`/Chat/${props.firebaseId}/${snapshot.val()}`)
        //   .update(send_msg);
        // database()
        //   .ref(`/Chat/${snapshot.val()}/${props.firebaseId}`)
        //   .update(send_msg);
      });
  };

  const get_form_detailes = async () => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + api_callintake,
      data: {
        user_id: props.customerData.id,
      },
    })
      .then(res => {
        console.log(res.data)
        setIsLoading(false);
        let data = res.data.records[0];
        if (typeof res.data.records[0]?.id != 'undefined') {
          setName(data.firstname);
          setPhoneNumber(data.phone);
          setGender(data.gender);
          if (data.dob) {
            setDate(moment(data.dob, 'DD-MM-YYYY'));
          }
          if (data.tob) {
            // setTime(moment(data.tob, 'hh:mm:ss'));
          }
          setBirthPlace(data.place_birth);
          setMaritalStatus(data.marital);
          setOccupation(data.occupation);
        }
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const get_kundali = async () => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + kundli_get_kundli,
      data: {
        user_id: props.customerData.id,
        customer_name: name,
        date_of_birth: date,
        gender: gender,
        time_of_birth: time,
        lat: 28.34343454,
        lon: 23.64343445,
        address: birthPlace,
        timezone: +5.5,
      },
    })
      .then(res => {
        console.log('kundli id', res.data);
        setIsLoading(false);
        setKundliId(res.data.kundli_id);
        setModalVisible(true);
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const send_notification = () => {
    database()
      .ref(`/UserId/${317}`)
      .on('value', snapshot => {
        const notificationRef = database()
          .ref(`/Notifications/${snapshot.val()}`)
          .push();
        const notificationId = notificationRef.key;
        database()
          .ref(`/Notifications/${snapshot.val()}/${notificationId}`)
          .set({
            from: props.firebaseId,
            type: 'message',
          });
      });
  };

  const request_to_astrologer = () => {
    console.log('senddddddddd')
    const astrologerData = {
      date: moment(new Date()).format('DD-MM-YYYY HH:MM:ss '),
      msg: `Request send to ${astroData.owner_name}`,
      name: astroData.owner_name,
      pic: astroData.image,
      rid: astroData.id,
      status: '',
      timestamp: new Date().getTime(),
    };

    const customerData = {
      date: moment(new Date()).format('DD-MM-YYYY HH:MM:ss '),
      msg: `message`,
      name: name,
      pic: 'url',
      rid: props.customerData.id,
      // sid: props.customerData.id,
      status: 'Pending',
      timestamp: new Date().getTime(),
    };

    const customerNodeRef = database().ref(
      `/Request/${astroData.id}/${props.customerData.id}`,
    );
    const astrologerNodeRef = database().ref(
      `/Request/${props.customerData.id}/${astroData.id}`,
    );
    customerNodeRef.update(customerData);
    astrologerNodeRef.update(astrologerData);
  };

  const current_request_for_chat = () => {
    console.log('astrologerData')
    const astrologerData = {
      date: moment(new Date()).format('DD-MM-YYYY HH:MM:ss '),
      msg: `Request send to ${astroData.owner_name}`,
      name: astroData.owner_name,
      pic: astroData.image,
      rid: astroData.id,
      sid: props.customerData.id,
      status: 'Pending',
      timestamp: new Date().getTime(),
    };
    const nodeRef = database().ref(`/CurrentRequest/${astroData.id}`);
    nodeRef.update(astrologerData);
  };

  const handle_date = (event, selectedDate) => {
    setDate(selectedDate);
    setDateVisible(false);
  };

  const handle_time = (event, selectedTime) => {
    setTime(selectedTime);
    setTimeVisible(false);
  };

  const set_place_of_birth = text => {
    setBirthPlace(text);
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.black_color1,
        justifyContent: 'center',
      }}>
      <MyLoader isVisible={isLoading} />
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.itemContainer}>
            <Text style={styles.heading}>
              Do you have correct birth details?
            </Text>
            <Picker
              selectedValue={isBirthDetails}
              themeVariant="dark"
              onValueChange={(itemValue, itemIndex) => {
                setIsBirthDetailes(itemValue);
              }}
              style={{ padding: 0, marginBottom: 30, backgroundColor: colors.black_color1, height: 20 }}>
              <Picker.Item label="Yes" value={true} style={{ fontSize: 14 }} />
              <Picker.Item label="No" value={false} style={{ fontSize: 14 }} />
            </Picker>
          </View>
          <View style={styles.itemContainer}>
            <Text style={styles.heading}>Name</Text>
            <TextInput
              placeholder="Enter your name"
              placeholderTextColor={colors.black_color8}
              onChangeText={setName}
              style={{
                padding: 10,
                backgroundColor: colors.black_color1,
                marginTop: 10,
                borderRadius: 5,
              }}>
              {name}
            </TextInput>
          </View>
          <View style={styles.itemContainer}>
            <Text style={styles.heading}>Phone Number</Text>
            <TextInput
              placeholder="Enter your phone number"
              placeholderTextColor={colors.black_color8}
              keyboardType="number-pad"
              style={{
                padding: 10,
                backgroundColor: colors.black_color1,
                marginTop: 10,
                borderRadius: 5,
              }}>
              {phoneNumber}
            </TextInput>
          </View>
          <View style={styles.itemContainer}>
            <Text style={styles.heading}>Gender</Text>
            <Picker
              selectedValue={gender}
              themeVariant="dark"
              onValueChange={(itemValue, itemIndex) => {
                setGender(itemValue);
                setIsGenderPickerVisible(false);
              }}
              style={{ padding: 0, marginBottom: 30, backgroundColor: colors.black_color1, height: 20 }}>
              <Picker.Item label="Male" value="Male" style={{ fontSize: 14 }} />
              <Picker.Item label="Female" value="Female" style={{ fontSize: 14 }} />
            </Picker>
          </View>
          <View style={styles.itemRowContainer}>
            <View style={{ flex: 0.5, marginBottom: 15 }}>
              <Text
                style={{
                  fontSize: 14,
                  color: colors.black_color8,
                  fontFamily: fonts.medium,
                }}>
                Date of Birth
              </Text>
              <TouchableOpacity
                onPress={() => setDateVisible(true)}
                style={{
                  flex: 0,
                  width: '90%',
                  padding: 10,
                  backgroundColor: colors.black_color1,
                  borderRadius: 5,
                  marginTop: 10,
                }}>
                <Text>{moment(date).format('DD-MM-YYYY')}</Text>
              </TouchableOpacity>
            </View>

            <View style={{ flex: 0.5, marginBottom: 15 }}>
              <Text
                style={{
                  fontSize: 14,
                  color: colors.black_color8,
                  fontFamily: fonts.medium,
                }}>
                Date of Time
              </Text>
              <TouchableOpacity
                onPress={() => setTimeVisible(true)}
                style={{
                  flex: 0,
                  width: '90%',
                  padding: 10,
                  backgroundColor: colors.black_color1,
                  borderRadius: 5,
                  marginTop: 10,
                }}>
                <Text>{moment(time).format('LT')}</Text>
              </TouchableOpacity>
            </View>
          </View>
          {dateVisible && (
            <DateTimePicker value={date} mode="date" onChange={handle_date} />
          )}
          {timeVisible && (
            <DateTimePicker
              value={time}
              mode="time"
              display="compact"
              onChange={handle_time}
            />
          )}
          <View style={styles.itemContainer}>
            <Text style={styles.heading}>Place of Birth</Text>
            <TouchableOpacity
              onPress={() =>
                props.navigation.navigate('placeOfBirth', {
                  set_place_of_birth: set_place_of_birth,
                  set_lat_long: setLatLong,
                })
              }
              style={styles.pickerButton}>
              <Text
                style={{
                  fontSize: 14,
                  color: colors.black_color7,
                  fontFamily: fonts.medium,
                }}>
                {birthPlace == '' ? 'Select Birth Place' : birthPlace}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.itemRowContainer, { marginBottom: 10 }]}>
            <View style={{ flex: 0.5, marginBottom: 15 }}>
              <Text
                style={{
                  fontSize: 14,
                  color: colors.black_color8,
                  fontFamily: fonts.medium,
                }}>
                Current Location
              </Text>
              <TextInput style={{
                flex: 0,
                width: '90%',
                padding: 10,
                backgroundColor: colors.black_color1,
                borderRadius: 5,
                marginTop: 10,
              }}
                placeholder="Input State Name" />
            </View>
            <View style={{ flex: 0.5, marginBottom: 15 }}>
              <Text
                style={{
                  fontSize: 14,
                  color: colors.black_color8,
                  fontFamily: fonts.medium,
                }}>
                {' '}
              </Text>
              <TextInput style={{
                flex: 0,
                width: '100%',
                padding: 10,
                backgroundColor: colors.black_color1,
                borderRadius: 5,
                marginTop: 10,
              }}
                placeholder="Input City Name" />
            </View>
          </View>
          <View style={styles.itemRowContainer} >
            <View style={{ flex: 1, marginBottom: 15 }}>
              <Text
                style={{
                  fontSize: 14,
                  color: colors.black_color8,
                  fontFamily: fonts.medium,
                }}>
                Marital Status
              </Text>
              <Picker
                selectedValue={maritalStatus}
                themeVariant="dark"
                onValueChange={(itemValue, itemIndex) => {
                  setMaritalStatus(itemValue)
                }}
                style={{ padding: 0, marginBottom: 10, backgroundColor: colors.black_color1, height: 20 }}>
                <Picker.Item label="Married" value="Married" style={{ fontSize: 14 }} />
                <Picker.Item label="Unmarried" value="Unmarried" style={{ fontSize: 14 }} />
              </Picker>
              <View style={{ flex: 1, marginBottom: 15 }}>
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.black_color8,
                    fontFamily: fonts.medium,
                  }}>
                  Occupation
                </Text>
                <TextInput style={{
                  flex: 0,
                  width: '100%',
                  padding: 10,
                  backgroundColor: colors.black_color1,
                  borderRadius: 5,
                  marginTop: 10,
                }}
                  placeholder="Input Occupation" />
              </View>
            </View>


          </View>
          <View style={styles.itemContainer}>
            <Text style={styles.heading}>Purpose/Query</Text>
            <TextInput
              placeholder="Type your purpose/Query"
              placeholderTextColor={colors.black_color8}
              multiline
              scrollEnabled
              numberOfLines={10}
              style={{
                padding: 10,
                backgroundColor: colors.black_color1,
                marginTop: 10,
                borderRadius: 5,
                height: 150,
                color: colors.black_color,
              }}
            />
          </View>
          <TouchableOpacity onPress={check_status} style={styles.submitButton}>
            <Text
              style={{
                fontSize: 14,
                color: colors.background_theme1,
                fontFamily: fonts.medium,
                textAlign: 'center',
              }}>
              {`Start Chat With ${props.route.params.data?.owner_name}`}
            </Text>
          </TouchableOpacity>
          <Modal
            visible={modalVisible}
            transparent={true}
            onRequestClose={() => setModalVisible(false)}>
            <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
              <View
                style={{
                  flex: 1,
                  backgroundColor: '#00000050',
                  justifyContent: 'center',
                  alignItems: 'center',
                  // opacity: 0.4
                }}>
                <View
                  style={{
                    flex: 0,
                    width: '90%',
                    alignSelf: 'center',
                    backgroundColor: colors.background_theme1,
                  }}>
                  <Text
                    style={{
                      fontSize: 18,
                      color: colors.black_color,
                      fontFamily: fonts.semi_bold,
                      textAlign: 'center',
                      padding: 15,
                    }}>
                    Astrologer can talk in these languages
                  </Text>
                  <View
                    style={{
                      flex: 0,
                      height: 1,
                      marginBottom: 15,
                      marginTop: 1,
                      backgroundColor: colors.yellow_color1,
                    }}
                  />
                  <View style={{ flex: 0, padding: 15 }}>
                    <Text
                      style={{
                        fontSize: 18,
                        fontFamily: fonts.bold,
                        color: colors.black_color,
                        textAlign: 'center',
                      }}>
                      {astroData?.owner_name}
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        color: colors.black_color8,
                        fontFamily: fonts.medium,
                        textAlign: 'center',
                        marginVertical: 5,
                      }}>
                      English, Bengali
                    </Text>
                    <TouchableOpacity
                      onPress={on_submit}
                      style={{
                        flex: 0,
                        width: '100%',
                        alignSelf: 'center',
                        paddingVertical: 15,
                        borderRadius: 15,
                        backgroundColor: colors.background_theme2,
                        marginVertical: 10,
                      }}>
                      <Text
                        style={{
                          fontSize: 16,
                          color: colors.background_theme1,
                          fontFamily: fonts.bold,
                          textAlign: 'center',
                        }}>
                        Start
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </ScrollView>
      </View >
    </View >
  );
};

const mapStateToProps = state => ({
  customerData: state.customer.customerData,
  firebaseId: state.customer.firebaseId,
});

export default connect(mapStateToProps, null)(ChatIntakeForm);

const styles = StyleSheet.create({
  container: {
    width: width * 0.92,
    height: height * 0.85,
    backgroundColor: colors.background_theme1,
    alignSelf: 'center',
    shadowColor: colors.black_color7,
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  itemContainer: {
    flex: 0,
    marginBottom: 15,
  },
  itemRowContainer: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  heading: {
    fontSize: 14,
    color: colors.black_color8,
    fontFamily: fonts.medium,
  },
  pickerButton: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: colors.black_color1,
    borderRadius: 5,
    marginTop: 10,
  },
  submitButton: {
    flex: 0,
    width: '100%',
    alignSelf: 'center',
    backgroundColor: colors.background_theme2,
    paddingVertical: 15,
    borderRadius: 15,
    shadowColor: colors.black_color8,
    marginVertical: 10,
  },
});
