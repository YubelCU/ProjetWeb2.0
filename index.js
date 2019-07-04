var express = require('express');
var app = express()
var http = require('http').createServer(app);
var io = require('socket.io')(http);
//var socket = require('socket.io')(http);

/*app.get('/', function(req, res){
  res.sendFile(__dirname + '/jeu_pacman.html');
});*/


//io.connect(server);
app.use(express.static('public'));

io.on('connect', function(socket){
  console.log('a user connected');
  socket.on("pacman_message",function(message){
    console.log(message);
    io.sockets.emit("pacman_message",message);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
