const mongoose = require('mongoose');


const Commentschema = mongoose.Schema({
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
    comment: {
        type: String,
        required: true
    }

});

const comments = module.exports = mongoose.model('comments', Commentschema);