var _ = require('underscore');
var Customer = require('../model/customer');

function smartJoin(arr, separator) {
    if (!separator) {
        separator = ' ';
    }
    return arr.filter(function (a) {
        return a !== undefined && a !== null && a.toString().trim() !== ''
    }).join(separator);
}

module.exports = function (customerId) {
    var customer = Customer.findById(customerId);
    if (!customer) {
        return {error: 'Unknown customer ID: ' + req.params.customerId};
    }

    var orders = customer.getOrders().map(function (order) {
        return {
            orderNumber: order.orderNumer,
            date: order.date,
            status: order.status,
            url: '/orders/' + order.orderNumer
        }
    });
    //返回数据
    return {
        firstName: customer.firstName,
        lastName: customer.lastName,
        name: smartJoin([customer.firstName, customer.lastName]),
        email: customer.email,
        address1: customer.address1,
        address2: customer.address2,
        city: customer.city,
        state: customer.state,
        zip: customer.zip,
        fullAddress: smartJoin([
            customer.address1,
            customer.address2,
            customer.city + ', ' + customer.state + ' ' + customer.zip
        ], '<br>'),
        phone: customer.phone,
        orders: customer.getOrders().map(function (order) {
            return {
                orderNumber: order.orderNumber,
                date: order.date,
                status: order.status,
                url: '/orders/' + order.orderNumber
            };
        })
    };
}


