const express = require('express');
const router = express.Router();
const {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getJobStats,
} = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');

// All job routes require user authentication
router.use(protect);

// Stats route (must come before /:id)
router.get('/stats', getJobStats);

// Main collection routes: GET all (with search/filter/sort), POST new job
router.route('/').get(getJobs).post(createJob);

// Individual job item routes: GET by ID, PUT update, DELETE remove
router.route('/:id').get(getJobById).put(updateJob).delete(deleteJob);

module.exports = router;
