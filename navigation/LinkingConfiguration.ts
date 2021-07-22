/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import { LinkingOptions } from '@react-navigation/native'
import * as Linking from 'expo-linking';
import * as Notifications from 'expo-notifications';

const linking: LinkingOptions = {
  prefixes: [Linking.createURL('/')],
  config: {
    screens: {
      Root: {
        screens: {
          TabOne: {
            screens: {
              TabOneScreen: 'one',
            },
          },
          TabTwo: {
            screens: {
              TabTwoScreen: 'two',
            },
          },
        },
      },
      NotFound: '*',
    },
  },
  subscribe(listener) {
    const onReceiveURL = ({ url }: { url: string }) => listener(url);

    // Listen to incoming links from deep linking
    Linking.addEventListener('url', onReceiveURL);

    // Listen to push notifications
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const route = response.notification.request.content.data.route as string;
      const url = Linking.createURL('/' + route);

      // Let React Navigation handle the URL
      listener(url);
    });

    return () => {
      // Clean up the event listeners
      Linking.removeEventListener('url', onReceiveURL);
      subscription.remove();
    };
  },
};

export default linking
