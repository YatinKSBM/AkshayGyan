/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useRef, useState } from 'react';
import { StyleSheet, Alert, DeviceEventEmitter, Platform } from 'react-native';

import {
  CommonActions,
  NavigationContainer,
  useNavigation,
} from '@react-navigation/native';
import StackNavigator from './src/navigations/StackNavigator';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from "react-native-push-notification";
import messaging from '@react-native-firebase/messaging';
import { useEffect } from 'react';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import { ZegoCallInvitationDialog } from '@zegocloud/zego-uikit-prebuilt-call-rn';
import { colors } from './src/config/Constants';
import { connect } from 'react-redux';
import { NotificationManagerAndroid } from './NotificationManager';
import {
  ZegoUIKitPrebuiltLiveStreamingFloatingMinimizedView,
} from '@zegocloud/zego-uikit-prebuilt-live-streaming-rn';

const App = () => {

  const toastConfig = {
    success: props => (
      <BaseToast
        text1NumberOfLines={1}
        text2NumberOfLines={2}
        {...props}
        style={{ borderLeftColor: colors.green_color1 }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          fontSize: 14,
          fontWeight: '400',
        }}
        text2Style={{
          fontSize: 12,
        }}
      />
    ),
    error: (props) => (
      <ErrorToast
        text1NumberOfLines={1}
        text2NumberOfLines={2}
        {...props}
        text1Style={{
          fontSize: 14,
        }}
        text2Style={{
          fontSize: 12,
        }}
      />
    ),
    tomatoToast: ({ text1, props }) => (
      <View
        style={{ height: 60, width: '100%', backgroundColor: 'tomato' }}
      >
        <Text>{text1}</Text>
        <Text>{props.uuid}</Text>
      </View>
    ),
  };

  const register = () => {
    PushNotificationIOS.addEventListener('register', onRegistered);
    PushNotificationIOS.addEventListener(
      'registrationError',
      onRegistrationError,
    );
    PushNotificationIOS.addEventListener('notification', onRemoteNotification);
    PushNotificationIOS.addEventListener(
      'localNotification',
      onLocalNotification,
    );

    PushNotificationIOS.requestPermissions({
      alert: true,
      badge: true,
      sound: true,
      critical: true,
    }).then(
      data => {
        console.log('PushNotificationIOS.requestPermissions', data);
      },
      data => {
        console.log('PushNotificationIOS.requestPermissions failed', data);
      },
    );
  };

  const android_register = () => {
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) {
        console.log("TOKEN:", token);
      },

      // (required) Called when a remote is received or opened, or local notification is opened
      onNotification: function (notification) {
        console.log("NOTIFICATION:", notification);

        // process the notification

        // (required) Called when a remote is received or opened, or local notification is opened
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },

      // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
      onAction: function (notification) {
        console.log("ACTION:", notification.action);
        console.log("NOTIFICATION:", notification);

        // process the action
      },

      // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
      onRegistrationError: function (err) {
        console.error(err.message, err);
      },

      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,

      /**
       * (optional) default: true
       * - Specified if permissions (ios) and token (android and ios) will requested or not,
       * - if not, you must call PushNotificationsHandler.requestPermissions() later
       * - if you are not using remote notification or do not have Firebase installed, use this:
       *     requestPermissions: Platform.OS === 'ios'
       */
      requestPermissions: true,
    });
  }

  const requestUserPermission = async () => {
    try {
      await messaging().requestPermission();
      console.log('Notification permission granted');
    } catch (error) {
      console.error('Error granting notification permission:', error);
    }
  };

  const sendLocalNotification = () => {
    PushNotificationIOS.presentLocalNotification({
      alertTitle: 'Sample Title',
      alertBody: 'Sample local notification',
      applicationIconBadgeNumber: 1,
    });
  };

  const onRegistered = deviceToken => {
    console.log(deviceToken);
  };

  const onRegistrationError = error => {
    Alert.alert(
      'Failed To Register For Remote Push',
      `Error (${error.code}): ${error.message}`,
      [
        {
          text: 'Dismiss',
          onPress: null,
        },
      ],
    );
  };

  const onRemoteNotification = notification => {
    const isClicked = notification.getData().userInteraction === 1;
    const result = `
      Title:  ${notification.getTitle()};\n
      Subtitle:  ${notification.getSubtitle()};\n
      Message: ${notification.getMessage()};\n
      badge: ${notification.getBadgeCount()};\n
      sound: ${notification.getSound()};\n
      category: ${notification.getCategory()};\n
      content-available: ${notification.getContentAvailable()};\n
      Notification is clicked: ${String(isClicked)}.`;

    if (notification.getTitle() == undefined) {
      Alert.alert('Silent push notification Received', result, [
        {
          text: 'Send local push',
          onPress: sendLocalNotification,
        },
      ]);
    } else {
      Alert.alert('Push Notification Received', result, [
        {
          text: 'Dismiss',
          onPress: null,
        },
      ]);
    }
    notification.finish('UIBackgroundFetchResultNoData');
  };

  const onLocalNotification = notification => {
    const isClicked = notification.getData().userInteraction === 1;

    Alert.alert(
      'Local Notification Received',
      `Alert title:  ${notification.getTitle()},
      Alert subtitle:  ${notification.getSubtitle()},
      Alert message:  ${notification.getMessage()},
      Badge: ${notification.getBadgeCount()},
      Sound: ${notification.getSound()},
      Thread Id:  ${notification.getThreadID()},
      Action Id:  ${notification.getActionIdentifier()},
      User Text:  ${notification.getUserText()},
      Notification is clicked: ${String(isClicked)}.`,
      [
        {
          text: 'Dismiss',
          onPress: null,
        },
      ],
    );
  };

  useEffect(() => {
    if (Platform.OS == 'android') {
      android_register();
    } else {
      register();
    }
    const unsubscribe = messaging().onMessage(remoteMessage => {
      let message = remoteMessage.data;
      if (Platform.OS == 'android') {
        NotificationManagerAndroid.createChannel()
        NotificationManagerAndroid.showNotification(message.title, message.description)
      }
    });

    return () => {
      unsubscribe;
      if (Platform.OS == 'ios') {
        PushNotificationIOS.removeEventListener('register');
        PushNotificationIOS.removeEventListener('registrationError');
        PushNotificationIOS.removeEventListener('notification');
        PushNotificationIOS.removeEventListener('localNotification');
      }

    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onMessageReceived = (remoteMessage) => {
    console.log('Remote message received:', remoteMessage);

    // You can handle the received message here, e.g., show a notification
    const { title, body } = remoteMessage.notification;
    Alert.alert(title, body);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <ZegoCallInvitationDialog />
          <StackNavigator />
          <ZegoUIKitPrebuiltLiveStreamingFloatingMinimizedView />
        </NavigationContainer>
        <Toast config={toastConfig} />
      </SafeAreaProvider>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;


