import React from 'react';
import {WebView} from 'react-native-webview';
import {
  View,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Dimensions,
} from 'react-native';

const App = () => {
  return (
    <View style={styles.root}>
      <View style={styles.webview}>
        <WebView
          allowsFullscreenVideo
          source={{
            uri: 'https://youtube.com',
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  webview: {
    flex: 1,
    flexDirection: 'row',
  },
  header: {
    height: 65,
    paddingTop: 25,
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 20,
  },
  root: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
  },
});

export default App;
