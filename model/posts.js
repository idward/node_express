var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var postsSchema = new Schema({
    title: String,
    postedBy: {
        type: Schema.ObjectId,
        ref: 'users'
    }
});

var Posts = mongoose.model('posts', postsSchema);

//导出模型
// module.exports = Posts;