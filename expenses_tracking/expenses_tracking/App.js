import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './HomeScreen';
import RegisterScreen from './RegisterScreen';
import DashboardScreen from './DashboardScreen';
import DetailScreen from './DetailsScreen';

import { ExpensesProvider } from './ExpenseContext'; // adjust path

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <ExpensesProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ title: 'Register / Edit Expense' }}
          />
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen name="DetailScreen" component={DetailScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ExpensesProvider>
  );
}
