/**
 * @format
 */

import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './App';
import React from 'react';
import {Provider} from 'react-redux';
import {name as appName} from './app.json';
import {store} from './src/redux/store/store'

const RNRedux = () => {
    return (
      <Provider store={store}>
        <App />
      </Provider>
    );
  };


AppRegistry.registerComponent(appName, () => RNRedux);
