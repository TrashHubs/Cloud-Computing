const jwt = require('jsonwebtoken');
const { db } = require('../config/firebaseConfig');

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      error: true,
      message: "Not Authorized",
    })
  }

  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decodedToken;

    const doc = await db.collection('users').doc(decodedToken.uid).get();
    const data = doc.data();

    if (doc.exists && data.token !== token) {
      return res.status(401).json({
        error: true,
        message: "Unauthorized!",
      })
    }

    next();
  } catch (error) {
    return res.status(401).json({
      error: true,
      message: "Not Authorized!",
    })
  }
}

module.exports = verifyToken;
