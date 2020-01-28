const mongoose = require('mongoose');


const Postschema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    userid: {
        type: String,
        required: true
    },
    post: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        required: true
    },
    time: { type: Date, default: Date.now }

});

const post = module.exports = mongoose.model('post', Postschema);