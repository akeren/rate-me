const { Schema, model } = require('mongoose');

const serviceSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'A service must have a name'],
      trim: true,
      unique: true,
    },
    slug: String,
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Ratings must be 1.0 and above'],
      max: [5, 'Ratings must be from 5.0 and below'],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    summary: {
      type: String,
      required: [true, 'A service must have a description summary'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A service must have a cover image'],
    },
    images: [String],
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    admin: {
      type: Schema.ObjectId,
      ref: 'User',
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

serviceSchema.index({ slug: 1 });
serviceSchema.index({ location: '2dsphere' });

serviceSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.__v;
  delete userObject.createdAt;
  return userObject;
};

serviceSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'service',
  localField: '_id',
});

serviceSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'admin',
    select:
      '-__v -token -passwordResetToken -passwordResetExpires -passwordChangedAt',
  });

  next();
});

module.exports = model('Service', serviceSchema);
