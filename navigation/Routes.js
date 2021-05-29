import React, {useContext, useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {View, Text} from 'react-native';

import auth from '@react-native-firebase/auth';

import AuthStack from './AuthStack';
import TestStack from './TestStack';
import HomeStack from './HomeStack';
import {AuthContext} from './AuthProvider';
import Loading from '../components/Loading';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

export default function Routes() {
  const {user, setUser} = useContext(AuthContext);
  const {loading, setLoading} = useState(true);
  const {initializing, setInitializing} = useState(true);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '594771741498-7tqbqupmvb2kcac2aits3pj4mh7du1vl.apps.googleusercontent.com',
    });
  }, []);

  function onAuthStateChanged(user) {
    if (user) {
      console.log('----------------- user login ', user);

      //setAuthenticated(true);
    } else {
      console.log('----------------- user log out ');
      //setAuthenticated(false);
    }

    setUser(user);
    if (initializing) {
      setInitializing(false);
      setLoading(false);
    }
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <NavigationContainer>
      {user ? <HomeStack /> : <AuthStack />}
    </NavigationContainer>
  );
}
