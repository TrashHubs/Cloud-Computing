const { admin } = require("../config/firebaseConfig");
const User = require("../models/userModel");
const { v4: uuidv4 } = require("uuid");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const register = async (req, res) => {
  const { name, email, password, phone, address, mitra, roles } = req.body;
  const id = uuidv4();

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await admin.auth().createUser({ uid: id, email, password: hashedPassword, displayName: name });

    const user = new User(id, name, email, hashedPassword, phone, address, mitra, roles);
    await User.save(user);

    return res.status(200).json({
      success: true,
      message: "Successfully registered!",
      data: user,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Email already exists!",
    });
  }
}

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findByEmail(email);

    const checkPassword =  await bcrypt.compare(password, user.password);

    if (checkPassword) {
      const token = jwt.sign({ uid: user.id, email: user.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

      return res.status(200).json({
        success: true,
        message: "Successfully login!",
        data: {
          id: user.id,
          email: user.email,
          name: user.name,
          token: token,
        },
      });
    } else {
      return res.status(401).json({
        success: false,
        message: 'Email or password is incorrect!',
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Failed to login!",
    });
  }
}

const profile = async (req, res) => {
  const { id } = req.query;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        status: "User not found!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User found!",
      data: user,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Wrong ID!",
    });
  }
}

const userUpdate = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, phone, address, mitra, roles } = req.body;

  try {
    await admin.auth().updateUser(id, {
      displayName: name,
      phoneNumber: phone,
      address: address,
      mitra: mitra,
    });

    const user = new User(id, name, email, password, phone, address, mitra, roles);
    await User.update(user);

    return res.status(200).json({
      success: true,
      message: "Successfully update!",
      data: user,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

const changePassword = async (req, res) => {
  const { id } = req.params;
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(id);

  const checkPassword = await bcrypt.compare(oldPassword, user.password);

  if (checkPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    try {
      await admin.auth().updateUser(id, {
        password: hashedPassword,
      });

      await User.changePassword(id, hashedPassword);

      return res.status(200).json({
        success: true,
        message: "Successfully change password!",
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Failed to change password!",
      });
    }
  }

  return res.status(400).json({
    success: false,
    message: "Wrong password!",
  });
}

module.exports = { register, login, profile, userUpdate, changePassword };
