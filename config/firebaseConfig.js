const admin = require("firebase-admin");
const serviceAccount = require("../credentials.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://trashhub.firebaseio.com",
  storageBucket: "trashhub.appspot.com"
});

const db = admin.firestore();
const bucket =  admin.storage().bucket();

module.exports = { admin, db, bucket };
