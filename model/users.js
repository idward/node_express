var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    name: {type: String, required: true},
    sex: String,
    created_at: Date,
    updated_at: Date
});

//在save方法之前调用
userSchema.pre('save', function (next) {
    var currentDate = new Date();

    this.updated_at = currentDate;

    if (!this.created_at) {
        this.created_at = currentDate;
    }

    next();
});

userSchema.methods.prefixName = function (fn) {
    var err = null;

    try {
        this.name = 'Cook ' + this.name;
        //throw new Error('name is not exist');
    } catch (ex) {
        err = ex;
    }

    fn(err, this.name);
};

var Users = mongoose.model('users', userSchema);

//导出模型
// module.exports = Users;