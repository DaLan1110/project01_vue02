import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyDGPsM3H1f10OcTPK42VboBJPSkfT21bIw",
    authDomain: "vue02-auth.firebaseapp.com",
    projectId: "vue02-auth",
    storageBucket: "vue02-auth.appspot.com",
    messagingSenderId: "275271675509",
    appId: "1:275271675509:web:3eb8d3c1b385a26c71523c"
};

const firebaseApp  = initializeApp(firebaseConfig);

export { firebaseApp };