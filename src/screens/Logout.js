import {View, Text, StyleSheet, Platform} from 'react-native';
import React, {useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ProviderActions from '../redux/actions/ProviderActions'
import {connect} from 'react-redux';
import {CommonActions} from '@react-navigation/native';
const Logout = props => {
  useEffect(() => {
    async function Clear() {
      await AsyncStorage.clear();
      props.dispatch(ProviderActions.setCleanStore());
    }
    Clear();
    props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'login',
          },
        ],
      }),
    );
    // props.navigation.navigate('Login', { logoutFlag: 1 })
  }, [props.navigation]);
  return (
    <View style={styles.container}>
      <Text style={{fontSize: 20, color: '#000'}}>Please wait...</Text>
    </View>
  );
};

const mapDispatchToProps = dispatch => ({dispatch});
export default connect(null, mapDispatchToProps)(Logout);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
});
