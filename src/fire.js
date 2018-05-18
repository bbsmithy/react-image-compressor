import firebase from "firebase";
// Initialize Firebase
var config = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: ""
};
const fire = firebase.initializeApp(config);
export default fire;
