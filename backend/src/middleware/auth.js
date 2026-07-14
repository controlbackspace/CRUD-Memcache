const jwt = require('jsonwebtoken');

/**
 * Middleware Organism: Validates JWT access credentials.
 * Secures routing pipelines against unauthorized state inspection.
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  // Safeguard against missing headers before parsing strings
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      error: "Access token required. Please login to get a token." 
    });
  }

  // Cryptographically audit the hash signature against local environment invariants
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || 'fallback_secret_key_change_me', (err, user) => {
    if (err) {
      return res.status(403).json({ 
        error: "Invalid token. Please provide a valid token." 
      });
    }

    // Hydrate the request thread with validated context properties
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;