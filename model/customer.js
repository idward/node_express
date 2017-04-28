var mongoose = require('mongoose');
var Orders = require('../model/orders');

var Schema = mongoose.Schema;
var customerSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    address1: String,
    address2: String,
    city: String,
    state: String,
    zip: String,
    phone: String,
    salesNotes: [
        {
            date: Date,
            salespersonId: Number,
            notes: String
        }
    ]
});

customerSchema.methods.getOrders = function () {
    return Orders.find({customerId: this._id});
}

var Customer = mongoose.model('customer', customerSchema);

module.exports = Customer;