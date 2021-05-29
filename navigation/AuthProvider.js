import React, {useState, createContext} from 'react';
import auth from '@react-native-firebase/auth';
import {
  GoogleSigninButton,
  GoogleSignin,
} from '@react-native-google-signin/google-signin';

export const AuthContext = createContext({});

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login: async (email, password) => {
          console.log('login pressed...');
          try {
            await auth().signInWithEmailAndPassword(email, password);
          } catch (e) {
            console.log(e);
          }
        },
        googleLogin: async (email, password) => {
          try {
            console.log('++++++++++++++ pressed google login .....');

            // Get the users ID token
            const {idToken} = await GoogleSignin.signIn();

            console.log('++++++++++ sign token ', idToken);

            // Create a Google credential with the token
            const googleCredential =
              auth.GoogleAuthProvider.credential(idToken);

            // Sign-in the user with the credential
            return await auth().signInWithCredential(googleCredential);
          } catch (e) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
              // when user cancels sign in process,
              Alert.alert('Process Cancelled');
            } else if (error.code === statusCodes.IN_PROGRESS) {
              // when in progress already
              Alert.alert('Process in progress');
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
              // when play services not available
              Alert.alert('Play services are not available');
            } else {
              // some other error
              Alert.alert('Something else went wrong... ', error.toString());
            }
          }
        },

        logout: async () => {
          try {
            console.log('logout pressed...');

            if (user) {
              await auth().signOut();
            }
          } catch (e) {
            console.log(e);
          }
        },
        register: async (email, password) => {
          console.log('register pressed ...');
          try {
            await auth().createUserWithEmailAndPassword(email, password);
          } catch (e) {
            console.log(e);
          }
        },
      }}>
      {children}
    </AuthContext.Provider>
  );
};
