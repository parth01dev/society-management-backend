import { Schema, model } from "mongoose";

const UserSchema = new Schema({
  firstName: {
    type: String,
    required: [true, "First name is required"],
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"],
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
    validate: {
      validator: function (v) {
        if (!v) return true;
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
      },
      message: "Email must be a valid email address",
    },
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  countryCode: {
    type: String,
    default: "+91",
    match: [/^\+\d{1,4}$/, "Country code must start with '+' and be up to 4 digits"],
  },
  phone: {
    type: String,
    unique: true,
    required: [true, "Phone number is required"],
    match: [/^\d{10}$/, "Phone number must be exactly 10 digits"],
  },
  role: {
    type: String,
    enum: {
      values: ["admin", "resident"],
      message: 'Role must be either "admin" or "resident"',
    },
    default: "resident",
  },

  hasPet: {
    type: Boolean,
    default: false,
  },
  bloodGroup: {
    type: String,
    enum: {
      values: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      message: "Invalid blood group",
    },
  },
  occupation: {
    type: String,
    trim: true,
  },
  interest: {
    type: [String],
    default: [],
  },
});

export default model("User", UserSchema);
