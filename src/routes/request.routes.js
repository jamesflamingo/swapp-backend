const express = require("express");
const router = express.Router();

const Request = require("../models/Request");
const authMiddleware = require("../middleware/auth.middleware");

// GET all requests
router.get("/", async (req, res, next) => {
  try {
    const requests = await Request.find().populate("owner", "name");

    res.status(200).json(requests);
  } catch (error) {
    next(error);
  }
});

// GET request by ID
router.get("/:id", async (req, res, next) => {
  try {
    const request = await Request.findById(req.params.id).populate(
      "owner",
      "name"
    );

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.status(200).json(request);
  } catch (error) {
    next(error);
  }
});

// POST create request
router.post("/", authMiddleware, async (req, res, next) => {
  try {
    const newRequest = await Request.create({
      ...req.body,
      owner: req.user.id,
    });

    res.status(201).json(newRequest);
  } catch (error) {
    next(error);
  }
});

// PUT update request
router.put("/:id", authMiddleware, async (req, res, next) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    Object.assign(request, req.body);

    const updatedRequest = await request.save();

    res.status(200).json(updatedRequest);
  } catch (error) {
    next(error);
  }
});

// DELETE request
router.delete("/:id", authMiddleware, async (req, res, next) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await request.deleteOne();

    res.status(200).json({ message: "Request deleted successfully" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;