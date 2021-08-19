var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var incomeSchema = new Schema({
    source: {type:String, required: true},
    amount: {type:Number, required: true},
    date: {type: Date, required: true},
    user: {type: Schema.Types.ObjectId, ref: 'User'},
}, {timestamps: true})

module.exports = mongoose.model('Income', incomeSchema);