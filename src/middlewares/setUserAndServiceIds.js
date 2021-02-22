const setUserAndServiceIds = (req, res, next) => {
  if (!req.body.service) req.body.service = req.params.serviceId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

module.exports = setUserAndServiceIds;
