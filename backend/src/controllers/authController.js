const jwt = require('jsonwebtoken');

module.exports = (UserModel) => {
  return {
    /**
     * POST /api/auth/register Route Target
     */
    register: (req, res) => {
      const { username, password } = req.body;

      // Fail-fast parameters sanity verification
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
      }

      UserModel.create(username, password, (err, userId) => {
        if (err) {
          // Detect SQLite primary key constraint index conflicts (Code 19 / UNIQUE rule violations)
          if (err.message.includes('UNIQUE')) {
            return res.status(409).json({ error: "Username already exists" });
          }
          return res.status(500).json({ error: "Database connection error" });
        }

        return res.status(200).json({
          message: "User registered successfully",
          user: { id: userId, username }
        });
      });
    },

    /**
     * POST /api/auth/login Route Target
     */
    login: (req, res) => {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
      }

      // Query our Cache-Aside interface layer molecule
      UserModel.findByUsername(username, async (err, user) => {
        if (err) {
          return res.status(500).json({ error: "Server error" });
        }
        if (!user) {
          return res.status(401).json({ error: "Invalid username or password" });
        }

        try {
          // Cryptographically evaluate the raw plain text against the storage hash
          const isMatch = await UserModel.verifyPassword(password, user.password);
          if (!isMatch) {
            return res.status(401).json({ error: "Invalid username or password" });
          }

          // Mint a fresh secure access authorization payload signed token string
          const tokenPayload = { id: user.id, username: user.username };
          const secret = process.env.ACCESS_TOKEN_SECRET || 'fallback_secret_key_change_me';
          const accessToken = jwt.sign(tokenPayload, secret, { expiresIn: '1h' });

          return res.status(200).json({
            message: "Login successful",
            token: accessToken
          });
        } catch (cryptoErr) {
          return res.status(500).json({ error: "Server error" });
        }
      });
    }
  };
};