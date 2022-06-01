const MSG_TYPES = Object.freeze({
    ACCOUNT_CREATED: "Account Successfully Created.",
    ACCOUNT_EXIST: "Account already exist.",
    INTEREST_EXIST: "Interest already exist.",
    LOGGED_IN: "Successfully logged in",
    DELETED: "Resource Deleted Successfully",
    UPDATED: "Resource Updated Successfully",
    CREATED: "Resource Created Successfully",
    FETCHED: "Resource Fetched Successfully",
    ACCOUNT_VERIFIED: "Account Successfully Verified",
    ACCOUNT_INVALID: "Invalid email or password",
    SUSPENDED: "Account is suspended!",
    INACTIVE: "Account is inactive!",
    DISABLED: "Account is disabled!",
    ACCOUNT_UNVERIFIED: "Account is unverified!",
    NOT_FOUND: "Not Found",
    PERMISSION: "You don't have enough permission to perform this action",
    SERVER_ERROR: "Server Error!",
    INVALID_PASSWORD: "Invalid Password",
    SENT: "Email Sent",
  });
  
  module.exports = {
    MSG_TYPES,
  };
  