import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';
import axios from 'axios';
import registerNNPushToken, { getPushDataObject, getNotificationInbox, getUnreadNotificationInboxCount } from 'native-notify';
import { useFonts, OpenSans_300Light, OpenSans_600SemiBold } from '@expo-google-fonts/open-sans';
import AnimatedLoader from './AnimatedLoader';
import NetInfo from '@react-native-community/netinfo';

export default function App() {
  const [url, setUrl] = useState('https://eglafrica.com');
  const [webKey, setWebKey] = useState(1);
  const [notInboxData, setNotInboxData] = useState([]);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [screenName, setScreenName] = useState('Home');
  const [isConnected, setIsConnected] = useState(true);

  registerNNPushToken(13698, 'hFhXoZvgXPAiNxqqCHDmym');
  let pushDataObject = getPushDataObject();

  useFonts({ OpenSans_300Light, OpenSans_600SemiBold });

  useEffect(() => {
    const checkInternetConnection = async () => {
      const { isConnected } = await NetInfo.fetch();
      setIsConnected(isConnected);
    };

    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    checkInternetConnection();

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if ('newURL' in pushDataObject) {
      setUrl(pushDataObject.newURL);
    }
  }, [pushDataObject]);

  // const handleGoToInbox = async () => {
  //   setLoading(true);

  //   let notifications = await getNotificationInbox(13698, 'hFhXoZvgXPAiNxqqCHDmym');
  //   setNotInboxData(notifications);
  //   setScreenName('NotificationInbox');
  //   setUnreadNotificationCount(0);
  // };

  const handleWebViewLoadStart = () => {
    setLoading(true);
  };

  const handleWebViewLoadEnd = () => {
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.page}>
      {!isConnected ? (
        <View style={styles.noConnectionContainer}>
          <Text style={styles.noConnectionText}>No Internet Connection</Text>
        </View>
      ) : null}
      {screenName === 'Home' ? (
        <View style={styles.body}>
          <WebView
            key={webKey}
            style={styles.webview}
            source={{ uri: url }}
            onLoadStart={handleWebViewLoadStart}
            onLoadEnd={handleWebViewLoadEnd}
          />
        </View>
      ) : null}
      {screenName === 'NotificationInbox' ? (
        <View style={styles.body}>
          <FlatList
            data={notInboxData}
            keyExtractor={item => item.notification_id}
            renderItem={({ item }) => (
              <View style={styles.notInboxCont}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.messageText}>{item.message}</Text>
                <Text style={styles.dateText}>{item.date}</Text>
              </View>
            )}
          />
        </View>
      ) : null}

      <AnimatedLoader loading={loading} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingTop: Constants.statusBarHeight,
  },
  body: {
    flex: 9,
    width: '100%',
  },
  webview: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notInboxCont: {
    width: '100%',
    backgroundColor: '#fff',
    borderWidth: 0.75,
    borderColor: 'green',
    padding: 15,
    marginBottom: 15,
  },
  title: {
    fontFamily: 'OpenSans_600SemiBold',
    marginBottom: 5,
    fontSize: 14,
  },
  messageText: {
    fontFamily: 'OpenSans_300Light',
    fontSize: 14,
    marginTop: 5,
  },
  dateText: {
    fontFamily: 'OpenSans_300Light',
    fontSize: 14,
    marginTop: 5,
    textAlign: 'right',
  },
  noConnectionContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noConnectionText: {
    fontSize: 20,
    color: '#fff',
  },
});
