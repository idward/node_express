// var helper = require('sendgrid').mail;
// var fromEmail = new helper.Email('test@example.com');
// var toEmail = new helper.Email('idward@vip.sina.com');
// var subject = 'Sending with SendGrid is Fun';
// var content = new helper.Content('text/plain', '<h1>and easy to do anywhere, even with Node.js</h1>');
// var mail = new helper.Mail(fromEmail, subject, toEmail, content);

var fs = require('fs');
var handlebar = require('handlebars');

var template = fs.readFileSync('./views/layouts/email.hbs', 'utf-8');
var compileTemplate = handlebar.compile(template);

var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
var request = sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: {
        personalizations: [
            {
                to: [
                    {
                        email: 'idward@vip.sina.com'
                    }
                ],
                subject: 'Hello World from the SendGrid Node.js Library!'
            }
        ],
        from: {
            email: 'test@example.com'
        },
        content: [
            {
                type: 'text/html',
                value: compileTemplate({firstName:'Jacky'})
            }
        ]
    }
});

sg.API(request).then(function (response) {
    console.log(response.statusCode);
    console.log(response.body);
    console.log(response.headers);
}).catch(function (error) {
    console.log(error.response.statusCode);
});


