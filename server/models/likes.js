const mongoose = require('mongoose');


const Likeschema = mongoose.Schema({
    userid: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    postid: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    }

});

const likes = module.exports = mongoose.model('likes', Likeschema);