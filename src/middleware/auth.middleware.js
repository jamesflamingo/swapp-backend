
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    // Get the Authorization header
    const authHeader = req.headers.authorization;
console.log("AUTH HEADER EXISTS:", !!authHeader);
console.log("AUTH HEADER FORMAT:", authHeader?.split(" ")[0]);
console.log("TOKEN PARTS:", authHeader?.split(" ")[1]?.split(".").length);
    // Check if the header exists
    if (!authHeader) {
      return res.status(401).json({
        message: "Authentication required"
      });
    }

    // Extract the token from "Bearer TOKEN"
    const token = authHeader.split(" ")[1];

console.log("TOKEN LENGTH:", token.length);
console.log("TOKEN DECODE:", jwt.decode(token));

    if (!token) {
      return res.status(401).json({
        message: "Token not provided"
      });
    }

    // Verify the token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the authenticated user ID to the request
    req.user = decodedToken;

    // Continue to the next middleware or route
    next();
    } catch (error) {
    console.error("JWT verification error:", error.message);

    return res.status(401).json({
      message: "Invalid or expired token"
    });
  }
};

module.exports = authMiddleware;

