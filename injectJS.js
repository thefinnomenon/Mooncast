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
    openFullscreen();
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
	      case 'FULLSCREEN':
	      	openFullscreen();
	      	break;
	      case 'UNFULLSCREEN':
	      	closeFullscreen();
	      	break;
	      default:
	        break;
    	}
	} catch (e) {
    	// dispatch('ERROR', e.message);
    	console.log(e.message);
	}
};

const openFullscreen = () => {
	if (video.requestFullscreen) {
	  video.requestFullscreen();
	} else if (video.msRequestFullscreen) {
	  video.msRequestFullscreen();
	} else if (video.mozRequestFullScreen) {
	  video.mozRequestFullScreen();
	} else if (video.webkitRequestFullscreen) {
	  video.webkitRequestFullscreen();
	}
}

function closeFullscreen() {
  if (video.exitFullscreen) {
    video.exitFullscreen();
  } else if (video.mozCancelFullScreen) { /* Firefox */
    video.mozCancelFullScreen();
  } else if (video.webkitExitFullscreen) { /* Chrome, Safari and Opera */
    video.webkitExitFullscreen();
  } else if (video.msExitFullscreen) { /* IE/Edge */
    video.msExitFullscreen();
  }
}
`;

export default js;
