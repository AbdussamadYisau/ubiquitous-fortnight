const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const UserModel = require("../models/users");
const AuthService = require("../services/auth");
const { JsonResponse } = require("../lib/apiResponse");
const { MSG_TYPES } = require("../constant/types");
require("dotenv/config");

const generateJwtToken = (_id, username) => {
  return jwt.sign(
    { _id, username },
    process.env.JWT_SECRET_TOKEN_SECRET,
    {
      expiresIn: "1d",
    }
  );
};

/**
 * Recover Password
 * @param {*} req
 * @param {*} res
 */
const recover = async (req, res, next) => {
  try {
    const { updateUser } = await AuthService.recover(req.body, req);

    return JsonResponse(res, 200, MSG_TYPES.SENT, updateUser);
  } catch (error) {
    console.log({ error });
    JsonResponse(res, error.statusCode, error.msg);
    next(error);
  }
};

/**
 * Reset Password
 * @param {*} req
 * @param {*} res
 */
const resetPassword = async (req, res, next) => {
  const { email, token } = req.params;
  const { password } = req.body;

  try {
    let filter = {
      email: email,
      "passwordRetrieve.resetPasswordToken": token,
    };

    const user = await UserModel.findOne(filter);

    if (!user) {
      JsonResponse(res, 401, "Password otp is invalid");
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    newPassword = await bcrypt.hash(password, 10);

    if (isValidPassword) {
      JsonResponse(res, 400, "You have used this password before");
    } else {
      user.password = newPassword;
      user.passwordRetrieve = null;
      await user.save();
      return res.status(201).json({
        status: "success",
        message: "Password changed successfully",
      });
    }
  } catch (error) {
    return res.status(400).json({
      status: "failed",
      message: error.message,
    });
  }
};

const register = (req, res) => {
  UserModel.findOne({ email: req.body.email }).exec(async (error, user) => {
    if (user)
      return res.status(400).json({
        status: "Failed",
        statusCode: 0,
        message: "User already registered",
      });

    const { fullname, email, password, state, language, capacityOfAnimals } = req.body;
    const hash_password = await bcrypt.hash(password, 10);
    const _user = new UserModel({
      fullname,
      email: email.toLowerCase(),
      password: hash_password,
      state,
      language,
      capacityOfAnimals
    });

    _user.save( async (error, user) => {
      if (error) {
        return res.status(400).json({
          status: "Failed",
          statusCode: 0,
          message: "Something went wrong",
        });
      }

      if (user) {
        const token = generateJwtToken(user._id, user.fullname);
        const { _id, fullname, email, state, language, capacityOfAnimals } =
          user;

        return res.status(201).json({
          status: "Success",
          statusCode: 1,
          message: "Signed up successfully",
          token,
          data: {
            _id,
            fullname, email, state, language, capacityOfAnimals
          },
        });
      }
    });
  });
};



const login = (req, res) => {
  UserModel.findOne({ email: req.body.email.toLowerCase()}).exec(async (error, user) => {
    if (error) return res.status(400).json({ error });
    if (user) {
      const isPassword = await bcrypt.compare(req.body.password, user.password);
      if (isPassword) {
        const token = generateJwtToken(user._id, user.fullname);
        const { _id, fullname, email, state, language, capacityOfAnimals } =
          user;
        res.status(200).json({
          status: "Success",
          statusCode: 1,
          message: "Logged in successfully",
          token,
          data: {
            _id,
            fullname, email, state, language, capacityOfAnimals
          }
        });
      } else {
        return res.status(400).json({
          status: "Fail",
          statusCode: 0,

          message: "Username/Password is incorrect",
        });
      }
    } else {
      return res.status(400).json({
        status: "Fail",
        statusCode: 0,
        message: "Something went wrong",
      });
    }
  });
};


const getAllUsers = (req, res) => {
  UserModel.find({})
    .select({
      password: 0,
      rememberToken: 0,
      passwordRetrieve: 0,
    })
    .exec()
    .then((users) => {
      return res.status(200).json({
        status: "Success",
        statusCode: 1,
        message: "List of users gotten successfully",
        data: users,
        count: users.length,
      });
    })
    .catch((error) => {
      return res.status(500).json({
        status: "Fail",
        statusCode: 0,
        message: error.message,
        error,
      });
    });
};

// const getAllMembers = (req, res) => {

//   UserModel.find({ role: "admin" })
//     .select({
//       password: 0,
//       rememberToken: 0,
//       passwordRetrieve: 0,
//       hasVerifiedPhoneNumber: 0,
//     })
//     .exec()
//     .then((admin) => {
//       return res.status(200).json({
//         status: "Success",
//         statusCode: 1,
//         message: "List of admins retrieved successfully",
//         data: admin,
//         count: admin.length,
//       });
//     })
//     .catch((error) => {
//       return res.status(500).json({
//         status: "Fail",
//         statusCode: 0,
//         message: error.message,
//         error,
//       });
//     });
// };

const changePassword = async (req, res) => {
  const { newPassword, confirmNewPassword, oldPassword } = req.body;

  const userId = req.params.id;

  try {
    const user = await UserModel.findById(userId);
    const validPassword = await bcrypt.compare(oldPassword, user.password);
    if (user && validPassword) {
      if (newPassword.length < 6 || confirmNewPassword.length < 6) {
        return res.status(400).json({
          status: "failed",
          statusCode: 0,
          message: "New password must be at least 6 characters long",
        });
      }
      const comparedNewPassword = newPassword === confirmNewPassword;

      if (comparedNewPassword) {
        const hashPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashPassword;
        await user.save();
        return res.status(201).json({
          status: "success",
          statusCode: 1,
          message: "Password changed successfully",
          data: user,
        });
      }

      return res.status(400).json({
        status: "failed",
        statusCode: 0,
        message: "New password and Confirm password are not same",
      });
    }

    return res.status(400).json({
      status: "failed",
      statusCode: 0,
      message: "Old password entered incorrect",
    });
  } catch (err) {
    return res.status(400).json({
      status: "failed",
      statusCode: 0,
      message: err.message,
    });
  }
};


const getUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const editUserWithId = await UserModel.findById(userId).select({
      password: 0,
      rememberToken: 0,
      passwordRetrieve: 0,
    });
    if (editUserWithId) {
      return res.status(200).json({
        status: "Success",
        statusCode: 1,
        message: "User Details retrieved successfully",
        data: editUserWithId.select({
          password: 0,
          rememberToken: 0,
          passwordRetrieve: 0

        }),
      });
    } else {
      return res.status(400).json({
        status: "Failed",
        statusCode: 0,
        message: "It seems that this user does not exist",
      });
    }
  } catch (err) {
    return res.status(500).json({
      status: "Failed",
      statusCode: 0,
      message: "There was an error with this request",
      error: `${err.message}`,
    });
  }
};

const deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    await UserModel.deleteOne({
      _id: ObjectID(userId),
    });

    return res.status(200).json({
      status: "Success",
      statusCode: 1,
      message: "Admin deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: "Failed",
      statusCode: 0,
      message: "There was an error with this request",
      error: `${error.message}`,
    });
  }
};

module.exports = {
  recover,
  resetPassword,
  register,
  login,
  getAllUsers,
  changePassword,
  getUser,
  deleteUser
};