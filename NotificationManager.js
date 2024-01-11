import PushNotification, {Importance} from 'react-native-push-notification';
// import { useNavigation } from "@react-navigation/native";

class NotificationManager {
  // navigation = useNavigation()
  channelId = 'OverfUrLSOnT';
  channelName = 'Notifications';
  channelDescription = 'A channel to categorise your notifications';
  createChannel = () => {
    PushNotification.channelExists(this.channelId, exists => {
      console.log(exists);
      if (!exists) {
        PushNotification.createChannel(
          {
            channelId: this.channelId, // (required)
            channelName: this.channelName, // (required)
            channelDescription: this.channelDescription, // (optional) default: undefined.
            playSound: true, // (optional) default: true
            soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
            importance: Importance.HIGH, // (optional) default: 4. Int value of the Android notification importance
            vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
          },
          created => console.log(`channel created '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
        );
      }
    });
  };
  showNotification = (
    title = '',
    description = '',
    full_description = '',
    messageId = undefined,
    data = undefined,
    Url = undefined,
    userProfile = undefined,
    actions = undefined,
  ) => {
    PushNotification.localNotification({
      /* Android Only Properties */
      channelId: this.channelId, // (required) channelId, if the channel doesn't exist, it will be created with options passed above (importance, vibration, sound). Once the channel is created, the channel will not be update. Make sure your channelId is different if you change these options. If you have created a custom channel, it will apply options of the channel.
      ticker: 'Anant', // (optional
      showWhen: true, // (optional) default: true
      autoCancel: true, // (optional) default: true
      largeIconUrl: Url, // (optional) default: undefined
      bigPictureUrl: userProfile, // (optional) default: undefined
      largeIcon: 'ic_launcher', // (optional) default: "ic_launcher". Use "" for no large icon.
      // largeIconUrl: undefined, // (optional) default: undefined
      bigText: full_description,
      smallIcon: 'ic_launcher', // (optional) default: "ic_notification" with fallback for "ic_launcher". Use "" for default small icon.
      data: data,
      // bigText: "My big text that will be shown when notification is expanded", // (optional) default: "message" prop
      // subText: "This is a subText", // (optional) default: none
      // bigPictureUrl: "https://picsum.photos/200/300", // (optional) default: undefined
      // bigLargeIcon: "ic_launcher", // (optional) default: undefined
      // bigLargeIconUrl: "https://picsum.photos/200/300", // (optional) default: undefined
      // color: "red", // (optional) default: system default
      vibrate: true, // (optional) default: true
      vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
      tag: 'some_tag', // (optional) add tag to message
      group: 'Orders', // (optional) add group to message
      groupSummary: true, // (optional) set this notification to be the group summary for a group of notifications, default: false
      ongoing: false, // (optional) set whether this is an "ongoing" notification
      priority: 'high', // (optional) set notification priority, default: hig
      visibility: 'private', // (optional) set notification visibility, default: private
      ignoreInForeground: false, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear). should be used in combine with `com.dieam.reactnativepushnotification.notification_foreground` setting
      shortcutId: 'shortcut-id', // (optional) If this notification is duplicative of a Launcher shortcut, sets the id of the shortcut, in case the Launcher wants to hide the shortcut, default undefined
      onlyAlertOnce: false, // (optional) alert will open only once with sound and notify, default: false
      messageId: messageId,
      when: null, // (optionnal) Add a timestamp pertaining to the notification (usually the time the event occurred). For apps targeting Build.VERSION_CODES.N and above, this time is not shown anymore by default and must be opted into by using `showWhen`, default: null.
      usesChronometer: false, // (optional) Show the `when` field as a stopwatch. Instead of presenting `when` as a timestamp, the notification will show an automatically updating display of the minutes and seconds since when. Useful when showing an elapsed time (like an ongoing phone call), default: false.
      // actions: [actions], // (Android only) See the doc for notification actions to know more
      invokeApp: true, // (optional) This enable click on actions to bring back the application to foreground or stay in background, default: true
      /* iOS only properties */
      category: '', // (optional) default: empty string

      /* iOS and Android properties */
      // id: 0, // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
      title: title, // (optional)
      message: description, // (required)
      userInfo: {}, // (optional) default: {} (using null throws a JSON value '<null>' error)
      playSound: true, // (optional) default: true
      soundName: 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
      // number: 10, // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
      // repeatType: "day", // (optional) Repeating interval. Check 'Repeating Notifications' section for more info.
    });
  };
}

export const NotificationManagerAndroid = new NotificationManager();
