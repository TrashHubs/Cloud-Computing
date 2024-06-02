const admin = require("firebase-admin");
const serviceAccount = require("../credentials.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://trashhub.firebaseio.com",
});

const db = admin.firestore();

module.exports = { admin, db };
