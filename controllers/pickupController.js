const { bucket } = require("../config/firebaseConfig");

const Pickup = require("../models/pickupModel");
const validator = require('validator');
const { v4: uuidv4 } = require("uuid");

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

    const { weight, lat, lon, description } = req.body;
    const id = uuidv4();
    const photo = req.file;
    let status = "pending";

    const fileName = `${photo.originalname}-${Date.now()}`;
    const folderName = 'pickups';

    const filePath = `${folderName}/${fileName}`;
    const file = bucket.file(filePath);

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
    }

    try {
      await file.save(photo.buffer, {
        metadata: { contentType: photo.mimetype }
      });

      await file.makePublic();
      const photoUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;

      const pickup = new Pickup(id, photoUrl, weight, lat, lon, description, "", "", status);
      await Pickup.save(pickup);

      return res.status(200).json({
        error: false,
        message: "Successfully create pickup!",
        createResult: pickup
      })

    } catch (error) {
      return res.status(400).json({
        error: true,
        message: "Failed to create pickup!"
      })
    }
  })
}

const getById = async (req, res) => {
  const { id } = req.params;

  try {
    const pickup = await Pickup.findById(id);

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

  } catch (error) {
    return res.status(400).json({
      error: true,
      message: "Failed to get pickup!"
    })
  }
}

const accept = async (req, res) => {
  const { id } = req.params;
  const { pickup_date, pickup_time } = req.body;
  let status = "accepted";

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
    const exist = await Pickup.findById(id);
    if (!exist) {
      return res.status(404).json({
        error: true,
        message: "Pickup not found!"
      })

    } else {
      const pickup = new Pickup(id, "", "", "", "", "", pickup_date, pickup_time, status);
      await Pickup.accept(pickup);
      return res.status(200).json({
        error: false,
        message: "Successfully accept pickup!"
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

  try {
    const exist = await Pickup.findById(id);

    if (!exist) {
      return res.status(404).json({
        error: true,
        message: "Pickup not found!"
      })

    } else {
      await Pickup.reject(id);
      return res.status(200).json({
        error: false,
        message: "Successfully reject pickup!"
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

  try {
    const exist = await Pickup.findById(id);

    if (!exist) {
      return res.status(404).json({
        error: true,
        message: "Pickup not found!"
      })

    } else {
      const oldFilePath = exist.photo.split(`https://storage.googleapis.com/${bucket.name}/`)[1];
      const oldFile = bucket.file(oldFilePath);
      await oldFile.delete();

      await Pickup.deleteById(id);
      return res.status(200).json({
        error: false,
        message: "Successfully delete pickup!"
      })
    }

  } catch (error) {
    return res.status(400).json({
      error: true,
      message: "Failed to delete pickup!"
    })
  }
}

module.exports = { create, getById, accept, reject, deleteById };
