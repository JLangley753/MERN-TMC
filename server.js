const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const socket = require('socket.io');
const http = require('http');
const path = require('path');

const items = require('./routes/api/items');

const app = express();

const server = http.Server(app);
const io = socket(server);

const port = 5000;

// socket.io connection
io.on('connection', (socket) => {
  // Receiving orders
  socket.on('addOrder', (Order) => {
    console.log('Current drink: ' + Order.currentDrink);
    socket.broadcast.emit('appendOrder');
  })
  socket.on('pong', (data) => {
    console.log('Pong received from client')
  })
})

function sendHeartbeat(){
    setTimeout(sendHeartbeat, 8000);
    io.sockets.emit('ping', { beat : 1 });
}

setTimeout(sendHeartbeat, 8000);

// Bodyparser Middleware
app.use(bodyParser.json());

// DV Config
const db = require('./config/keys').mongoURI;

// Connect to Mongo
mongoose
  .connect(db)
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

// Use routes
app.use('/api/items', items);

// Serve static assets if in production
if(process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

server.listen(port, () => console.log(`Server started on port ${port}`));
