const { sendVerifyEmail, sendResetPasswordEmail } = require('../services/emailService');
const { admin } = require("../config/firebaseConfig");

const User = require("../models/userModel");
const Pin = require("../models/pinModel");

const validator = require('validator');
const { v4: uuidv4 } = require("uuid");

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generatePin = require('../services/generatePin');

const register = async (req, res) => {
  const { name, email, password, confirmPassword, phone, mitra } = req.body;
  const id = uuidv4();
  let roles = "";

  if (validator.isEmpty(name)) {
    return res.status(400).json({
      error: true,
      message: "Name is required!"
    })
  } else if (validator.isEmpty(email) || !validator.isEmail(email)) {
    return res.status(400).json({
      error: true,
      message: "Valid email is required!"
    })
  } else if (validator.isEmpty(password)) {
    return res.status(400).json({
      error: true,
      message: "Password is required!"
    })
  } else if (validator.isEmpty(confirmPassword)) {
    return res.status(400).json({
      error: true,
      message: "Confirm password is required!"
    })
  } else if (validator.isEmpty(phone) || !validator.matches(phone, /^\+628\d{9,11}$/)) {
    return res.status(400).json({
      error: true,
      message: "Valid phone number is required!"
    })
  }

  try {
    const emailExist = await User.findByEmail(email);
    const phoneExist = await User.findByPhone(phone);

    if (emailExist) {
      return res.status(400).json({
        error: true,
        message: "Email already exists!"
      })

    } else if (phoneExist) {
      return res.status(400).json({
        error: true,
        message: "Phone already exists!"
      })

    } else {
      const hashedPassword = await bcrypt.hash(password, 10);

      if (!mitra) {
        roles = "user";
      } else {
        roles = "mitra";
      }

      if (password !== confirmPassword) {
        return res.status(400).json({
          error: true,
          message: "Password does not match!"
        })

      } else {
        const user = new User(id, name, email, hashedPassword, phone, "", mitra, roles, "", "");

        await User.saveUser(user);
        await Pin.savePin(id);

        await admin.auth().createUser({
          uid: id,
          displayName: name,
          email: email,
          password: hashedPassword,
          phoneNumber: phone
        });

        const link = await admin.auth().generateEmailVerificationLink(email);
        sendVerifyEmail(email, link);

        return res.status(201).json({
          error: false,
          message: "Successfully create user!",
          registerResult: {
            id: user.id,
            email: user.email,
            name: user.name,
            phone: user.phone,
            roles: user.roles
          }
        })
      }
    }

  } catch (error) {
    return res.status(400).json({
      error: true,
      message: "Failed to create user!"
    })
  }
}

const login = async (req, res) => {
  const { email, password } = req.body;

  if (validator.isEmpty(email) || !validator.isEmail(email)) {
    return res.status(400).json({
      error: true,
      message: "Valid email is required!"
    })
  } else if (validator.isEmpty(password)) {
    return res.status(400).json({
      error: true,
      message: "Password is required!"
    })
  }

  try {
    const user = await User.findByEmail(email);
    const checkPassword =  await bcrypt.compare(password, user.password);

    if (checkPassword) {
      const accessToken = jwt.sign({ uid: user.id, email: user.email }, process.env.ACCESS_TOKEN_KEY, { expiresIn: '10m' });
      const refreshToken = jwt.sign({ uid: user.id, email: user.email }, process.env.REFRESH_TOKEN_KEY, { expiresIn: '1d' });
      await User.updateToken(user.id, refreshToken);

      res.cookie('jwt', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict',
        maxAge: 1 * 24 * 60 * 60 * 1000
      });

      return res.status(200).json({
        error: false,
        message: "Successfully login!",
        loginResult: {
          id: user.id,
          email: user.email,
          name: user.name,
          token: accessToken
        }
      })

    } else {
      return res.status(401).json({
        error: true,
        message: "Email or password is incorrect!"
      })
    }

  } catch (error) {
    return res.status(400).json({
      error: true,
      message: "Failed to login!"
    })
  }
}

const profile = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.uid;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        error: true,
        message: "User not found!"
      })
    } else if (user.id != userId) {
      return res.status(401).json({
        error: true,
        message: "You do not have permission to view this profile!"
      })
    } else {
      return res.status(200).json({
        error: false,
        message: "Successfully get user!",
        profileResult: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          mitra: user.mitra,
          roles: user.roles
        },
      })
    }

  } catch (error) {
    return res.status(404).json({
      error: true,
      message: "User not found!"
    })
  }
}

const update = async (req, res) => {
  const { id } = req.params;
  const { name, address, mitra } = req.body;

  const userId = req.user.uid;

  if (validator.isEmpty(name)) {
    return res.status(400).json({
      error: true,
      message: "Name is required!"
    })
  } else if (validator.isEmpty(address)) {
    return res.status(400).json({
      error: true,
      message: "Address is required!"
    })
  }

  try {
    const exist = await User.findById(id);
    if (exist.id !== userId) {
      return res.status(401).json({
        error: true,
        message: "You do not have permission to update this profile!"
      })
    } else {
      if (exist.roles == "mitra") {
        if (!mitra) {
          return res.status(400).json({
            error: true,
            message: "Mitra is required!"
          })
        }
  
      } else {
        if (mitra) {
          return res.status(400).json({
            error: true,
            message: "User is not mitra!"
          })
        }
      }
  
      const user = new User(id, name, "", "", "", address, mitra, "", "", "");
      await User.updateUser(user);
  
      await admin.auth().updateUser(id, { displayName: name });
  
      return res.status(200).json({
        error: false,
        message: "Successfully update user!",
        updateResult: {
          id: exist.id,
          name: user.name,
          email: exist.email,
          phone: exist.phone,
          address: user.address,
          mitra: user.mitra,
          roles: exist.roles
        }
      })
    }

  } catch (error) {
    return res.status(400).json({
      error: true,
      message: "Failed to update user!"
    })
  }
}

const changePassword = async (req, res) => {
  const { id } = req.params;
  const { oldPassword, newPassword, confirmPassword } = req.body;

  if (validator.isEmpty(oldPassword)) {
    return res.status(400).json({
      error: true,
      message: "Old password is required!"
    })
  } else if (validator.isEmpty(newPassword)) {
    return res.status(400).json({
      error: true,
      message: "New password is required!"
    })
  } else if (validator.isEmpty(confirmPassword)) {
    return res.status(400).json({
      error: true,
      message: "Confirm password is required!"
    })
  }

  try {
    const user = await User.findById(id);

    const checkPassword = await bcrypt.compare(oldPassword, user.password);
    if (!checkPassword) {
      return res.status(401).json({
        error: true,
        message: "Old password is incorrect!"
      })

    } else {
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      if (newPassword !== confirmPassword) {
        return res.status(400).json({
          error: true,
          message: "New password and confirm password does not match!"
        })

      } else {
        await User.changePassword(id, hashedPassword);
        await admin.auth().updateUser(id, { password: hashedPassword });

        return res.status(200).json({
          error: false,
          message: "Successfully change password!"
        })
      }
    }

  } catch (error) {
    return res.status(400).json({
      error: true,
      message: "Failed to change password!"
    })
  }
}

const sendResetPassword = async (req, res) => {
  const { email } = req.body;

  if (validator.isEmpty(email) || !validator.isEmail(email)) {
    return res.status(400).json({
      error: true,
      message: "Valid email is required!"
    })
  }

  try {
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(400).json({
        error: true,
        message: "Email is not registered!"
      })

    } else {
      const userId = user.id;
      const pin = generatePin(6);
      const hashedPin = await bcrypt.hash(pin, 10);
      const exp = Date.now() + 3600000;

      const data = new Pin(userId, hashedPin, exp, false);
      await Pin.updatePin(data);

      sendResetPasswordEmail(email, pin);

      return res.status(200).json({
        error: false,
        message: "Successfully send reset password pin!"
      })
    }

  } catch (error) {
    return res.status(400).json({
      error: true,
      message: "Failed to send reset password pin!"
    })
  }
}

const resetPassword = async (req, res) => {
  const { email, pin, password, confirmPassword } = req.body;

  if (validator.isEmpty(email) || !validator.isEmail(email)) {
    return res.status(400).json({
      error: true,
      message: "Valid email is required!"
    })
  } else if (validator.isEmpty(pin)) {
    return res.status(400).json({
      error: true,
      message: "Pin is required!"
    })
  } else if (validator.isEmpty(password)) {
    return res.status(400).json({
      error: true,
      message: "Password is required!"
    })
  } else if (validator.isEmpty(confirmPassword)) {
    return res.status(400).json({
      error: true,
      message: "Confirm password is required!"
    })
  }

  try {
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(400).json({
        error: true,
        message: "Email is not registered!"
      })

    } else {
      const userId = user.id;
      const data = await Pin.findById(userId);

      if (data.used) {
        return res.status(400).json({
          error: true,
          message: "PIN has already been used! Please request a new PIN."
        });
      }

      const checkPin = await bcrypt.compare(pin, data.pin);
      if (!checkPin || data.exp < Date.now()) {
        return res.status(400).json({
          error: true,
          message: "Invalid or expired PIN!"
        })

      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        if (password !== confirmPassword) {
          return res.status(400).json({
            error: true,
            message: "Password and confirm password does not match!"
          })

        } else {
          const pin = new Pin(userId, data.pin, data.exp, true);
          await Pin.updatePin(pin);

          await User.changePassword(userId, hashedPassword);
          await admin.auth().updateUser(userId, { password: hashedPassword });

          await User.logoutUser(userId);

          res.clearCookie('jwt', {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict'
          })

          return res.status(200).json({
            error: false,
            message: "Successfully reset password!"
          })
        }
      }
    }

  } catch (error) {
    return res.status(400).json({
      error: true,
      message: "Failed to reset password! Try again later."
    })
  }
}

const logout = async (req, res) => {
  const { id } = req.params;

  const token = req.cookies.jwt;
  if (!token) {
    return res.status(401).json({
      error: true,
      message: "Cookies is not valid!"
    })
  }

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_KEY);

    if (decoded.uid !== id) {
      return res.status(401).json({
        error: true,
        message: "You cannot logout this user!"
      })
    } else {
      await User.logoutUser(decoded.uid);

      res.clearCookie('jwt', {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict'
      })

      return res.status(200).json({
        error: false,
        message: "Successfully logout!"
      })
    }

  } catch (error) {
    return res.status(400).json({
      error: true,
      message: "Failed to logout!"
    })
  }
}

const refreshToken = async (req, res) => {
  const { id } = req.params;

  const token = req.cookies.jwt;
  if (!token) {
    return res.status(401).json({
      error: true,
      message: "Cookies is not valid!"
    })
  }

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_KEY);

    if (decoded.uid !== id) {
      return res.status(401).json({
        error: true,
        message: "You cannot perform this action!" 
      })
    }

    const user = await User.findById(decoded.uid);

    if (user && user.token === token) {
      const newAccessToken = jwt.sign({ uid: user.id, email: user.email }, process.env.ACCESS_TOKEN_KEY, { expiresIn: '10m' });

      return res.status(200).json({
        error: false,
        message: "Token refreshed!",
        token: newAccessToken
      })

    } else {
      return res.status(401).json({
        error: true,
        message: "Invalid token!",
        test: user,
      })
    }

  } catch (error) {
    return res.status(403).json({
      error: true,
      message: "Something went wrong!"
    })
  }
}

module.exports = { register, login, profile, update, changePassword, sendResetPassword, resetPassword, logout, refreshToken };
