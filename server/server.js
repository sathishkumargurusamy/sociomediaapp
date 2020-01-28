//importing modules

var express = require('express');
var mongoose = require('mongoose');
var bodyparser = require('body-parser');
var cors = require('cors');
var path = require('path');


const socket = require('socket.io');
var app = express();
var server = app.listen(3001);
let http = require('http').Server(app);

var io = require('socket.io').listen(server);
const route = require('./routes/route');
//connect to mongoDB
mongoose.connect('mongodb://localhost:27017/pm');

//on connection
mongoose.connection.on('connected', () => {
    console.log('Connected Successfully @ 27017!!');
});
mongoose.connection.on('Error', (err) => {
    if (err) {
        console.log('Error in connection', +err);
    }

});

//defining port number
const port = 3000;
//adding middle-ware
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

//body-parser
app.use(bodyparser.json());
//routes
app.use('/api', route);




//testing server
app.get('/', (req, res) => {
    res.send('Hello');
});
io.on('connection', (socket) => {

    console.log('new connection made.');


    socket.on('join', function(data) {
        //joining
        socket.join(data.room);

        console.log(data.user + 'joined the room : ' + data.room);

        socket.broadcast.to(data.room).emit('new user joined', { user: data.user, message: data.room });
    });


    socket.on('leave', function(data) {

        console.log(data.user + 'left the room : ' + data.room);

        socket.broadcast.to(data.room).emit('left room', { user: data.user, message: data.room });

        socket.leave(data.room);
    });

    socket.on('message', function(data) {

        io.in(data.room).emit('new message', { user: data.user, message: data.message });
        console.log(data);
    })
});
app.listen(port, () => {
    console.log('Server Started at port', +port);
});