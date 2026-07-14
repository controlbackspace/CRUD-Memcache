const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');

module.exports = (personController) => {
  // Mount the security guard middleware directly at the router boundary level
  router.use(authenticateToken);

  // Map individual route resources to distinct controller executions
  router.get('/', personController.getAll);
  router.get('/:id', personController.getById);
  router.post('/', personController.create);
  router.put('/:id', personController.update);
  router.delete('/:id', personController.delete);

  return router;
};