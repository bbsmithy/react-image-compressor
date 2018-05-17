import firebase from "firebase";
// Initialize Firebase
var config = {
  apiKey: "AIzaSyDpV-gunWUZe0PZZHWR3p_coOn1OT-Zfok",
  authDomain: "benildus-college.firebaseapp.com",
  databaseURL: "https://benildus-college.firebaseio.com",
  projectId: "benildus-college",
  storageBucket: "benildus-college.appspot.com",
  messagingSenderId: "738148456698"
};
const fire = firebase.initializeApp(config);
export default fire;
