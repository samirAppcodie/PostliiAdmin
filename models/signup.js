

const mongoose = require("mongoose");
const { loginDB } = require('../db'); 
 
const signupSchema = new mongoose.Schema({
  fullName: String,
 
  email: String,
  password: String,

  verificationCode: {
    type: String,
    default: null
  },
  isVerified: { type: Boolean, default: false },
 
  // Additional profile fields
  firstName: {
    type: String,
    default: null
  },
  mobile: {
    type: String,
    default: null
  },
  lastName: {
    type: String,
    default: null
  },
  phone: {
    type: String,
    default: null
  },
  profilePhoto: {
    type: String,
    default: null
  },
  personalLogo: {
    type: String,
    default: null
  },
  brokerageLogo: {
    type: String,
    default: null
  },
 
  // Social login fields
  googleId: {
    type: String,
    default: null,
  },
  facebookId: {
    type: String,
    default: null,
  },
  appleId: {
    type: String,
    default: null,
  },
});
 
// module.exports = mongoose.model("SignupUser", signupSchema);
module.exports = loginDB.model('SignupUser', signupSchema);
 