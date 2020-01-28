const mongoose = require('mongoose');


const Groupschema = mongoose.Schema({
    userid: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    groupname: {
        type: String,
        required: true
    }

});

const group = module.exports = mongoose.model('group', Groupschema);