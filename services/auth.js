const User = require("../models/users");
const { GenerateCode, mailSender } = require("../utils/index");
const moment = require("moment");


const MSG_TYPES = Object.freeze({
  NOT_FOUND: "Not Found",
  SERVER_ERROR: "Server Error!",
  SENT: "Email Sent",
});

class AuthService {
  /**
   * Recover Password
   * @param {Object} user
   * @param {Objec} req
   */
  static recover(body, req) {
    return new Promise(async (resolve, reject) => {
      try {
        console.log(body.email);
        const user = await User.findOne({
          email: body.email,
        });
        if (!user) {
          reject({ statusCode: 404, msg: MSG_TYPES.NOT_FOUND });
          return;
        }

        const token = GenerateCode(6);
        user.passwordRetrieve.resetPasswordToken = token;
        user.passwordRetrieve.resetPasswordExpires = moment().add(
          20,
          "minutes"
        );

        let to = {
          Email: user.email,
          Name: user.username,
        };
        let subject = "Reset Password ";
        let textpart = "Please Click on reset your password";
        let HTMLPart =
          "Hello, " +
          user.username +
          ",\n\n" +
          "Please reset your password by using the OTP: \n" +
          user.passwordRetrieve.resetPasswordToken +
          "\n\nThank You!\n";

        await mailSender(to, subject, textpart, HTMLPart);

        await user.save();

        resolve({ user });
      } catch (error) {
        return reject({ statusCode: 500, msg: MSG_TYPES.SERVER_ERROR, error });
      }
    });
  }

  static reset(email, token) {
    return new Promise(async (resolve, reject) => {
      try {
        const currentDate = new Date();

        const user = await User.findOne({
          email: email,
          "passwordRetrieve.token": token,
          "passwordRetrieve.resetPasswordExpires": { $gte: currentDate },
        });

        if (!user) {
          return reject({ statusCode: 401, msg: MSG_TYPES.NOT_FOUND });
        }

        resolve({ msg: "Redirect to forgot password" });
      } catch (error) {
        reject({ statusCode: 500, msg: MSG_TYPES.SERVER_ERROR, error });
      }
    });
  }

  static resetPassword(body) {
    return new Promise(async (resolve, reject) => {
      try {
        console.log(body);
        const user = await User.findOne({
          email: body.email,
          "passwordRetrieve.token": body.token,
        });
        if (!user) {
          return reject({ statusCode: 401, msg: MSG_TYPES.NOT_FOUND });
        }

        // user.password = password;
        // console.log("User password", user.password, password);
        user.passwordRetrieve = null;

        console.log("User", user);

        user.save();
        resolve({ user });
      } catch (error) {
        reject({ statusCode: 500, msg: MSG_TYPES.SERVER_ERROR, error });
      }
    });
  }
}

module.exports = AuthService;
