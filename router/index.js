var express = require('express');
var router = express.Router();
var fortunes = require('../public/js/fortune');

var formidable = require('formidable');

var VALID_EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

function NewsletterSignup() {
}
NewsletterSignup.prototype.save = function (cb) {
    cb();
};

//设置路由
router.get('/', function (req, res) {
    var url = 'home';
    var option = {title: req.query.message};
    //设置session
    // req.session.userName = 'Anonymous';
    // var colorScheme = req.session.colorScheme || 'dark';
    //设置cookie
    res.cookie('monster', 'nom nom');
    res.cookie('signed_monster', 'nom nom', {
        signed: true,
        httpOnly: true, //防范xss攻击 只能服务器端修改
        maxAge: 1000 * 60 //cookie 失效时间
    });
    res.render(url, option);
});

router.get('/about', function (req, res) {
    var url = 'about';
    var options = {title: 'About', fortune: fortunes.randomFortune()};
    var monster = req.cookies.monster;
    var signedMonster = req.signedCookies.signed_monster;
    res.render(url, options);
});

router.get('/users/login', function (req, res) {
    res.render('user-login');
});

router.post('/users/verifyUser', function (req, res) {
    var username = req.body.username;
    var password = req.body.pwd;
    if (username == 'jacky' && password == '123456') {
        res.redirect(303, '/thankyou');
    } else {
        res.redirect(303, '/noAccess');
    }
});

router.get('/thankyou', function (req, res) {
    res.render('thankyou');
});

router.get('/noAccess', function (req, res) {
    res.send('You failed to access');
});

router.get('/contact', function (req, res) {
    res.render('contact', {csrf: 'CSRF token goes here'});
});

router.post('/process-contact', function (req, res) {
    if (req.xhr) {
        console.log('Accept: ' + req.accepts('json,html') === 'json');
        res.json({success: true});
    } else {
        res.redirect(303, '/thankyou');
    }
});

router.get('/contest/vacation-photo', function (req, res) {
    var now = new Date();
    res.render('contest/vacation-photo', {year: now.getFullYear(), month: now.getMonth() + 1});
});

router.post('/contest/vacation-photo/:year/:month', function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        if (err) {
            return res.redirect(303, '/error');
        }
        console.log('received fields:');
        console.log(fields);
        console.log('received files:');
        console.log(files);
        res.redirect(303, '/thankyou');
    });
});

router.get('/newsletter',function (req,res) {
   res.render('newsletter/sub_newsletter');
});

router.post('/newsletter/subscribe', function (req, res) {
    var name = req.body.name || '',
        email = req.body.email || '';
    //输入验证
    if (!email.match(VALID_EMAIL_REGEX)) {
        if (req.xhr) {
            return res.json({error: 'Invalid email address'});
        }
        req.session.flash = {
            type: 'danger',
            intro: 'Validation error!',
            message: 'The email address you entered was not valid'
        };
        return res.redirect(303, '/newsletter/archive');
    }
    //邮件地址验证通过
    new NewsletterSignup({name: name, email: email}).save(function (err) {
        if (err) {
            if (req.xhr) {
                res.json({error: 'Database error.'});
            }
            req.session.flash = {
                type: 'danger',
                intro: 'Database error!',
                message: 'There was a database error; please try again later.'
            };
            return res.redirect(303, '/newsletter/archive');
        }
        if (req.xhr) {
            res.json({success: true});
        }
        req.session.flash = {
            type: 'success',
            intro: 'Thank you!',
            message: 'You have now been signed up for the newsletter.'
        };
        return res.redirect(303, '/newsletter/archive');
    });
});

router.get('/newsletter/archive',function (req,res) {
   res.render('newsletter/archive');
});

router.get('/api/tours', function (req, res) {
    console.log('2222');
});

router.get('/headers', function (req, res) {
    var s = '';
    var headers = req.headers;
    for (var name in headers) {
        s += name + ': ' + headers[name] + '\n';
    }
    res.send(s);
});


module.exports = router;