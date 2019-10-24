import React, {useRef, useState, useEffect} from 'react';
import {WebView} from 'react-native-webview';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  BackHandler,
} from 'react-native';
import js from './injectJS';

const youtubeURL = 'https://www.youtube.com';

const App = () => {
  let webview = useRef();
  const [initialURL, setInitialURL] = useState(youtubeURL);
  const [isVideo, setIsVideo] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', function() {
      try {
        webview.goBack();
      } catch {
        setInitialURL(initialURL + '?t=' + Date.now());
        false;
      }
    });
  });

  // Inject JS
  setTimeout(() => {
    if (webview) {
      webview.current.injectJavaScript(js);
    }
  }, 3000);

  // Handle message from WebView
  const onMessage = ({nativeEvent}) => {
    console.log(nativeEvent.data);
    switch (nativeEvent.data) {
      case 'PAUSED':
        setIsPlaying(false);
        break;
      case 'PLAYED':
        setIsPlaying(true);
        break;
      default:
        console.log('UNHANDLED: ', nativeEvent.data);
    }
  };

  // Toggle playing/paused
  const togglePlay = (isPlaying: boolean) => {
    if (isPlaying) {
      webview.current.injectJavaScript("window.postMessage('PAUSE')");
    } else {
      webview.current.injectJavaScript("window.postMessage('PLAY')");
    }
  };

  return (
    <View style={styles.root}>
      <View style={styles.webview}>
        <WebView
          ref={webview}
          allowsFullscreenVideo
          javaScriptEnabled
          source={{
            uri: 'https://www.youtube.com',
          }}
          userAgent={
            'Mozilla/5.0 (Windows; U; Windows NT 6.1; de-DE) AppleWebKit/534.17 (KHTML, like Gecko) Chrome/10.0.649.0 Safari/534.17'
          }
          onMessage={onMessage}
        />
      </View>
      <View
        style={{
          position: 'absolute',
          margin: 'auto',
          left: '50%',
          right: 0,
          bottom: 0,
          zIndex: 1,
          height: 100,
          width: 100,
        }}>
        <TouchableOpacity onPress={() => togglePlay(isPlaying)}>
          {isVideo ? (
            isPlaying ? (
              <Icon name="pause" size={100} color="#900" />
            ) : (
              <Icon name="play" size={100} color="#900" />
            )
          ) : null}
        </TouchableOpacity>
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
