const express = require('express');
const router = express.Router();
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

// Protect all routes in this router
router.use(protect);

// Main task endpoints
router.route('/')
  .get(getTasks)
  .post(createTask);

// Task statistics endpoint (placed before ID-specific routes)
router.route('/stats')
  .get(getTaskStats);

// Single task modification endpoints
router.route('/:id')
  .put(updateTask)
  .delete(deleteTask);

module.exports = router;
