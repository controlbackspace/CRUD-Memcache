const express = require('express');
const cors = require('cors');
require('dotenv').config();

// 1. ATOMS LAYER: Infrastructure Connection Clients
const db = require('./src/config/db');
const cache = require('./src/config/cache');

// 2. MOLECULES LAYER: Dependency Injection into Data Models
const UserModel = require('./src/models/User')(db, cache);
const PersonModel = require('./src/models/Person')(db);

// 3. TEMPLATES LAYER: Initializing Route Coordinators
const authController = require('./src/controllers/authController')(UserModel);
const personController = require('./src/controllers/personController')(PersonModel);

// 4. PAGES LAYER: Initializing Routers
const authRoutes = require('./src/routes/authRoutes')(authController);
const personRoutes = require('./src/routes/personRoutes')(personController);

const app = express();
const PORT = process.env.PORT || 5000;

// 5. GLOBAL MIDDLEWARE LAYER
app.use(cors());
app.use(express.json()); // Essential body parser register

// 6. MOUNTING ROUTE ENTRY CHANNELS
app.use('/api/auth', authRoutes);
app.use('/api/persons', personRoutes);

// 7. GLOBAL CATCH-ALL FOR TRAPPED UNTRACKED PATHS
app.use((req, res) => {
  res.status(404).json({ error: "Resource endpoint route not found" });
});

// 8. SERVER INITIALIZATION LISTENER BOUNDARY
const server = app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`🚀 Layered CRUD Application Architecture Online!`);
  console.log(`📡 Listening on network endpoint: http://localhost:${PORT}`);
  console.log(`==================================================`);
});

module.exports = { app, server };