const mongoose = require('mongoose');

/**
 * Job Schema definition
 * Represents an individual job application tracked by a user.
 */
const jobSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Job application must belong to a user'],
      index: true,
    },
    company: {
      type: String,
      required: [true, 'Please provide the company name'],
      trim: true,
      maxlength: [100, 'Company name cannot exceed 100 characters'],
    },
    jobTitle: {
      type: String,
      required: [true, 'Please provide the job title'],
      trim: true,
      maxlength: [100, 'Job title cannot exceed 100 characters'],
    },
    jobType: {
      type: String,
      enum: {
        values: ['Full-time', 'Part-time', 'Internship', 'Contract'],
        message: '{VALUE} is not a supported job type',
      },
      default: 'Full-time',
    },
    location: {
      type: String,
      trim: true,
      default: 'Remote',
      maxlength: [100, 'Location cannot exceed 100 characters'],
    },
    status: {
      type: String,
      enum: {
        values: ['Applied', 'Interview', 'Assessment', 'Offer', 'Rejected'],
        message: '{VALUE} is not a valid application status',
      },
      default: 'Applied',
      index: true,
    },
    applicationDate: {
      type: Date,
      default: Date.now,
      required: [true, 'Please provide the application date'],
    },
    jobDescription: {
      type: String,
      trim: true,
      default: '',
      maxlength: [5000, 'Job description cannot exceed 5000 characters'],
    },
    jobUrl: {
      type: String,
      trim: true,
      default: '',
    },
    notes: {
      type: String,
      trim: true,
      default: '',
      maxlength: [2000, 'Notes cannot exceed 2000 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for fast user-specific sorting and filtering
jobSchema.index({ user: 1, applicationDate: -1 });
jobSchema.index({ user: 1, status: 1 });

module.exports = mongoose.model('Job', jobSchema);
