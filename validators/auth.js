const {check, validationResult} = require('express-validator');



exports.validateSigninRequest = [
    check("email").isEmail().withMessage("Valid Email is required"),
    check("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 character long"),
  ];


  exports.validateSignupRequest = [
    check("fullname").notEmpty().withMessage("Fullname is required"),
    check("email").isEmail().withMessage("Valid Email is required"),
    check("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 character long"),
    check("psnNumber").notEmpty().withMessage("PSN Number is required"),
    check("localGovernmentArea").notEmpty().withMessage("Local Government Area is required"),
    check("ministry").notEmpty().withMessage("Ministry is required"),
    check("dateOfFirstAssignment").notEmpty().withMessage("Date of First Assignment is required"),
    check("lastPromotionDate").notEmpty().withMessage("Last Promotion Date is required"),

  ];



exports.isRequestValidated = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.array().length > 0) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }
    next();
  };