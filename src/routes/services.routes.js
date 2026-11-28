const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Service = require("../models/services");
const authMiddleware = require("../middleware/auth.middleware");

// GET ALL SERVICES
router.get("/", async (req, res, next) => {
  try {
    const services = await Service.find().populate("owner", "name");

    return res.status(200).json(services);
  } catch (error) {
    return next(error);
  }
});

// GET SERVICE BY ID
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid Service ID"
      });
    }

    const service = await Service.findById(id).populate("owner", "name");

    if (!service) {
      return res.status(404).json({
        message: "Service not found"
      });
    }

    return res.status(200).json(service);
  } catch (error) {
    return next(error);
  }
});

// CREATE SERVICE
router.post("/", authMiddleware, async (req, res, next) => {
  try {
    const { title, description, category, type } = req.body;

    const newService = await Service.create({
      title,
      description,
      category,
      type,
      owner: req.user.id
    });

    return res.status(201).json(newService);
  } catch (error) {
    return next(error);
  }
});

// UPDATE SERVICE
router.put("/:id", authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid Service ID"
      });
    }

    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({
        message: "Service not found"
      });
    }

    if (service.owner.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You are not allowed to edit this Service"
      });
    }

    const { title, description, category, type } = req.body;

    if (title !== undefined) service.title = title;
    if (description !== undefined) service.description = description;
    if (category !== undefined) service.category = category;
    if (type !== undefined) service.type = type;

    const updatedService = await service.save();

    return res.status(200).json(updatedService);
  } catch (error) {
    return next(error);
  }
});

// DELETE SERVICE
router.delete("/:id", authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid Service ID"
      });
    }

    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({
        message: "Service not found"
      });
    }

    if (service.owner.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You are not allowed to delete this Service"
      });
    }

    await Service.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Service deleted successfully"
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;