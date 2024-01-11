import { View, Text } from 'react-native'
import React from 'react'
import { useEffect } from 'react';
import MyHeader from '../../components/MyHeader';
import { colors } from '../../config/Constants';

const AllRemedies = (props) => {
  useEffect(() => {
    props.navigation.setOptions({
      header: () => (
        <MyHeader
          title="All Remedies"
          navigation={props.navigation}
          statusBar={{
            backgroundColor: colors.background_theme2,
            barStyle: 'light-content',
          }}
        />
      ),
    });
  }, []);
  return (
    <View>
      {/* <Text>AllRemedies</Text> */}
    </View>
  )
}

export default AllRemedies