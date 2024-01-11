import { View, Text, StyleSheet, ScrollView } from 'react-native';
import React from 'react';
import { useEffect } from 'react';
import { colors, fonts } from '../../config/Constants';
import { useState } from 'react';

const KundliMoonSign = props => {
  const [planet] = useState(props.route.params.planetData.planets_assoc);
  useEffect(() => {
    props.navigation.setOptions({
      tabBarLabel: 'MOON SIGN',
    });
  }, []);
  return (
    <View style={{ flex: 1, backgroundColor: colors.black_color1 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            flex: 0,
            width: '95%',
            alignSelf: 'center',
            backgroundColor: colors.background_theme1,
            marginVertical: 10,
            borderRadius: 15,
            borderWidth: 1,
            elevation: 4
          }}>
          <View
            style={{
              ...styles.itmeContainer,
              backgroundColor: colors.yellow_color5,
              borderTopLeftRadius: 15,
              borderTopRightRadius: 15,
            }}>
            <Text style={{ ...styles.itemText, color: colors.black_color }}>
              Planet
            </Text>
            <Text style={{ ...styles.itemText, color: colors.black_color }}>
              Degree
            </Text>
          </View>
          {Object.keys(planet).map((item, index) => (
            <View key={index} style={styles.itmeContainer}>
              <Text style={styles.itemText}>{item}</Text>
              <Text style={styles.itemText}>{`${Math.floor(
                planet[item],
              )}° ${Math.floor((planet[item] % 1) * 60)}° ${Math.floor(
                (((planet[item] % 1) * 60) % 1) * 60,
              )}°`}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default KundliMoonSign;

const styles = StyleSheet.create({
  itmeContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  itemText: {
    flex: 0.5,
    fontSize: 14,
    color: colors.black_color8,
    fontFamily: fonts.medium,
    textAlign: 'center',
  },
});
