const { bucket } = require("../config/firebaseConfig");

const Pickup = require("../models/pickupModel");
const User = require("../models/userModel");
const validator = require('validator');

const { v4: uuidv4 } = require("uuid");
const { format } = require('date-fns');

const multer = require('multer');
const storage = multer({
  storage: multer.memoryStorage(),
  fileSize: 1 * 1024 * 1024
}).single('photo');

const create = async (req, res) => {
  storage(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        error: true,
        message: "Failed to upload photo!"
      })
    }

    const userId = req.user.uid;
    const { weight, lat, lon, description } = req.body;

    const id = uuidv4();
    const photo = req.file;

    if (validator.isEmpty(weight)) {
      return res.status(400).json({
        error: true,
        message: "Weight is required!"
      })
    } else if (validator.isEmpty(lat)) {
      return res.status(400).json({
        error: true,
        message: "Latitude is required!"
      })
    } else if (validator.isEmpty(lon)) {
      return res.status(400).json({
        error: true,
        message: "Longitude is required!"
      })
    } else if (validator.isEmpty(description)) {
      return res.status(400).json({
        error: true,
        message: "Description is required!"
      })
    } else if (!photo) {
      return res.status(400).json({
        error: true,
        message: "Photo is required!"
      })
    }

    const status = "pending";
    const notif = "unread";

    const fileName = `${photo.originalname}-${Date.now()}`;
    const folderName = 'pickups';

    const filePath = `${folderName}/${fileName}`;
    const file = bucket.file(filePath);

    try {
      await file.save(photo.buffer, {
        metadata: { contentType: photo.mimetype }
      });

      await file.makePublic();
      const photoUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;

      const user = await User.findUserById(userId);

      if (user.roles == "user") {
        const pickup = new Pickup(id, photoUrl, weight, lat, lon, description, "", "", status, notif, notif, userId, "");
        await Pickup.save(pickup);

        return res.status(201).json({
          error: false,
          message: "Successfully create pickup!",
          createResult: pickup
        })

      } else {
        return res.status(401).json({
          error: true,
          message: "You are not allowed to create pickup!"
        })
      }

    } catch (error) {
      return res.status(400).json({
        error: true,
        message: "Failed to create pickup!"
      })
    }
  })
}

const getAll = async (req, res) => {
  const userId = req.user.uid;

  try {
    const user = await User.findUserById(userId);

    if (user.roles == "user") {
      const pickup = await Pickup.findAllByUser(userId);
      return res.status(200).json({
        error: false,
        message: "Successfully get pickup!",
        pickupResult: pickup
      })

    } else if (user.roles == "mitra") {
      const pickup = await Pickup.findAllByMitra(userId);
      return res.status(200).json({
        error: false,
        message: "Successfully get pickup!",
        pickupResult: pickup
      })

    } else {
      return res.status(401).json({
        error: true,
        message: "You do not have permission to perform this action!"
      })
    }

  } catch (error) {
    return res.status(404).json({
      error: true,
      message: "Pickup not found!"
    })
  }
}

const getById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.uid;

  try {
    const user = await User.findUserById(userId);

    if (user.roles == "user") {
      const pickup = await Pickup.findIdByUser(id, userId);
      if (!pickup) {
        return res.status(404).json({
          error: true,
          message: "Pickup not found!"
        })

      } else {
        await Pickup.markAs(id, "read", pickup.notifMitra);

        const newest = await Pickup.findIdByUser(id, userId);
        return res.status(200).json({
          error: false,
          message: "Successfully get pickup!",
          pickupResult: newest
        })
      }

    } else if (user.roles == "mitra") {
      const pickup = await Pickup.findIdByMitra(id, userId);
      if (!pickup) {
        return res.status(404).json({
          error: true,
          message: "Pickup not found!"
        })

      } else {
        return res.status(200).json({
          error: false,
          message: "Successfully get pickup!",
          pickupResult: pickup
        })
      }

    } else {
      return res.status(401).json({
        error: true,
        message: "You do not have permission to perform this action!"
      })
    }
    

  } catch (error) {
    return res.status(400).json({
      error: true,
      message: "Failed to get pickup!"
    })
  }
}

const accept = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.uid;

  const { pickup_date, pickup_time } = req.body;
  const status = "accepted";

  if (validator.isEmpty(pickup_date) || !validator.isDate(pickup_date)) {
    return res.status(400).json({
      error: true,
      message: "Valid date is required!"
    })
  } else if (validator.isEmpty(pickup_time)) {
    return res.status(400).json({
      error: true,
      message: "Time is required!"
    })
  }

  try {
    const user = await User.findUserById(userId);

    if (user.roles == "mitra") {
      const exist = await Pickup.findIdByMitra(id, userId);

      if (!exist) {
        return res.status(404).json({
          error: true,
          message: "Pickup not found!"
        })

      } else if (exist.status == "accepted" || exist.status == "rejected") {
        return res.status(400).json({
          error: true,
          message: "You cannot perform this action! Pickup is already " + exist.status
        })

      } else {
        const pickup = new Pickup(id, "", "", "", "", "", pickup_date, pickup_time, status, "", "", "", userId);
        await Pickup.status(pickup);
        await Pickup.markAs(id, "unread", "read");

        return res.status(200).json({
          error: false,
          message: "Successfully accept pickup!"
        })
      }

    } else {
      return res.status(401).json({
        error: true,
        message: "You do not have permission to perform this action!"
      })
    }

  } catch (error) {
    return res.status(400).json({
      error: true,
      message: "Failed to accept pickup!"
    })
  }
}

const reject = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.uid;

  const now = new Date();
  const pickup_date = format(now, 'yyyy-MM-dd');
  const pickup_time = format(now, 'HH:mm:ss');
  const status = "rejected";

  if (validator.isEmpty(pickup_date) || !validator.isDate(pickup_date)) {
    return res.status(400).json({
      error: true,
      message: "Valid date is required!"
    })
  } else if (validator.isEmpty(pickup_time)) {
    return res.status(400).json({
      error: true,
      message: "Time is required!"
    })
  }

  try {
    const user = await User.findUserById(userId);

    if (user.roles == "mitra") {
      const exist = await Pickup.findIdByMitra(id, userId);

      if (!exist) {
        return res.status(404).json({
          error: true,
          message: "Pickup not found!"
        })

      } else if (exist.status == "accepted" || exist.status == "rejected") {
        return res.status(400).json({
          error: true,
          message: "You cannot perform this action! Pickup is already " + exist.status
        })

      } else {
        const pickup = new Pickup(id, "", "", "", "", "", pickup_date, pickup_time, status, "", "", "", userId);
        await Pickup.status(pickup);
        await Pickup.markAs(id, "unread", "read");

        return res.status(200).json({
          error: false,
          message: "Successfully reject pickup!"
        })
      }

    } else {
      return res.status(401).json({
        error: true,
        message: "You do not have permission to perform this action!"
      })
    }

  } catch (error) {
    return res.status(400).json({
      error: true,
      message: "Failed to reject pickup!"
    })
  }
}

const deleteById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.uid;

  try {
    const user = await User.findUserById(userId);

    if (user.roles == "user") {
      const exist = await Pickup.findIdByUser(id, userId);

      if (!exist) {
        return res.status(404).json({
          error: true,
          message: "Pickup not found!",
        })

      } else if (exist.status == "accepted" || exist.status == "rejected") {
        return res.status(400).json({
          error: true,
          message: "You cannot perform this action! Pickup is already " + exist.status
        })

      } else {
        const oldFilePath = exist.photo.split(`https://storage.googleapis.com/${bucket.name}/`)[1];
        const oldFile = bucket.file(oldFilePath);
        
        await Pickup.deleteById(id, userId);
        await oldFile.delete();

        return res.status(200).json({
          error: false,
          message: "Successfully delete pickup!"
        })
      }

    } else {
      return res.status(401).json({
        error: true,
        message: "You do not have permission to perform this action!"
      })
    }

  } catch (error) {
    return res.status(400).json({
      error: true,
      message: "Failed to delete pickup!"
    })
  }
}

module.exports = { create, getAll, getById, accept, reject, deleteById };
