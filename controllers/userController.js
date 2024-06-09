const { admin } = require("../config/firebaseConfig");
const User = require("../models/userModel");
const validator = require('validator');

const { v4: uuidv4 } = require("uuid");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const register = async (req, res) => {
  const { name, email, password, phone, mitra } = req.body;
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
      await admin.auth().createUser({
        uid: id,
        displayName: name,
        email: email,
        password: hashedPassword,
        phoneNumber: phone
      });

      if (!mitra) {
        roles = "user";
      } else {
        roles = "mitra";
      }

      const user = new User(id, name, email, hashedPassword, phone, "", mitra, roles);
      await User.save(user);

      return res.status(201).json({
        error: false,
        message: "Successfully create user!",
        registerResult: {
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          roles: user.roles,
        },
      })
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
      const token = jwt.sign({ uid: user.id, email: user.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
      await User.updateToken(user.id, token);

      return res.status(200).json({
        error: false,
        message: "Successfully login!",
        loginResult: {
          id: user.id,
          email: user.email,
          name: user.name,
          token: token,
        },
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

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        error: true,
        message: "User not found!"
      })
    }

    return res.status(200).json({
      error: false,
      message: "Successfully get user!",
      profile: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        mitra: user.mitra,
        roles: user.roles,
      },
    })

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

    await admin.auth().updateUser(id, { displayName: name });

    const user = new User(id, name, "", "", "", address, mitra, "");
    await User.update(user);

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
        roles: exist.roles,
      },
    })

  } catch (error) {
    return res.status(400).json({
      error: true,
      message: "Failed to update user!"
    })
  }
}

const changePassword = async (req, res) => {
  const { id } = req.params;
  const { oldPassword, newPassword } = req.body;

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

      await admin.auth().updateUser(id, { password: hashedPassword });
      await User.changePassword(id, hashedPassword);

      const token = jwt.sign({ uid: user.id, email: user.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
      await User.updateToken(id, token);

      return res.status(200).json({
        error: false,
        message: "Successfully change password!"
      })
    }

  } catch (error) {
    return res.status(400).json({
      error: true,
      message: "Failed to change password!"
    })
  }
}

const verify = async (req, res) => {
  const { email } = req.params;

  try {
    const user = await admin.auth().getUserByEmail(email);

    if (!user.emailVerified) {
      const link = await admin.auth().generateEmailVerificationLink(email);
      return res.status(400).json({
        error: true,
        message: "Please verify your email!",
        verifyLink: link
      })

    } else {
      await User.verified(user.uid)
      return res.status(200).json({
        error: false,
        message: "Successfully verified email!"
      })
    }

  } catch (error) {
    return res.status(400).json({
      error: true,
      message: "Failed to verify email. Please try again later!"
    })
  }
}

module.exports = { register, login, profile, update, changePassword, verify };
