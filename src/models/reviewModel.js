const { Schema, model } = require('mongoose');
const Service = require('./serviceModel');

const reviewSchema = new Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty!'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    service: {
      type: Schema.ObjectId,
      ref: 'Service',
      required: [true, 'Review must belong to a service'],
    },
    user: {
      type: Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.index({ service: 1, user: 1 }, { unique: true });

/*
 ** REMOVE SOME FIELDS ON THE OUTPUT OF REVIEW's OBJECT
 */
reviewSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.__v;
  delete userObject.createdAt;
  return userObject;
};

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'firstName lastName photo',
  });

  next();
});

reviewSchema.statics.calcAverageRating = async function (service) {
  const stats = await this.aggregate([
    {
      $match: { service },
    },
    {
      $group: {
        _id: '$service',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  if (stats.length > 0) {
    return await Service.findByIdAndUpdate(service, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  }

  return await Service.findByIdAndUpdate(service, {
    ratingsQuantity: 0,
    ratingsAverage: 4.5,
  });
};

reviewSchema.post('save', function () {
  this.constructor.calcAverageRating(this.service);
});

/*
 ** Grab the current review Object
 ** And pass it to the next middleware
 */
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();
  next();
});

/*
 ** await this.findOne(); does not here
 ** Because query has already executed
 */
reviewSchema.post(/^findOneAnd/, async function () {
  await this.r.constructor.calcAverageRating(this.r.service);
});

module.exports = model('Review', reviewSchema);
