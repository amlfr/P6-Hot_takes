/* importing mongoose and it's unique validator */

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

/* Creating the schema for the user objects */

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

/* Passing the validator plugin to our schema */

userSchema.plugin(uniqueValidator);

/* Exporting the schema as an object model */

module.exports = mongoose.model('User', userSchema);   