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
import firestore from '@react-native-firebase/firestore';

const Routes = React.memo(() => {
  const {user, setUser} = useContext(AuthContext);
  const {loading, setLoading} = useState(true);
  const {initializing, setInitializing} = useState(true);

  useEffect(async () => {
    console.log('_______________setting up firebase .......... ');

    GoogleSignin.configure({
      webClientId:
        '594771741498-7tqbqupmvb2kcac2aits3pj4mh7du1vl.apps.googleusercontent.com',
    });

    await firestore().settings({
      persistence: true, // disable offline persistence
    });
  }, []);

  function onAuthStateChanged(newUser) {
    if (
      (!user && newUser) ||
      (user && !newUser) ||
      (user && newUser && user.uid != newUser.uid)
    ) {
      if (newUser) {
        console.log('----------------- user login ', newUser);

        //setAuthenticated(true);
      } else {
        console.log('----------------- user log out ');
        //setAuthenticated(false);
      }
      setUser(newUser);
    }

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
});

export default Routes;
