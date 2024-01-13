import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

class _FirebseHandle {
  add_astrologer_uid = ({ userId = null, uid = '' }) => {
    try {
      database()
        .ref(`/AstroId/${userId}`)
        .set(uid)
        .then(async res => {
          await AsyncStorage.setItem('AstroFirebaseId', uid.toString());
        })
        .catch(err => {
          console.log(err);
        });
    } catch (e) {
      console.log(e);
    }
  };

  add_customer_uid = ({ userId = null, uid = null }) => {
    try {
      database()
        .ref(`/UserId/${userId}`)
        .set(uid)
        .then(async res => {
          await AsyncStorage.setItem('CustomerFirebaseId', uid.toString());
        })
        .catch(err => {
          console.log(err);
        });
    } catch (e) {
      console.log(e);
    }
  };

  create_firebase_account = async ({
    userId = null,
    userAccount = null,
    type = 'user',
  }) => {
    try {
      if (type == 'user') {
        await auth()
          .createUserWithEmailAndPassword(
            `${userAccount}@gmail.com`,
            '12345678',
          )
          .then(response => {
            this.add_astrologer_uid({ userId: userId, uid: response.user.uid });
          })
          .catch(async err => {
            await auth()
              .signInWithEmailAndPassword(
                `${userAccount}@gmail.com`,
                '12345678',
              )
              .then(response => {
                this.add_customer_uid({
                  userId: userId,
                  uid: response.user.uid,
                });
              });
            console.log(err);
          });
      } else {
        await auth()
          .createUserWithEmailAndPassword(userAccount, '12345678')
          .then(response => {
            this.add_astrologer_uid({ userId: userId, uid: response.user.uid });
          })
          .catch(async err => {
            await auth()
              .signInWithEmailAndPassword(userAccount, '12345678')
              .then(response => {
                this.add_astrologer_uid({
                  userId: userId,
                  uid: response.user.uid,
                });
              });
            console.log(err);
          });
      }
    } catch (e) {
      console.log(e);
    }
  };
}

export const FirebaseHandle = new _FirebseHandle();
