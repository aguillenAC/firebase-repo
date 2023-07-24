// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCIpj-Jl19Y02sfiCiypSbqL9_3F3cUGG0",
  authDomain: "acity-vms.firebaseapp.com",
  databaseURL: "https://acity-vms-default-rtdb.firebaseio.com",
  projectId: "acity-vms",
  storageBucket: "acity-vms.appspot.com",
  messagingSenderId: "399289774144",
  appId: "1:399289774144:web:a51210aee8360eba8aefa5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
export { db };
