import {
  View,
  Text,
  Dimensions,
  ScrollView,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert
} from 'react-native';
import React from 'react';
import { useEffect } from 'react';
import { astrologer_enquiry, base_url, colors, fonts } from '../../config/Constants';
import MyStatusBar from '../../components/MyStatusbar';
import { useState } from 'react';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import MyLoader from '../../components/MyLoader';
import axios from 'axios';
import { success_toast } from '../../components/MyToastMessage';

const { width, height } = Dimensions.get('screen');

const VerifiedAstrologer = props => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [currentLocation, setCurrentLocation] = useState('');
  const [language, setLanguage] = useState('');
  const [experties, setExperties] = useState('');
  const [skills, setSkills] = useState('');
  const [experience, setExperience] = useState('');
  const [male, setMale] = useState(true);
  const [female, setFemale] = useState(false);
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    props.navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const emain_validation = () => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(email) === false) {
      return true;
    } else {
      return false;
    }
  };
  const validation = () => {
    var isValid = true
    if (name.length == 0) {
      Alert.alert('Please enter Your name');
      isValid = false;
    } else if (email.length == 0) {
      Alert.alert('Please enter your email');
      isValid = false;
    } else if (emain_validation()) {
      Alert.alert('Please enter correct email address.')
      isValid = false;
    } else if (mobileNumber.length != 10) {
      Alert.alert('Please enter your Mobile NUmber.');
      isValid = false;
    } else if (language.length == 0) {
      Alert.alert('Please enter your Language.');
      isValid = false;
    } else if (experties.length == 0) {
      Alert.alert('Please enter your experties.');
      isValid = false;
    } else if (skills.length == 0) {
      Alert.alert('Please enter your skills.');
      isValid = false;
    } else if (experience.length == 0) {
      Alert.alert('Please enter your experience.');
      isValid = false;
    }
    return isValid
  };

  const handleSubmit = async () => {
    if (validation()) {
      setIsLoading(true);
      await axios({
        method: 'post',
        url: base_url + astrologer_enquiry,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: {
          name: name,
          email: email,
          phone: mobileNumber,
          location: currentLocation,
          language: language,
          expertise: experties,
          skill: skills,
          experience: experience,
          gender: male ? 'Male' : 'Female',
        },
      }).then(res => {
        setIsLoading(false);
        console.log(res.data);
        if (res.data.status == 1) {
          success_toast('Enquiry Submitted Successfully!!');
          props.navigation.goBack();
        }
        else {
          Alert.alert('Message', res.data.Response);
        }
      }).catch(err => {
        setIsLoading(false);
        console.log(err);
      })
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.yellow_color5, paddingTop: 10 }}>
      <MyStatusBar
        backgroundColor={colors.background_theme2}
        barStyle={'light-content'}
      />
      <Text
        style={{
          fontSize: 22,
          marginVertical: height * 0.03,
          textAlign: 'center',
          fontFamily: fonts.semi_bold,
          color: colors.black_color8,
        }}>
        Only for Astrologer
      </Text>
      <MyLoader isVisible={isLoading} />
      <KeyboardAvoidingView
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}>
        <View
          style={{
            flex: 0,
            width: '92%',
            alignSelf: 'center',
            height: height * 0.84,
            backgroundColor: colors.background_theme1,
            borderRadius: 10,
            shadowColor: colors.black_color4,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.3,
          }}>
          <ScrollView>
            <View
              style={{
                flex: 0,
                width: '90%',
                marginVertical: 20,
                alignSelf: 'center',
              }}>
              <Text
                style={{
                  fontSize: 18,
                  textAlign: 'center',
                  color: colors.background_theme2,
                  fontFamily: fonts.medium,
                  marginBottom: 20,
                }}>
                Register for an Astrologer Account
              </Text>
              <TextInput
                placeholder="Full Name"
                placeholderTextColor={colors.black_color6}
                cursorColor={colors.black_color}
                style={styles.textInput}
                onChangeText={setName}
              />
              <TextInput
                placeholder="Email Address"
                placeholderTextColor={colors.black_color6}
                cursorColor={colors.black_color}
                keyboardType="email-address"
                style={styles.textInput}
                onChangeText={setEmail}
              />
              <TextInput
                placeholder="WhatsApp Mobile Number"
                placeholderTextColor={colors.black_color6}
                cursorColor={colors.black_color}
                keyboardType="number-pad"
                style={styles.textInput}
                onChangeText={setMobileNumber}
                maxLength={10}
              />
              <TextInput
                placeholder="Current Location"
                placeholderTextColor={colors.black_color6}
                cursorColor={colors.black_color}
                style={styles.textInput}
                onChangeText={setCurrentLocation}
              />
              <TextInput
                placeholder="Language speak(like Hindi, English, etc)"
                placeholderTextColor={colors.black_color6}
                cursorColor={colors.black_color}
                style={styles.textInput}
                onChangeText={setLanguage}
              />
              <TextInput
                placeholder="Experties:(Like Vastu, Kundali, etc)"
                placeholderTextColor={colors.black_color6}
                cursorColor={colors.black_color}
                style={styles.textInput}
                onChangeText={setExperties}
              />
              <TextInput
                placeholder="Skills:(Love, Marriage, health, etc)"
                placeholderTextColor={colors.black_color6}
                cursorColor={colors.black_color}
                style={styles.textInput}
                onChangeText={setSkills}
              />
              <TextInput
                placeholder="Experience in Year"
                placeholderTextColor={colors.black_color6}
                cursorColor={colors.black_color}
                style={styles.textInput}
                onChangeText={setExperience}
                inputMode='numeric'
                maxLength={2}
              />
              <View
                style={{
                  flex: 0,
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingBottom: 2,
                  paddingHorizontal: 2
                }}>
                <View
                  style={{
                    flex: 0.5,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <BouncyCheckbox
                    size={20}
                    fillColor={colors.background_theme2}
                    unfillColor="#FFFFFF"
                    isChecked={male}
                    disableBuiltInState
                    textStyle={styles.checkBoxText}
                    text="Male"
                    onPress={() => {
                      setMale(true);
                      setFemale(false);
                    }}
                  />
                </View>
                <View
                  style={{
                    flex: 0.5,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <BouncyCheckbox
                    size={20}
                    fillColor={colors.background_theme2}
                    unfillColor="#FFFFFF"
                    isChecked={female}
                    disableBuiltInState
                    text="Female"
                    textStyle={styles.checkBoxText}
                    onPress={() => {
                      setMale(false);
                      setFemale(true);
                    }}
                  />
                </View>
              </View>

              <TouchableOpacity
                onPress={handleSubmit}
                style={{
                  flex: 0,
                  width: '100%',
                  backgroundColor: colors.background_theme2,
                  paddingVertical: 12,
                  borderRadius: 20,
                  shadowColor: colors.black_color3,
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.3,
                  shadowRadius: 10,
                  marginVertical: 15,
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    color: colors.background_theme1,
                    fontFamily: fonts.semi_bold,
                    textAlign: 'center',
                  }}>
                  Submit Request
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default VerifiedAstrologer;

const styles = StyleSheet.create({
  textInput: {
    width: '100%',
    paddingHorizontal: 20,
    backgroundColor: colors.black_color3,
    borderRadius: 1000,
    borderColor: colors.black_color5,
    fontFamily: fonts.medium,
    marginBottom: 15,
  },
  checkBoxText: {
    fontSize: 14,
    color: colors.black_color8,
    fontFamily: fonts.medium,
    textDecorationLine: 'none',
  },
});
