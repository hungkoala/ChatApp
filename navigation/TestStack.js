import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
const Stack = createStackNavigator();
import Test from '../screens/Test';

export default function TestStack() {
  return (
    <Stack.Navigator initialRouteName="Test" headerMode="none">
      <Stack.Screen name="Test" component={Test} />
    </Stack.Navigator>
  );
}
