import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js';

const PARENT_FRAME = '*';

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

console.log('Firebase auth iframe loaded');

function sendUser(user) {
  const sanitized = {
    uid: user.uid,
    email: user.email
  };
  console.log('Sending user to parent', sanitized);
  window.parent.postMessage(JSON.stringify({ user: sanitized }), PARENT_FRAME);
}

function sendError(error) {
  console.error('Auth error', error);
  window.parent.postMessage(JSON.stringify({ error: error.message }), PARENT_FRAME);
}


 const form = document.getElementById('loginForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    console.log('Form submit', email);
    signInWithEmailAndPassword(auth, email, password)
      .then((cred) => sendUser(cred.user))
      .catch(sendError);
  });
}

window.addEventListener('message', ({ data }) => {
  console.log('Received message', data);
  if (data.initAuth) {
    signInWithEmailAndPassword(auth, data.email, data.password)
       .then((cred) => sendUser(cred.user))
      .catch(sendError);
  }
});