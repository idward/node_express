var Customer = require('../model/customer');
var customerViewModel = require('../viewModels/customer1');

module.exports = {
    registerRoutes: function (app) {
        app.get('/customer/:id', this.home);
        app.get('/customer/:id/preferences', this.preferences);
        app.get('/orders/:id', this.orders);
        app.post('/customer/:id/update', this.ajaxUpdate);
    },
    home: function (req, res, next) {
        var customer = Customer.findById(req.params.id);
        if (!customer) {
            return next();
        }
        res.render('customer/home', customerViewModel(customer._id));
    }
}