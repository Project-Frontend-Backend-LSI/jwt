const mongoose = require('mongoose');

// Define the MongoDB schema and model
const tokenSchema = new mongoose.Schema({
    idfreelancer: String,
    token:String,
    date:Date //Date d'expiration
});

const Token = mongoose.model('token', tokenSchema);

module.exports = Token;