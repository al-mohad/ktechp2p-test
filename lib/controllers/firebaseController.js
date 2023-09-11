"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const admin = __importStar(require("firebase-admin"));
const firestore_1 = require("firebase-admin/firestore");
const serviceAccountKey_json_1 = __importDefault(require("../configs/serviceAccountKey.json"));
dotenv_1.default.config();
// Create a variable to store your credentials
const serviceAccount = {
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER,
    client_x509_cert_url: process.env.FIREBASE_CLIENT,
    universe_domain: process.env.FIREBASE_UNIVERSAL_DOMAIN,
};
const sa = {};
// Initialize Firebase
admin.initializeApp({
    credential: admin.credential.cert(`${serviceAccountKey_json_1.default}`),
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com/`
});
const messaging = admin.messaging();
const db = (0, firestore_1.getFirestore)();
class FirebaseController {
    async test() {
        // const docRef = db.collection('users').doc('alovelace');
        // const aTuringRef = db.collection('users').doc('aturing');
        // await docRef.set({
        //     first: 'Ada',
        //     last: 'Lovelace',
        //     born: 1815
        // });
        // await aTuringRef.set({
        //     'first': 'Alan',
        //     'middle': 'Mathison',
        //     'last': 'Turing',
        //     'born': 1912
        // });
    }
    async createUser(userModel) {
        try {
            const plainUser = JSON.parse(JSON.stringify(userModel));
            if (!plainUser._id) {
                throw new Error("User ID (_id) is required.");
            }
            const newUserRef = db.collection('users').doc(plainUser._id);
            await newUserRef.set(plainUser, { merge: true });
            return newUserRef.id;
        }
        catch (error) {
            console.error("Error creating user:", error);
            throw error; // Re-throw the error to handle it further up the call stack
        }
    }
    async getUsers() {
        const querySnapshot = await db.collection('users').get();
        return querySnapshot.docs.map((doc) => doc.data());
    }
    async updateUser(id, name, email) {
        const userRef = db.collection('users').doc(id);
        await userRef.update({ name, email });
    }
    async deleteUser(id) {
        const userRef = db.collection('users').doc(id);
        await userRef.delete();
    }
    // // fcm
    async sendNotificationToUser(userId, title, body) {
        const userSnapshot = await db.collection('users').doc(userId).get();
        const user = userSnapshot.data();
        if (!user || !user.fcmToken) {
            throw new Error('User not found or FCM token not available');
        }
        const message = {
            token: user.fcmToken,
            notification: {
                title,
                body,
            },
        };
        await messaging.send(message);
    }
    // //
    async sendNotificationToTopic(topic, title, body) {
        const message = {
            topic,
            notification: {
                title,
                body,
            },
        };
        await messaging.send(message);
    }
}
exports.default = FirebaseController;
//# sourceMappingURL=firebaseController.js.map