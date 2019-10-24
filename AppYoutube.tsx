import React, {useRef, useState} from 'react';
import {WebView} from 'react-native-webview';
import Icon from 'react-native-vector-icons/FontAwesome';
import {View, StyleSheet, TouchableOpacity} from 'react-native';

const App = () => {
  const webview = useRef();
  const embedWebView = useRef();
  const [loadJS, setLoadJS] = useState(true); // false
  const [videoID, setVideoID] = useState(null); // null // '4-gMJWbmE-U'
  const [isPlaying, setIsPlaying] = useState(false);

  const run = `
      // Need this code to run on every location change and to check
      // if URL is a normal video url, extract the video id, & send it to RN
      window.addEventListener('locationchange', function(){
        const currURL = window.location.href;
        const videoID = currURL.replace('https://m.youtube.com/watch?v=', '');
        //window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'VIDEO_SELECTED', payload: videoID }));
        window.ReactNativeWebView.postMessage(videoID);
        //alert(videoID);
        const newURL = 'https://www.youtube.com/embed/'+videoID+'?enablejsapi=1';
        window.location.replace(newURL);
      });

      history.pushState = ( f => function pushState(){
        var ret = f.apply(this, arguments);
        window.dispatchEvent(new Event('pushState'));
        window.dispatchEvent(new Event('locationchange'));
        return ret;
      })(history.pushState);
      
      history.replaceState = ( f => function replaceState(){
          var ret = f.apply(this, arguments);
          window.dispatchEvent(new Event('replaceState'));
          window.dispatchEvent(new Event('locationchange'));
          return ret;
      })(history.replaceState);
      
      window.addEventListener('popstate',()=>{
          window.dispatchEvent(new Event('locationchange'));
      });

      true;
    `;

  setTimeout(() => {
    if (loadJS) {
      webview.current.injectJavaScript(run);
    } else {
      embedWebView.current.injectJavaScript(run2);
    }
  }, 3000);

  const run2 = `
    // Send action to Youtube embed
    function controlYoutubeEmbed(action) {
      var iframe = document.getElementById('embedIFrame').contentWindow;

      iframe.postMessage(
        '{"event":"command","func":"' + action + '","args":""}',
        '*',
      );
    }

    // Handle message FROM React-Native
    window.addEventListener('message', function(message) {
      try {
        console.log(message);
        switch (message.data) {
          case 'PLAY':
            controlYoutubeEmbed('playVideo');
            //video.play();
            break;
          case 'PAUSE':
            controlYoutubeEmbed('pauseVideo');
            //video.pause();
            break;
          default:
            break;
        }
      } catch (e) {
        dispatch('ERROR', e.message);
      }
      return true;
    });
    true;
  `;

  // Handle message from WebView
  const onMessage = ({nativeEvent}) => {
    setVideoID(nativeEvent.data);
    setLoadJS(false);
    return;
  };

  const togglePlay = isPlaying => {
    if (isPlaying) {
      embedWebView.current.injectJavaScript("window.postMessage('PAUSE')");
    } else {
      embedWebView.current.injectJavaScript("window.postMessage('PLAY')");
    }

    setIsPlaying(!isPlaying);
  };

  return (
    <View style={styles.root}>
      <View style={styles.webview}>
        {videoID ? (
          <WebView
            ref={embedWebView}
            javaScriptEnabled={true}
            source={{
              html: `<iframe
                id="embedIFrame"
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/${videoID}?rel=0&enablejsapi=1&controls=0&autoplay=1&disablekb=1&fs=0&modestbranding=1&showinfo=0&autohide=1"
                allow="autoplay; encrypted-media"
                frameborder="0"
                allowfullscreen
              ></iframe>`,
            }}
          />
        ) : (
          <WebView
            ref={webview}
            allowsFullscreenVideo
            javaScriptEnabled
            source={{
              uri: 'https://youtube.com',
            }}
            onMessage={onMessage}
          />
        )}
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
            {videoID ? (
              isPlaying ? (
                <Icon name="pause" size={100} color="#900" />
              ) : (
                <Icon name="play" size={100} color="#900" />
              )
            ) : null}
          </TouchableOpacity>
        </View>
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
