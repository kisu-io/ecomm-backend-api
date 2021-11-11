const isAdmin = (req, res, next) => {
  try {
    if (req.currentUser.role !== 'admin')
      throw new Error('You have to be an admin to login to the control');
    next();
  } catch (error) {
    next(error);
  }
};
module.exports = isAdmin;
