const express = require("express");
const router = express.Router();
console.log("REGISTERING SERVICES ROUTES");
const Service = require("../models/services");
const authMiddleware = require("../middleware/auth.middleware");

console.log("SERVICES ROUTES LOADED");

router.get("/", async (req, res, next) => {
    try {
      const services = await Service.find().populate ( "owner", "name");
        
    res.status(200).json(services);
    } catch (error) {
        next (error);

     }
    });

router.get("/:id", async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id).populate("owner", "name");

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.status(200).json(service);
  } catch (error) {
    next(error);
  }
});



router.post("/", authMiddleware, async (req, res, next) => {
  try {
    const newService = await Service.create({
      ...req.body,
      owner: req.user.id,
    });

    res.status(201).json(newService);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", authMiddleware, async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    if (service.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    Object.assign(service, req.body);

    const updatedService = await service.save();

    res.status(200).json(updatedService);
  } catch (error) {
    next(error);
  }
});

// DELETE service
router.delete("/:id", (req, res, next) => {
  console.log("DELETE ROUTE MATCHED");
  next();
}, authMiddleware, async (req, res, next) => {
  try {
    
    console.log("DELETE SERVICE ROUTE HIT");
    
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    if (service.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await service.deleteOne();

    res.status(200).json({ message: "Service deleted successfully" });
  } catch (error) {
    next(error);
  }
});

console.log(
  router.stack.map((layer) => ({
    path: layer.route?.path,
    methods: layer.route?.methods,
  }))
);

module.exports = router;