export const js = `
// Grab video handle
let video = window.document.getElementsByTagName('video')[0];

let oldURL = '';
function checkURLChange(){
  newURL = document.URL;
  // If the page has changed...
  if(newURL !== oldURL){
    console.log(newURL);
    oldURL = newURL;
    window.ReactNativeWebView.postMessage(newURL);
    video = window.document.getElementsByTagName('video')[0];
    updateListeners();
  }
}
let urlChangeHandler = window.setInterval(checkURLChange, 500);

const updateListeners = () => {
// Handle message FROM React-Native
window.removeEventListener('message', handleCommand);
window.addEventListener('message', handleCommand);

video.onpause = function() {
  console.log("Send to RN: PAUSED, ", video.currentTime);
  window.ReactNativeWebView.postMessage('PAUSED');
};

video.onplay = function() {
  console.log("Send to RN: PLAY, ", video.currentTime);
  window.ReactNativeWebView.postMessage('PLAYED');
};

video.onplaying = function() {
  console.log("Send to RN: PLAYING, ", video.currentTime);
  window.ReactNativeWebView.postMessage('PLAYING');
};

video.waiting = function() {
  console.log("Send to RN: WAITING, ", video.currentTime);
  window.ReactNativeWebView.postMessage('WAITING');
};

video.onseeked = function() {
  console.log("Send to RN: Seeked, ", video.currentTime);
  window.ReactNativeWebView.postMessage('SEEKED');
}

// video.ontimeupdate = function() {
// 	console.log("Send to RN: New Time, ", video.currentTime);
//  window.ReactNativeWebView.postMessage('TIME_UPDATED');
// }
};

const handleCommand = (message) => {
try {
  console.log('Message recieved from RN: ', message);
  switch (message.data) {
    case 'PLAY':
      video.play();
      break;
    case 'PAUSE':
      video.pause();
      break;
    default:
      break;
  }
} catch (e) {
  // dispatch('ERROR', e.message);
  console.log(e.message);
}
};
`;

export default js;
