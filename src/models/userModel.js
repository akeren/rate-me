const crypto = require('crypto');
const { Schema, model } = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
  firstName: {
    type: String,
    trim: true,
    required: [true, 'Please tell us your first name!'],
  },
  lastName: {
    type: String,
    trim: true,
    required: [true, 'Please tell us your last name!'],
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: [true, 'Please provide your email address'],
    validate: [validator.isEmail, 'Please enter a valid email address'],
  },
  phone: {
    type: String,
    required: [true, 'Provide a phone number'],
    unique: true,
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Please provide your password'],
    minlength: [8, 'Password must be minimum of eight (8) charcters'],
    validate(value) {
      if (value.toLowerCase().includes('password')) {
        throw new Error('Password can not contain "password"');
      }
    },
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator(el) {
        return el === this.password;
      },
      message: 'Confirm password not the same with password entered',
    },
  },
  premium: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    lowercase: true,
    enum: ['user', 'admin'],
    default: 'user',
  },
  active: {
    type: Boolean,
    default: false,
  },
  otp: String,
  otpExpiryTime: Date,
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.confirmPassword = undefined;
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.__v;
  delete userObject.otp;
  delete userObject.passwordChangedAt;
  delete userObject.otpExpiryTime;
  return userObject;
};

userSchema.methods.isValidPassword = async function (
  userEnteredPassword,
  userSavedPassword
) {
  return await bcrypt.compare(userEnteredPassword, userSavedPassword);
};

userSchema.methods.isPasswordChangedAfterTokenWasIssued = function (
  JWTTimestamp
) {
  if (this.passwordChangedAt) {
    // convert to timestamp in seconds & to base 10
    const convertToTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < convertToTimestamp;
  }

  // FALSE: means password not chaged after token was issued
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  // GENERATE THE RESET TOKEN
  const resetToken = crypto.randomBytes(32).toString('hex');

  // HASH THE RESET TOKEN & SAVE INTO DB
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // SET THE RESET TOKEN EXPIRY TIME - 10 minutes
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

userSchema.methods.generate4DigitOTP = function () {
  const otp = Math.floor(Math.random() * (9999 - 1000) + 1000 + 1);

  this.otp = otp;

  // SET THE RESET OTP EXPIRY TIME - 10 minutes
  this.otpExpiryTime = Date.now() + 10 * 60 * 1000;

  return otp;
};

module.exports = model('User', userSchema);
