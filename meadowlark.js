//node核心模块
var http = require('http');
var fs = require('fs');
var url = require('url');
//express核心及中间件
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var router = require('./router/index');
var cookieParser = require('cookie-parser');
var sessionParser = require('express-session');
var mongoose = require('mongoose');
var errorHandler = require('errorhandler');

//导入模型
var Users = require('./model/users');
//数据库连接状态
var db = mongoose.connection;

db.on('error', function (err) {
    console.log('数据库连接失败...');
    console.log(err.stack);
});

db.on('open', function () {
    //数据库连接成功
    console.log('数据库连接成功...');
    //用户数据
    var userData = {id: 12, name: 'Barry111', sex: 'male'};
    //创建用户模型数据
    var user;
    //在保存数据之前调用prefixName
    // user.prefixName(function (err, name) {
    //     if (err) {
    //         throw err;
    //     }
    //     console.log('Your new name is ' + name);
    // });

    //先查询对象是否存在
    Users.find(userData, function (err, users) {
        if (users.length) {
            user = users[0];
            //更新数据
            user.save(function (err, userId) {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log('更新成功...');
                console.log(userId);
            });
        } else {
            //创建用户模型数据
            user = new Users(userData);
            //插入数据
            user.save(function (err, user) {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log('保存成功...');
                console.log(user);
            });
        }
    });


    //更新数据
    // Users.update({name: 'mike'}, {sex: 'male'}, {multi: true}, function (err, affectedLine) {
    //     if (err) {
    //         console.log(err);
    //         return;
    //     }
    //     console.log('影响的行数: ' + affectedLine.n);
    // });

    //删除数据
    // Users.remove({name: 'mike'}, function (err, delStatus) {
    //     if (err) {
    //         console.log(err);
    //         return;
    //     }
    //     var count = delStatus.result.n;
    //     try {
    //         if (count){
    //             console.log('删除成功...');
    //         } else {
    //            throw new Error('删除失败');
    //         }
    //     } catch (ex) {
    //         console.log(ex);
    //     }
    //     console.log('删除条数: ' + count);
    // });

    //查询数据(一条)
    // Users.findOne({name: 'jacky'}, function (err, user) {
    //     if (err) {
    //         console.log(err);
    //         return;
    //     }
    //     console.log('查询成功...');
    //     console.log(user);
    // });

    //查询所有数据
    // Users.find(function (err, users) {
    //     if (err) {
    //         console.log(err);
    //         return;
    //     }
    //     console.log('查询成功...');
    //     console.log(users);
    // });

    //查询多条数据
    // Users.find({name: 'mike'}, function (err, users) {
    //     if (err) {
    //         console.log(err);
    //         return;
    //     }
    //     console.log('查询成功...');
    //     console.log(users);
    // });

    //统计数据
    // Users.count({name: 'mike'}, function (err, nums) {
    //     if (err) {
    //         console.log(err);
    //         return;
    //     }
    //     console.log('查询到相同数据: ' + nums + ' 条');
    // });
});

//cookie加密
var credentials = require('./credentials');

var handlebars = require('express3-handlebars').create({
    layoutsDir: __dirname + '/views/layouts', //模板路径
    defaultLayout: 'main', //缺省模板布局
    extname: '.hbs'  //模板扩展名
});

var app = express();
var server = http.createServer(app);
var io = require('socket.io')(server);

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

    //
    var file = url.parse(req.url).pathname;
    var mode = 'reload';
    createWatcher(file, mode);
    //放行
    next();
});

var watchers = {};

function createWatcher(file, event) {
    var absolute = path.join(__dirname + '/public', file);
    console.log(event);
    console.log(watchers);

    if (watchers[absolute]) {
        return;
    } else {
        fs.watchFile(absolute, function (curr, prev) {
            if (curr.mtime !== prev.mtime) {
                console.log('文件被修改');
                io.sockets.emit(event, file);
            }
        });
        watchers[absolute] = true;
    }
}

//设置路由
app.use(router);

//判断模式(开发|生产)
if ('development' === app.get('env')) {
    //错误处理
    app.use(errorHandler());
    //连接数据库
    mongoose.connect('mongodb://localhost/meadowlark');
    // mongoose.connect('mongodb://username:passward@localhost/meadowlark');
}

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
