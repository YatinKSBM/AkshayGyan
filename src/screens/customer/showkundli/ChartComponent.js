import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image
} from 'react-native';
import React from 'react';
import { colors, fonts } from '../../../config/Constants';
import { SvgCssUri, SvgUri } from 'react-native-svg';
import { useState } from 'react';
import MyLoader from '../../../components/MyLoader';
import SvgSimmer from '../../../components/SvgSimmer';

const { width, height } = Dimensions.get('screen');

const ChartComponent = ({ svg, title, planetData }) => {
  const [planet] = useState(planetData.planets_assoc);
  const [nakshatra] = useState(planetData.planets_details);
  const [isPlanet, setIsPlanet] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const onError = () => {
    setIsLoading(false);
  };
  const onLoad = () => {
    console.log('Svg loaded!');
    setIsLoading(false);
  };
  return (
    <View style={{ flex: 1, backgroundColor: colors.black_color1 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ width: '95%', alignSelf: 'center', paddingVertical: 15 }}>
          <Text
            style={{
              fontSize: 16,
              color: colors.black_color8,
              fontFamily: fonts.medium,
            }}>
            {title} Chart
          </Text>
          {isLoading && <SvgSimmer isLoading={false} />}
          <SvgCssUri
            onError={onError}
            uri={svg}
            width={width}
            height={width}
            onLoad={onLoad}
          />
        </View>
        <View style={{ width: '95%', alignSelf: 'center', paddingVertical: 15 }}>
          <Text
            style={{
              fontSize: 16,
              color: colors.black_color8,
              fontFamily: fonts.medium,
            }}>
            Planets
          </Text>
          <View
            style={{
              flex: 0,
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: 15,
            }}>
            <TouchableOpacity
              onPress={() => setIsPlanet(true)}
              style={{
                flex: 0,
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 15,
                paddingVertical: 10,
                borderRadius: 1000,
                backgroundColor: isPlanet
                  ? colors.background_theme4
                  : colors.black_color4,
                marginRight: 10,
              }}>
              <Text
                style={{
                  fontSize: 14,
                  color: isPlanet
                    ? colors.background_theme1
                    : colors.black_color7,
                  fontFamily: fonts.medium,
                }}>
                MOON SIGN
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setIsPlanet(false)}
              style={{
                flex: 0,
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 15,
                paddingVertical: 10,
                borderRadius: 1000,
                backgroundColor: !isPlanet
                  ? colors.background_theme4
                  : colors.black_color4,
              }}>
              <Text
                style={{
                  fontSize: 14,
                  color: isPlanet
                    ? colors.black_color7
                    : colors.background_theme1,
                  fontFamily: fonts.medium,
                }}>
                NAKSHATRA
              </Text>
            </TouchableOpacity>
          </View>
          {isPlanet ? (
            <View
              style={{
                flex: 0,
                borderWidth: 1,
                borderRadius: 15,
                borderColor: colors.black_color7,
              }}>
              <View
                style={{
                  ...styles.rowContainer,
                  borderTopLeftRadius: 15,
                  borderTopRightRadius: 15,
                  backgroundColor: colors.yellow_color5,
                }}>
                <Text style={styles.rowText}>Planet</Text>
                <Text style={styles.rowText}>Degree</Text>
              </View>
              {Object.keys(planet).map((item, index) => (
                <View
                  key={index}
                  style={{
                    ...styles.rowContainer,
                    borderBottomLeftRadius:
                      Object.keys(planet).length == index + 1 ? 15 : 0,
                    borderBottomRightRadius:
                      Object.keys(planet).length == index + 1 ? 15 : 0,
                  }}>
                  <Text style={styles.rowText}>{item}</Text>
                  <Text style={styles.rowText}>{`${Math.floor(
                    planet[item],
                  )}° ${Math.floor((planet[item] % 1) * 60)}° ${Math.floor(
                    (((planet[item] % 1) * 60) % 1) * 60,
                  )}°`}</Text>
                </View>
              ))}
            </View>
          ) : (
            <View
              style={{
                flex: 0,
                borderWidth: 1,
                borderRadius: 15,
                borderColor: colors.black_color7,
              }}>
              <View
                style={{
                  ...styles.rowContainer,
                  borderTopLeftRadius: 15,
                  borderTopRightRadius: 15,
                  backgroundColor: colors.yellow_color5,
                }}>
                <Text style={styles.rowText}>Planet</Text>
                <Text style={styles.rowText}>Nakshatra</Text>
                <Text style={styles.rowText}>Naksh Lord</Text>
              </View>
              {Object.keys(nakshatra).map((item, index) => (
                <View
                  key={index}
                  style={{
                    ...styles.rowContainer,
                    borderBottomLeftRadius:
                      Object.keys(planet).length == index + 1 ? 15 : 0,
                    borderBottomRightRadius:
                      Object.keys(planet).length == index + 1 ? 15 : 0,
                  }}>
                  <Text style={styles.rowText}>{item}</Text>
                  <Text style={styles.rowText}>
                    {nakshatra[item].nakshatra}
                  </Text>
                  <Text style={styles.rowText}>
                    {nakshatra[item].nakshatralord}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default ChartComponent;

const styles = StyleSheet.create({
  rowContainer: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background_theme1,
  },
  rowText: {
    flex: 0.5,
    textAlign: 'center',
    paddingVertical: 10,
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.black_color9,
    textTransform: 'capitalize',
  },
});
