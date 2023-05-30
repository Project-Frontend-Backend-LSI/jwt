const mongoose = require('mongoose');

// Define the MongoDB schema and model
const freelancerSchema = new mongoose.Schema({
  username: String,
  email: {
    type: String,
    required: [true, "Email is required"],
    minlength: [6, "Email should have at least 6 characters"],
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password should have at least 6 characters"]
  },
  country: String,
  phone: String,
  description: String
});



const Freelancer = mongoose.model('Freelancer', freelancerSchema);
module.exports = Freelancer;
