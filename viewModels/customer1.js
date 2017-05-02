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

function getCustomerViewModel (customerId) {
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
    //过滤掉这个字段
    var vm = _.omit(customer,'salesNotes');
    //返回数据
    return _.extend(vm, {
        name: smartJoin([vm.firstName, vm.lastName]),
        fullAddress: smartJoin([
            vm.address1,
            vm.address2,
            vm.city + ', ' + vm.state + ' ' + vm.zip
        ], '<br>'),
        orders: customer.getOrders().map(function (order) {
            return {
                orderNumber: order.orderNumber,
                date: order.date,
                status: order.status,
                url: '/orders/' + order.orderNumber
            };
        })
    });
}

module.exports = getCustomerViewModel;


