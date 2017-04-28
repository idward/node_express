var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ordersSchema = new Schema({

});

var Orders = mongoose.model('orders', ordersSchema);

module.exports = Orders;