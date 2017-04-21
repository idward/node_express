var express = require('express');
var path = require('path');
var fortunes = require('./public/js/fortune');

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

//设置路由
app.get('/', function (req, res) {
    res.render('home');
});

app.get('/about', function (req, res) {
    res.render('about', {fortune: fortunes.randomFortune()});
});

app.get('/api/tours', function (req, res) {
    
});

app.get('/headers', function (req, res) {
    var s = '';
    var headers = req.headers;
    for (var name in headers) {
        s += name + ': ' + headers[name] + '\n';
    }
    res.send(s);
});

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
