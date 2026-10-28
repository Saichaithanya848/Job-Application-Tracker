const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User Schema definition
 * Represents a registered job seeker in the application.
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your full name'],
      trim: true,
      minlength: [1, 'Name must be at least 1 character long'],
      maxlength: [120, 'Name cannot exceed 120 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters long'],
      // Avoid returning password in queries unless explicitly selected
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Mongoose pre-save middleware to hash password before saving to database.
 * Only runs if the password field was modified or created new.
 */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

/**
 * Helper method to compare entered plain-text password with hashed password in DB.
 * Returns true if matching, false otherwise.
 */
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

/**
 * Helper method to return clean user object without sensitive fields.
 */
userSchema.methods.toSafeObject = function () {
  return {
    _id: this._id,
    name: this.name,
    email: this.email,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

module.exports = mongoose.model('User', userSchema);
