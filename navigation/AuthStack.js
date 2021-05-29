import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import SignupScreen from '../screens/SignupScreen';
import LoginScreen from '../screens/LoginScreen';
import GoogleLoginScreen from '../screens/GoogleLoginScreen';
const Stack = createStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator initialRouteName="GoogleLogin" headerMode="none">
      <Stack.Screen name="GoogleLogin" component={GoogleLoginScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}
