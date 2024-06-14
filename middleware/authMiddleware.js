const jwt = require('jsonwebtoken');
const { admin, db } = require('../config/firebaseConfig');

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  const refreshToken = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({
      error: true,
      message: "Not Authorized"
    })
  }

  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
    req.user = decodedToken;

    const doc = await db.collection('users').doc(decodedToken.uid).get();
    const data = doc.data();

    if (doc.exists && data.token !== refreshToken) {
      return res.status(401).json({
        error: true,
        message: "Unauthorized!"
      })

    } else if (doc.exists && !data.verified) {
      const user = await admin.auth().getUserByEmail(decodedToken.email);

      if (user.emailVerified) {
        await db.collection('users').doc(decodedToken.uid).update({ verified: true });

      } else {
        return res.status(401).json({
          error: true,
          message: "Please verify your email first!"
        })
      }
    }
    next();

  } catch (error) {
    return res.status(401).json({
      error: true,
      message: "Not Authorized!"
    })
  }
}

module.exports = verifyToken;
