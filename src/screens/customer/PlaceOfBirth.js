import { View, Text, StyleSheet, Dimensions } from 'react-native';
import React from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { useEffect } from 'react';
import MyHeader from '../../components/MyHeader';
import { colors, google_map_key } from '../../config/Constants';

const { width, height } = Dimensions.get('screen');

const PlaceOfBirth = props => {
  useEffect(() => {
    props.navigation.setOptions({
      header: () => (
        <MyHeader
          title="Place of Birth"
          socialIcons={false}
          navigation={props.navigation}
          statusBar={{
            backgroundColor: colors.background_theme2,
            barStyle: 'light-content',
          }}
        />
      ),
    });
  }, []);

  const handle_selected = (address, lat, lon) => {
    console.log(' props.route.params', props.route.params)
    props.route.params.set_place_of_birth(address)
    props.route.params.set_lat_long({ lat: lat, lon: lon })
    props.navigation.goBack()
  }

  return (
    <View style={{ flex: 1 }}>
      <GooglePlacesAutocomplete
        placeholder="Birth Place"
        fetchDetails={true}
        autoFocus={false}
        minLength={2}
        
        // onPress={handle_selected}
        onPress={(data, details) => {
          console.log('callll')
          handle_selected(data.description, details.geometry?.location?.lat, details.geometry?.location?.lng)
        }}
        query={{
          key: google_map_key,
          language: 'en',
        }}
        currentLocation={true}
        numberOfLines={3}
        isRowScrollable={false}
        currentLocationLabel="Current location"
        enablePoweredByContainer={false}
        styles={styles}
      />
    </View>
  );
};

export default PlaceOfBirth;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black_color1
  },
  textInputContainer: {
    width: width * 0.95,
    marginVertical: 10,
    borderRadius: 10,
    alignSelf: 'center'
  },
  listView: {
    width: width * 0.95,
    alignSelf: 'center'
  },
  row: {
    marginBottom: 10,
    borderRadius: 5,
    shadowColor: colors.black_color6,
    shadowOffset: {
      width: 0,
      height: 1
    },
    // shadowRadius: 4,
    shadowOpacity: 0.2
  },
  separator: {
    height: 0,
  },

});
