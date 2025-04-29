// 📁 backend/models/User.js
const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema({
  fullName: String,
  phone: String,
  address: String,
  username: String,
  companyName: String,
  companyRegNumber: String,
  companyType: String,
  companyWebsite: String,
  bankDetails: String,
  paymentMethod: String,
  productCategories: String,
  productDescription: String,
  identityDocument: String,
  businessCertificate: String,
  returnPolicy: String,
  shippingInfo: String,
});

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["buyer", "seller", "admin"], default: "buyer" },
  isSeller: { type: Boolean, default: false },
  pending: { type: Boolean, default: false },
  sellerInfo: sellerSchema,
});

module.exports = mongoose.model("User", userSchema);
