const express = require("express");
const mongoose = require("mongoose");
const Item = require("../models/Item");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

// CREATE ITEM
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description, category, type, condition } = req.body;

    const newItem = await Item.create({
      title,
      description,
      category,
      type,
      condition,
      owner: req.user.id
    });

    return res.status(201).json(newItem);
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
});

// GET ALL ITEMS
router.get("/", async (req, res) => {
  try {
    const items = await Item.find().populate("owner", "name");

    return res.status(200).json(items);
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
});

// GET ITEM BY ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid Item ID"
      });
    }

    const item = await Item.findById(id).populate("owner", "name");

    if (!item) {
      return res.status(404).json({
        message: "Item not found"
      });
    }

    return res.status(200).json(item);
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
});

// UPDATE ITEM
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid Item ID"
      });
    }

    const item = await Item.findById(id);

    if (!item) {
      return res.status(404).json({
        message: "Item not found"
      });
    }

    if (item.owner.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You are not allowed to edit this Item"
      });
    }

    const { title, description, category, type, condition } = req.body;

    if (title !== undefined) item.title = title;
    if (description !== undefined) item.description = description;
    if (category !== undefined) item.category = category;
    if (type !== undefined) item.type = type;
    if (condition !== undefined) item.condition = condition;

    await item.save();

    return res.status(200).json(item);
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
});

// DELETE ITEM
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid Item ID"
      });
    }

    const item = await Item.findById(id);

    if (!item) {
      return res.status(404).json({
        message: "Item not found"
      });
    }

    if (item.owner.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You are not allowed to delete this Item"
      });
    }

    await Item.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Item deleted successfully"
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
});

module.exports = router;