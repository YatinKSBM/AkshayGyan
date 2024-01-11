import {
  View,
  Text,
  Dimensions,
  ScrollView,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView
} from 'react-native';
import React from 'react';
import { useEffect } from 'react';
import { colors, fonts } from '../../config/Constants';
import MyStatusBar from '../../components/MyStatusbar';
import { useState } from 'react';

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

  useEffect(() => {
    props.navigation.setOptions({
      headerShown: false,
    });
  }, []);
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
              />
              <TouchableOpacity
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
});
