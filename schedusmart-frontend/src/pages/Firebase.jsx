import { initializeApp } from "firebase/app";

import { getAnalytics } from "firebase/analytics";

import { getStorage } from "firebase/storage"

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {

  apiKey: "AIzaSyC53hV188tV2CxH8dWhgSSuIbIWuGDLl6A",

  authDomain: "schedusmart-483d7.firebaseapp.com",

  databaseURL: "https://schedusmart-483d7-default-rtdb.firebaseio.com",

  projectId: "schedusmart-483d7",

  storageBucket: "schedusmart-483d7.appspot.com",

  messagingSenderId: "442656439492",

  appId: "1:442656439492:web:fbff447025b995d1f89d91",

  measurementId: "G-LKY6EYQRS4"

};


// Initialize Firebase

const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);

export const storage = getStorage(app);