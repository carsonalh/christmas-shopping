import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import firebase from "firebase/app";
import "firebase/firestore";
import { initializeDatabase } from './database';

import { Provider } from 'react-redux';
import store from './store';

// For Firebase JavaScript SDK v7.20.0 and later, `measurementId` is an optional field
var firebaseConfig = {
  apiKey: "AIzaSyAruzd3rVM3n8LVG7Iwz_HfcKYU6eCdZKk",
  authDomain: "christmas-shopping-app.firebaseapp.com",
  databaseURL: "https://christmas-shopping-app.firebaseio.com",
  projectId: "christmas-shopping-app",
  storageBucket: "christmas-shopping-app.appspot.com",
  // messagingSenderId: "SENDER_ID",
  // appId: "APP_ID",
  // measurementId: "G-MEASUREMENT_ID",
};

firebase.initializeApp(firebaseConfig);

initializeDatabase();

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

