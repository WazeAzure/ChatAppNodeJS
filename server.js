var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname));

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

var users = {};
var usernames = [];

io.on('connection', function(socket){
	//if there is new user
	socket.broadcast.emit('newMessage','someone is Connected!');
	
	//if there is one register
	socket.on('registerUser', function(username){
		if(usernames.indexOf(username) != -1){
			socket.emit('registerRespond', false);
		}else {
			users[socket.id] = username;
			usernames.push(username);
			socket.emit('registerRespond', true);
			console.log(users);
			console.log('---------');
			console.log(username);
			io.emit('addOnlineUser', usernames);
		}
	})
	//if there is new message
	socket.on('newMessage', function(msg){
		io.emit('newMessage', msg);
		console.log('Chat baru: ' + msg);

	});

	//
	socket.on('newTyping', function(msg){
		io.emit('newTyping', msg);
	})
	
	//if someone disconect
	socket.on('disconnect', function(msg){
		socket.broadcast.emit('newMessage','someone is Disonnected!');

		var index = usernames.indexOf(users[socket.id]);
		usernames.splice(index, 1);
		
		delete users[socket.id];

		io.emit('addOnlineUser', usernames)
	});
})

http.listen(3000, function(req, res){
	console.log('Running on port 3000')
});
