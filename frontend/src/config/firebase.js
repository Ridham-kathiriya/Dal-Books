import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBdcAfD1J3R0rny1Hjfrk1OS6zpIjz9hGw",
  authDomain: "csci5709-dalbooks.firebaseapp.com",
  projectId: "csci5709-dalbooks",
  storageBucket: "csci5709-dalbooks.appspot.com",
  messagingSenderId: "370619628504",
  appId: "1:370619628504:web:873dab2be5784f59e310ad"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);