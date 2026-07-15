// backend/routes/person.routes.js
const express = require('express');
const router = express.Router();
const Person = require('../models/Person'); // Matches our dynamic age model
const authenticateToken = require('../middleware/auth'); // Your JWT validation middleware

// 1. GET: Fetch all records for the logged-in user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id; // Decoded safe ID from JWT security layer
    const records = await Person.findAllByUserId(userId);
    res.json(records);
  } catch (err) {
    console.error('Error fetching records:', err.message);
    res.status(500).json({ error: 'Database fetch failure.' });
  }
});

// 2. POST: Create a new person record
router.post('/', authenticateToken, async (req, res) => {
  const { firstname, lastname, dob, sex } = req.body;

  // Simple input validation check
  if (!firstname || !lastname || !dob || !sex) {
    return res.status(400).json({ error: 'Missing required fields: firstname, lastname, dob, sex' });
  }

  try {
    const userId = req.user.id;
    const newRecord = await Person.create({ firstname, lastname, dob, sex }, userId);
    res.status(201).json(newRecord);
  } catch (err) {
    console.error('Error saving record:', err.message);
    res.status(500).json({ error: 'Failed to create database entry.' });
  }
});

// 3. PUT: Update an existing record
router.put('/:id', authenticateToken, async (req, res) => {
  const { firstname, lastname, dob, sex } = req.body;
  const { id } = req.params;

  if (!firstname || !lastname || !dob || !sex) {
    return res.status(400).json({ error: 'Missing required fields for update.' });
  }

  try {
    const userId = req.user.id;
    const result = await Person.update(id, { firstname, lastname, dob, sex }, userId);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Record not found or user unauthorized to modify it.' });
    }

    res.json({ success: true, message: 'Record updated successfully.' });
  } catch (err) {
    console.error('Error updating record:', err.message);
    res.status(500).json({ error: 'Failed to update database entry.' });
  }
});

// 4. DELETE: Remove a record safely
router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const userId = req.user.id;
    const result = await Person.delete(id, userId);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Record not found or user unauthorized to delete it.' });
    }

    res.json({ success: true, message: 'Record deleted successfully.' });
  } catch (err) {
    console.error('Error deleting record:', err.message);
    res.status(500).json({ error: 'Failed to delete database entry.' });
  }
});

module.exports = router;