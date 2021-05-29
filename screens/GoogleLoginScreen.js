import React, {useContext, useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {GoogleSigninButton} from '@react-native-google-signin/google-signin';
import FormButton from '../components/FormButton';

import {AuthContext} from '../navigation/AuthProvider';

import auth from '@react-native-firebase/auth';

export default function GoogleLoginScreen() {
  const {logout, user, googleLogin} = useContext(AuthContext);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(user => {
      if (user) {
        console.log('++++++++++++++user login google  ', user);

        //setAuthenticated(true);
      } else {
        console.log('++++++++++++++user log out google ');
        //setAuthenticated(false);
      }
    });
    return subscriber;
  }, []);

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Google Authentication</Text>
      {user && <Tex>{user.uuid}</Tex>}

      <GoogleSigninButton onPress={() => googleLogin()} />
      <FormButton
        modeValue="contained"
        title="Logout"
        onPress={() => logout()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 25,
    marginBottom: 30,
  },
});
