var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    name: {type:String, required: true},
    email: {type:String, required: true},
    password: {type:String},
    age: {type:Number},
    phone: {type:Number},
    country: String
}, {timestamps: true})

module.exports = mongoose.model('User', userSchema);