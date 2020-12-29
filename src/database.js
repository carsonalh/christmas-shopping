import firebase from 'firebase/app';
import 'firebase/firestore';

var db;

export const initializeDatabase = function() {
    db = firebase.firestore();
};

export default db;

