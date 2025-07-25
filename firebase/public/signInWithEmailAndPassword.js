import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js';

const firebaseConfig = {
  apiKey: "AIzaSyDaMvInvPj1IPF6ihLarpkgQAcgsWkbFGg",
  authDomain: "envious-detailing-firestore.firebaseapp.com",
  projectId: "envious-detailing-firestore",
  storageBucket: "envious-detailing-firestore.appspot.com",
  messagingSenderId: "986385040435",
  appId: "1:986385040435:web:fe89b5c7b2834d62f6cf46",
  measurementId: "G-73MYNPTSFZ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();

 

function sendResponse(result) {
  window.parent.postMessage(JSON.stringify(result), PARENT_FRAME);
}

window.addEventListener('message', ({data}) => {
  if (data.initAuth) {
    signInWithEmailAndPassword(auth, data.email, data.password)
      .then(sendResponse)
      .catch(sendResponse);
  }
});