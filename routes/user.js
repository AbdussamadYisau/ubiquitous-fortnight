const express = require("express");
const router = express.Router();
const { requireSignin, userMiddleware, adminMiddleware } = require("../middleware");
require("dotenv/config");
const {
  recover,
  resetPassword,
  register,
  login,
  getAllUsers,
  changePassword,
  getUser,
  deleteUser,
  sortUsers
} = require("../controllers/userAuth");
const { validateSigninRequest, validateSignupRequest, isRequestValidated } = require("../validators/auth");

// @route POST /signup
router.post("/users/signup",
validateSignupRequest,
isRequestValidated,
register);

// @route POST /login
router.post("/users/login",
validateSigninRequest,
isRequestValidated,
login);

// @route GET /customers
router.get("/users/customers", requireSignin, adminMiddleware, getAllUsers);

// @route POST /changePassword
router.post("/changePassword/:id", requireSignin, changePassword);

router.post("/recoverPassword", recover);

router.post("/resetPassword/:email/:token", resetPassword);

router.get("/getUser/:id", requireSignin, userMiddleware, getUser);

router.post("/deleteUser/:id", requireSignin, userMiddleware, deleteUser);

// @route GET /sortUsers
router.get("/sortUsers", requireSignin, adminMiddleware, sortUsers);

module.exports = router;
