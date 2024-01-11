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
  api_astro_call_to_astrologer,
  api_callintake,
  api_callintakesubmit,
  api_getastrochatstatus,
  api_url,
  base_url,
  call_app_id,
  call_app_sign,
  colors,
  fonts,
  kundli_get_kundli,
  user_chat_in,
} from '../../config/Constants';
import { Picker, PickerIOS } from '@react-native-picker/picker';
import { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import axios from 'axios';
import { connect } from 'react-redux';
import MyLoader from '../../components/MyLoader';
import database from '@react-native-firebase/database';
import { CommonActions } from '@react-navigation/native';
import ZegoExpressEngine, { ZegoScenario } from 'zego-express-engine-reactnative';
import { ZegoSendCallInvitationButton } from '@zegocloud/zego-uikit-prebuilt-call-rn';
import * as UserActions from '../../redux/actions/CustomerActions';
// import {ZegoSendCallInvitationButton} from '@zegocloud/zego-uikit-prebuilt-call-rn';
import { ZegoSendInvitationButton } from '@zegocloud/zego-uikit-rn';
const { width, height } = Dimensions.get('screen');

const CallIntakeForm = props => {
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
  const [birthPlace, setBirthPlace] = useState('Select birth Place');
  const [maritalPickerVisible, setMaritalPickerVisible] = useState(false);
  const [maritalStatus, setMaritalStatus] = useState('Select Marital');
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [occupation, setOccupation] = useState('');
  const [latLong, setLatLong] = useState(null);
  const [question, setQuestion] = useState('');
  const [kundliId, setKundliId] = useState(null);
  const [isCallable, setIsCallable] = useState(false);
  useEffect(() => {
    props.navigation.setOptions({
      header: () => (
        <MyHeader
          title="Call Intake Form"
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
  }, []);

  const check_status = async () => {
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
          setModalVisible(true);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const on_submit = async () => {
    const kundli = await axios({
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
    });
    setIsLoading(true);
    const details = await axios({
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
        kundli_id: kundli.data.kundli_id,
      }
    });

    const invoice_id = await axios({
      method: 'post',
      url: api_url + api_astro_call_to_astrologer,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        astrologer_id: astroData.id,
        kundli_id: kundliId,
        user_id: props.customerData.id,
      },
    });
    props.dispatch(UserActions.setCallInvoiceId(invoice_id.data));
    return new Promise((resolve, reject) => {
      // Perform your pre-send invitation logic here
      // For example, you can prompt the user for confirmation
      const confirmation = true;
      // If the user confirms, resolve the Promise with true
      if (confirmation) {
        setIsLoading(false)
        resolve(true);
      } else {
        // If the user cancels, resolve the Promise with false
        setIsLoading(false)
        resolve(false);
      }
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
        setIsLoading(false);
        console.log(res.data);
        setKundliId(res.data.kundli_id);
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
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

  const returnTrue = () => {
    return Promise.resolve(true);
  };

  const get_invoice_id = async () => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + api_astro_call_to_astrologer,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        astrologer_id: astroData.id,
        kundli_id: kundliId,
        user_id: props.customerData.id,
      },
    })
      .then(res => {
        setIsLoading(false);
        console.log(res.data);
        props.dispatch(UserActions.setCallInvoiceId(res.data));
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
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
        <ScrollView>
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
              }}
            />
          </View>
          <View style={styles.itemContainer}>
            <Text style={styles.heading}>Gender</Text>
            <Picker
              selectedValue={gender}
              themeVariant="dark"
              onValueChange={(itemValue, itemIndex) => {
                setGender(itemValue);
              }}
              style={{ padding: 0, marginBottom: 30, backgroundColor: colors.black_color1, height: 20 }}>
              <Picker.Item label="Male" value={"Male"} style={{ fontSize: 14 }} />
              <Picker.Item label="Female" value={"Female"} style={{ fontSize: 14 }} />
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
            <DateTimePicker
              value={new Date()}
              mode="date"
              display="compact"
              onChange={handle_date}
            />
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
                  color: colors.black_color,
                  fontFamily: fonts.medium,
                }}>
                {birthPlace}
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={check_status} style={styles.submitButton}>
            <Text
              style={{
                fontSize: 14,
                color: colors.background_theme1,
                fontFamily: fonts.medium,
                textAlign: 'center',
              }}>
              {`Start Call With ${props.route.params.data?.owner_name}`}
            </Text>
          </TouchableOpacity>
          {/* <View style={{ flex: 0, alignSelf: 'center', marginVertical: 10 }}>
            <ZegoSendCallInvitationButton
              icon={null}
              text={`Make a call with ${astroData?.shop_name}`}
              backgroundColor={colors.background_theme2}
              fontSize={16}
              color={colors.white_color}
              width={width * 0.7}
              height={40}
              borderRadius={5}
              invitees={[
                { userID: astroData?.id, userName: astroData?.shop_name },
              ]}
              isVideoCall={false}
              inviteText="Join my video conference"
              style={{ width: '80%' }}
              resourceID={'zego_uikit_call'}
              onWillPressed={on_submit}
            />
          </View> */}
        </ScrollView>
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
                    SUJEET TIWARI
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
      </View>
    </View>
  );
};

const mapStateToProps = state => ({
  customerData: state.customer.customerData,
  firebaseId: state.customer.firebaseId,
});

const mapDispatchToProps = dispatch => ({ dispatch });

export default connect(mapStateToProps, mapDispatchToProps)(CallIntakeForm);

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
