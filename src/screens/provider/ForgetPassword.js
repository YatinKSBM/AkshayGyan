import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import MyStatusBar from '../../components/MyStatusbar'
import { colors, fonts } from '../../config/Constants'

const ForgetPassword = (props) => {
  useEffect(() => {
    props.navigation.setOptions({
      headerShown: false
    })
  }, [])

  return (
    <View style={{ flex: 1, backgroundColor: colors.background_theme1 }}>
      <MyStatusBar backgroundColor={colors.background_theme2} barStyle='light-content' />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ flex: 0, width: '80%', justifyContent: 'center', alignItems: 'center', padding: 20, borderRadius: 20, backgroundColor: colors.yellow_color1 }}>
          <Text style={{ fontSize: 16, color: colors.black_color10, fontFamily: fonts.bold, textAlign: 'center' }}>Please Call</Text>

          <Text style={{ fontSize: 18, color: colors.background_theme2, fontFamily: fonts.bold, textAlign: 'center' }}>AkshyaGyaan Admin Team </Text>
          <Text style={{ fontSize: 16, color: colors.black_color10, fontFamily: fonts.bold, textAlign: 'center' }}>to reset your password.</Text>

        </View>
      </View>
    </View>
  )
}

export default ForgetPassword