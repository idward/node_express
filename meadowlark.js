var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var router = require('./router/index');
var cookieParser = require('cookie-parser');
var sessionParser = require('express-session');
//cookie加密
var credentials = require('./credentials');

var handlebars = require('express3-handlebars').create({
    defaultLayout: 'main',
    extname: '.hbs'
});

var app = express();

app.set('port', process.env.PORT || 3000);

app.set('view engine', 'hbs');

//设置模板引擎
app.engine('hbs', handlebars.engine);
// app.engine('hbs', handlebars({
//     layoutsDir: __dirname + '/views/layouts',
//     defaultLayout: __dirname + '/views/layouts/main.hbs',
//     extname: '.hbs'
// }));

app.set('views', path.join(__dirname, '/views/layouts'));

//设置中间件
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));
app.use(bodyParser());
app.use(cookieParser(credentials.cookieSecret));
app.use(sessionParser());

//设置cookie
app.use(function (req, res, next) {
    //如果有即显消息，把它传到上下文中，然后清除它
    res.locals.flash = req.session.flash;
    delete req.session.flash;
    next();
});

//设置路由
app.use(router);

//定制404页面
app.use(function (req, res) {
    res.status(404);
    res.render('404');
});

//定制500页面
app.use(function (err, req, res, next) {
    console.log(err.stack);
    res.status(500);
    res.render('500');
});

app.listen(app.get('port'), function () {
    console.log('The server is started at http://localhost:'
        + app.get('port') + '; press Ctrl-C to terminate');
});
