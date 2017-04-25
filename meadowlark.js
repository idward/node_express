var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var router = require('./router/index');
var cookieParser = require('cookie-parser');
var sessionParser = require('express-session');
var mongoose = require('mongoose');

var db = mongoose.connection;

db.on('error', function (err) {
    console.log('数据库连接失败...');
    console.log(err.stack);
});

db.on('open', function () {
    //数据库连接成功
    console.log('数据库连接成功...');
    //创建模式和模型
    var userSchema = new mongoose.Schema({
        id: Number,
        name: String,
        sex: String
    });

    var usersModel = mongoose.model('users', userSchema);
    var user = new usersModel({id: 004, name: 'idward', sex: 'male'});
    //插入数据
    // user.save(function (err, user) {
    //     if (err) {
    //         console.log(err);
    //         return;
    //     }
    //     console.log('保存成功...');
    //     console.log(user);
    // });

    //查询数据(一条)
    // usersModel.findOne({name: 'jacky'}, function (err, user) {
    //     if (err) {
    //         console.log(err);
    //         return;
    //     }
    //     console.log('查询成功...');
    //     console.log(user);
    // });
    //查询所有数据
    // usersModel.find(function (err, users) {
    //     if (err) {
    //         console.log(err);
    //         return;
    //     }
    //     console.log('查询成功...');
    //     console.log(users);
    // });
    //查询多条数据
    usersModel.find({name: 'mike'}, function (err, users) {
        if (err) {
            console.log(err);
            return;
        }
        console.log('查询成功...');
        console.log(users);
    });

});

mongoose.connect('mongodb://localhost/meadowlark');
// mongoose.connect('mongodb://username:passward@localhost/meadowlark');

//cookie加密
var credentials = require('./credentials');

var handlebars = require('express3-handlebars').create({
    layoutsDir: __dirname + '/views/layouts', //模板路径
    defaultLayout: 'main', //缺省模板布局
    extname: '.hbs'  //模板扩展名
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

app.set('views', path.join(__dirname, 'views', 'layouts'));

//设置中间件
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));
app.use(bodyParser());
app.use(cookieParser(credentials.cookieSecret));
app.use(sessionParser());

//中间件
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
