var express = require('express');
var app = express();

//socket io's variable to import; pulling in from node module so u can use it
const io = require('socket.io')(); // instantiate the library right away with the () method -> makes it run

const port = process.env.PORT || 3030;

// tell express where our static files are (js, images, css etc)
app.use(express.static('public'));

// our only route sending back html
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

const server = app.listen(port, () => {
    console.log(`app is running on port ${port}`);
});

// this is all of our socket.io messaging functionality

// we need to tell socket.io to use server above. Just use this mailbox to send message above
// attach socket.io
io.attach(server);
io.on('connection', function(socket) {
    console.log('user connected');
    socket.emit('connected', {sID: `${socket.id}`, message: 'new connection'});

    // listen for an incoming message from a user (socket refers to an individual user)
    // msg is the incoming message fom that user
    socket.on('chat_message', function(msg) {
        console.log(msg);

        // when we get a new message, send it to everyone so they see it
        // io is the switchboard operator, making sure everyone who's connected gets the messages
        io.emit('new_message', { id: socket.id, message: msg })
    })

    //listen for a disconnect symbol
    socket.on('disconnect', function() {
        console.log('a user disconnected');

        message = `${socket.id} has left the  chat!`;
        io.emit('user_disconnect', message);
    })
})