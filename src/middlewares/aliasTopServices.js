const aliasTopServices = (req, res, next) => {
  req.query.limit = '10';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,slug,price,ratingsAverage,imageCover,images,summary';
  next();
};

module.exports = aliasTopServices;
