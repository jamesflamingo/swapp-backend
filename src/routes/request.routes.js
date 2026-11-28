const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Request = require("../models/Request");
const authMiddleware = require("../middleware/auth.middleware");

// GET ALL REQUESTS
router.get("/", async (req, res, next) => {
  try {
    const requests = await Request.find().populate("owner", "name");

    return res.status(200).json(requests);
  } catch (error) {
    return next(error);
  }
});

// GET REQUEST BY ID
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid Request ID"
      });
    }

    const request = await Request.findById(id).populate("owner", "name");

    if (!request) {
      return res.status(404).json({
        message: "Request not found"
      });
    }

    return res.status(200).json(request);
  } catch (error) {
    return next(error);
  }
});

// CREATE REQUEST
router.post("/", authMiddleware, async (req, res, next) => {
  try {
    const { title, description, category, location, status } = req.body;

    const newRequest = await Request.create({
      title,
      description,
      category,
      location,
      status,
      owner: req.user.id
    });

    return res.status(201).json(newRequest);
  } catch (error) {
    return next(error);
  }
});

// UPDATE REQUEST
router.put("/:id", authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid Request ID"
      });
    }

    const request = await Request.findById(id);

    if (!request) {
      return res.status(404).json({
        message: "Request not found"
      });
    }

    if (request.owner.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You are not allowed to edit this Request"
      });
    }

    const { title, description, category, location, status } = req.body;

    if (title !== undefined) request.title = title;
    if (description !== undefined) request.description = description;
    if (category !== undefined) request.category = category;
    if (location !== undefined) request.location = location;
    if (status !== undefined) request.status = status;

    const updatedRequest = await request.save();

    return res.status(200).json(updatedRequest);
  } catch (error) {
    return next(error);
  }
});

// DELETE REQUEST
router.delete("/:id", authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid Request ID"
      });
    }

    const request = await Request.findById(id);

    if (!request) {
      return res.status(404).json({
        message: "Request not found"
      });
    }

    if (request.owner.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You are not allowed to delete this Request"
      });
    }

    await Request.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Request deleted successfully"
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;