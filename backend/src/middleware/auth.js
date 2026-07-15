// C:\Users\jakea\Basic_CRUD_Application\backend\src\middleware\auth.js
const jwt = require('jsonwebtoken'); // EXISTING: Imports JWT library

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      error: "Access token required. Please login to get a token." 
    });
  }

  // FIX: Verify using JWT_SECRET to align perfectly with how authController signs tokens
  const secretKey = process.env.JWT_SECRET || process.env.ACCESS_TOKEN_SECRET || 'fallback_secret_key';
  // ^^^ FIX: Unifies signature verification between sign (controller) and verify (middleware)

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ 
        error: "Invalid token. Please provide a valid token." 
      });
    }

    req.user = user; // EXISTING: Bind user profile payload to requests
    next(); // EXISTING: Carry on request execution
  });
}

module.exports = authenticateToken; // EXISTING: Export middleware handler