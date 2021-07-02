import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Navigation from './navigation';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants'
import { Platform } from 'react-native'
import * as Linking from 'expo-linking';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  React.useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const route = response.notification.request.content.data.route as string;
      const url = Linking.createURL('/' + route)
      Linking.openURL(url);
    });
    return () => subscription.remove();
  }, []);
  
  return (
    <SafeAreaProvider>
      <Navigation />
      <StatusBar />
    </SafeAreaProvider>
  );
}

async function registerForPushNotificationsAsync() {
  let token;
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    alert('Failed to get push notification permission');
    return;
  }

  if (Constants.isDevice) {
    token = (await Notifications.getExpoPushTokenAsync()).data;
    alert(`Device token: ${token}`);
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}