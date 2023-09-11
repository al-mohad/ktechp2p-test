"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');
initializeApp();
const db = getFirestore();
const aTuringRef = db.collection('users').doc('aturing');
await aTuringRef.set({
    'first': 'Alan',
    'middle': 'Mathison',
    'last': 'Turing',
    'born': 1912
});
//# sourceMappingURL=firebase.connection.js.map