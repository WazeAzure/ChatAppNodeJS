var socket = io();
var form = document.getElementById("MyForm");
let date = new Date();
form.addEventListener('submit', function(event){
	socket.emit('newMessage', document.getElementById('nama_user').value + '||\n'+ date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "||\n" + document.getElementById('text_box').value);
	document.getElementById('text_box').value = "";
	isTyping = false;
	event.preventDefault();
})

socket.on('addOnlineUser', function(usernames){
	let list = document.getElementById('user_lists');
	list.innerHTML = '';
	for(var i=0;i<usernames.length;i++){
		var listUser = document.createElement("LI");
		listUser.setAttribute('id',`user_${usernames[i]}`);
		var textNodeUser = document.createTextNode(usernames[i]);
		listUser.appendChild(textNodeUser);
		document.getElementById('user_lists').append(listUser);
	}
})

socket.on('newMessage', function(msg){
	var element = document.getElementById('messages');

	var list = document.createElement("LI");
	var textNode = document.createTextNode(msg);
	list.appendChild(textNode);
	console.log(list);
	element.append(list);

	var elements = document.getElementsByClassName('temporary');
    	while(elements.length > 0){
        	elements[0].parentNode.removeChild(elements[0]);
   	}
	document.getElementById('MyButton').addEventListener('click', function(){
		let el = document.getElementById('messages');
		el.scrollTop = el.scrollHeight;
	})
});

document.getElementById('submit_name').addEventListener('click', addClass)
user = document.getElementById('nama_user')
function addClass(){
	if(user.value != ''){
		username = user.value;
		socket.emit('registerUser', username);
	}
}

socket.on('registerRespond', function(status){
	if(!status){
		alert('user sudah ada cari nama lain!')
	} else {
		document.getElementById('chatroom').classList.remove('hidden')
		document.getElementById('homepage').classList.add('hidden')
	}
})

textBox = document.getElementById('text_box');
var isTyping = false;
textBox.addEventListener('keyup', function(){
	if(isTyping == false){
		socket.emit('newTyping', username + ' sedang mengetik..');
	}

	isTyping = true;

})

socket.on('newTyping', function(msg){
	var element = document.getElementById('messages');

        var list = document.createElement("LI");
        var textNode = document.createTextNode(msg);
	list.setAttribute('class','temporary');
        list.appendChild(textNode);
        console.log(list);
        element.append(list);
})
