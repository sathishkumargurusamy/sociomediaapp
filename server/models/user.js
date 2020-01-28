const mongoose = require('mongoose');


const Userschema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    }

});

const user = module.exports = mongoose.model('user', Userschema);