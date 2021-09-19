// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD8kWhEjDe6zD3_11A_Of7Pn6d2UE08gl8",
  authDomain: "portfolio-7bef4.firebaseapp.com",
  projectId: "portfolio-7bef4",
  storageBucket: "portfolio-7bef4.appspot.com",
  messagingSenderId: "966480366873",
  appId: "1:966480366873:web:06b8158d52bc6e33140988",
  measurementId: "G-7K5CCDTNV2",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
