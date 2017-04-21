var fortunes = [
    'Conquer your fears or they will conquer you.',
    'Rivers need springs.',
    'Do not fear what you don\'t know',
    'You will have a pleasant surprise.'
];

var getFortune = function () {
    var num = Math.floor(Math.random()*fortunes.length);
    return fortunes[num];
};

exports.randomFortune = getFortune;