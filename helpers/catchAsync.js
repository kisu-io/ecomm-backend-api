const catchAsync = (controller) => (req, res, next) => {
  controller(req, res, next).catch((err) => next(err));
};
module.exports = catchAsync;
