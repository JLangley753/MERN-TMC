const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const socket = require('socket.io');
const http = require('http');

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
})

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


server.listen(port, '192.168.0.11' () => console.log(`Server started on port ${port}`));
