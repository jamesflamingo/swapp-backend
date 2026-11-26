const express = require("express");
const User = require("../models/User");

const router = express.Router();
console.log("AUTH ROUTES LOADED");


router.post("/signup", async (req, res) => {
  console.log("SIGNUP ROUTE HIT");
  
    const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const newUser = await User.create({ name, email, password });

  return res.status(201).json({
    message: "User created successfully",
    user: {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email
    }
  });
});

module.exports = router;