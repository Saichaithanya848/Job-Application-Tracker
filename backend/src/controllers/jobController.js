const Job = require('../models/Job');

/**
 * @desc    Get all job applications for the logged-in user with search, filter, and sort
 * @route   GET /api/jobs
 * @access  Private
 */
const getJobs = async (req, res, next) => {
  try {
    const { search, status, jobType, sort } = req.query;

    // Base query: strictly isolate data to the logged-in user
    const query = { user: req.user._id };

    // Search query by company or job title
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [{ company: searchRegex }, { jobTitle: searchRegex }];
    }

    // Filter by status if provided and not 'all'
    if (status && status !== 'all') {
      query.status = status;
    }

    // Filter by job type if provided and not 'all'
    if (jobType && jobType !== 'all') {
      query.jobType = jobType;
    }

    // Determine sort order
    let sortOptions = { applicationDate: -1 }; // Default: newest application date first
    if (sort === 'oldest') {
      sortOptions = { applicationDate: 1 };
    } else if (sort === 'company-asc') {
      sortOptions = { company: 1 };
    } else if (sort === 'company-desc') {
      sortOptions = { company: -1 };
    }

    const jobs = await Job.find(query).sort(sortOptions);

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single job application by ID
 * @route   GET /api/jobs/:id
 * @access  Private
 */
const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job application not found.',
      });
    }

    // Ensure the job application belongs to the logged-in user
    if (job.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this job application.',
      });
    }

    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new job application
 * @route   POST /api/jobs
 * @access  Private
 */
const createJob = async (req, res, next) => {
  try {
    const {
      company,
      jobTitle,
      jobType,
      location,
      status,
      applicationDate,
      jobDescription,
      jobUrl,
      notes,
    } = req.body;

    if (!company || !jobTitle) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both company name and job title.',
      });
    }

    const job = await Job.create({
      user: req.user._id,
      company: company.trim(),
      jobTitle: jobTitle.trim(),
      jobType: jobType || 'Full-time',
      location: location ? location.trim() : 'Remote',
      status: status || 'Applied',
      applicationDate: applicationDate || Date.now(),
      jobDescription: jobDescription ? jobDescription.trim() : '',
      jobUrl: jobUrl ? jobUrl.trim() : '',
      notes: notes ? notes.trim() : '',
    });

    res.status(201).json({
      success: true,
      message: 'Job application added successfully',
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an existing job application
 * @route   PUT /api/jobs/:id
 * @access  Private
 */
const updateJob = async (req, res, next) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job application not found.',
      });
    }

    // Ensure user owns this application record
    if (job.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this job application.',
      });
    }

    // Update job with request body fields
    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Job application updated successfully',
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a job application
 * @route   DELETE /api/jobs/:id
 * @access  Private
 */
const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job application not found.',
      });
    }

    // Ensure user owns this application record
    if (job.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this job application.',
      });
    }

    await job.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Job application deleted successfully',
      data: { id: req.params.id },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get dashboard statistics for the logged-in user
 * @route   GET /api/jobs/stats
 * @access  Private
 */
const getJobStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Fetch all user jobs to calculate metrics cleanly
    const jobs = await Job.find({ user: userId }).sort({ applicationDate: -1 });

    // Status counts
    const statusCounts = {
      Applied: 0,
      Interview: 0,
      Assessment: 0,
      Offer: 0,
      Rejected: 0,
    };

    // Job type counts
    const typeCounts = {
      'Full-time': 0,
      'Part-time': 0,
      Internship: 0,
      Contract: 0,
    };

    jobs.forEach((job) => {
      if (statusCounts[job.status] !== undefined) {
        statusCounts[job.status] += 1;
      }
      if (typeCounts[job.jobType] !== undefined) {
        typeCounts[job.jobType] += 1;
      }
    });

    // Overview cards
    const stats = {
      total: jobs.length,
      applied: statusCounts.Applied,
      interviews: statusCounts.Interview,
      assessments: statusCounts.Assessment,
      offers: statusCounts.Offer,
      rejections: statusCounts.Rejected,
      pending: statusCounts.Applied + statusCounts.Assessment,
      statusDistribution: statusCounts,
      typeDistribution: typeCounts,
      recentApplications: jobs.slice(0, 5), // Latest 5 applications
    };

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getJobStats,
};
