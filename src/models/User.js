import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/.+\@.+\..+/, "Please use a valid email address"],
  },
  password: {
    type: String,
    required: function () {
      return !this.isVerified; // Password required for non-social logins
    },
  },
  verifyCode: {
    type: String,
    required: function () {
      return !this.isVerified; // Verify code required for email verification
    },
  },
  verifyCodeExpiry: {
    type: Date,
    required: function () {
      return !this.isVerified; // Expiry required for email verification
    },
    default: null,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  blogMessages:{
    type: [MessageSchema],
    default: [],
  }
});

// Create the model if it doesn't already exist
const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
