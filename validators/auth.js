const {check, validationResult} = require('express-validator');



exports.validateSigninRequest = [
    check("email").isEmail().withMessage("Valid Email is required"),
    check("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 character long"),
  ];


  exports.validateSignupRequest = [
    check("fullname").notEmpty().withMessage("Fullname is required"),
    check("state").notEmpty().withMessage("State is required"),
    check("language").notEmpty().withMessage("Language is required"),
    check("email").isEmail().withMessage("Valid Email is required"),
    check("capacityOfAnimals").isNumeric().withMessage("Capacity of Animals is required"),
    check("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 character long"),
  ];



exports.isRequestValidated = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.array().length > 0) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }
    next();
  };