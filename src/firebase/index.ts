import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
export const app = firebase.initializeApp({
  apiKey: "AIzaSyBiWNZvoXShbFG3fi2W48OCgDCEavYhXi4",
  authDomain: "novosluxos.firebaseapp.com",
  databaseURL: "https://novosluxos.firebaseio.com",
  projectId: "novosluxos",
  storageBucket: "novosluxos.appspot.com",
  messagingSenderId: "321808495885",
  appId: "1:321808495885:web:7564ce941ddfe298c1ac44",
  measurementId: "G-91983C1RC1",
});

export const auth = app.auth();
export const db = app.firestore();
export const now = firebase.firestore.FieldValue.serverTimestamp;
