const express = require('express');
const app = express();
const serv = require('http').Server(app);
const print = function(string) {
    console.log(string);
};
function random(min, max) {
	return Math.floor(Math.random() * (max - min + 1) ) + min;
}
app.get('/',function(req,res) {
    //print(res);
    //print(req);
    res.sendFile(__dirname + '/client/index.html');
});
app.get('/client/img/troll.png',function(req,res) {
    //print(res);
    //print(req);
    res.redirect(302,"https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    //res.sendFile(__dirname + '/client/index.html');
});
app.use('/client',express.static(__dirname + '/client'));

serv.listen(process.env.PORT || 2000);

print("doin' ur mom doin' doin' ur mom");

var io = require('socket.io')(serv,{});
var SOCKET_LIST = {};
var PLAYER_LIST = {};
var foond = [];
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
function choice(bruh) {
	return bruh[random(0,bruh.length-1)];
}
function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
} 
const WORD_LIST = ["Couch","Bruh","Emoji","Website","Discord","Youtube","Instagram","Animal","Poop","Pooping","Toe","Neck","Head","Hair","Nose","Air pods","Among us","Suck"];
var bruh = 0;
var players = 0;
var host;
var started;
/*function hostInGame() {
    
    for (const property in PLAYER_LIST) {
        for(const prop in PLAYER_LIST[property]) {
            console.log(`${prop}: ${PLAYER_LIST[property][prop]}`);
            if(PLAYER_LIST[property][prop].host) {
                
            }
        }
    }
    console.log(shit);
    return shit;
}*/
io.sockets.on('connection',function(socket) {
    
    socket.id = bruh;
    var player = {
        name: "",
        points:0,
        x:0,
        y:0,
        size:3,
        socket: socket,
        host: false,
    }
    if(Object.keys(PLAYER_LIST).length == 0 || host == "") {
        print("the new host is " + player.name);
        host = player;
        player.host = true;
    }
    SOCKET_LIST[socket.id] = socket;
    PLAYER_LIST[socket.id] = player;
    
    
    //print('socket connection');
    socket.on('disconnect',function() {
        for(var i in SOCKET_LIST) {
            SOCKET_LIST[i].emit('chatted',"<b style='color:red'>["+player.name+"] has left the game 😔</bruh>");
        }
        delete SOCKET_LIST[socket.id];
        if(PLAYER_LIST[socket.id].host || Object.keys(PLAYER_LIST).length == 0) {
            //print(hostInGame());
            print("ok the host left");
            host = "";
        }
        
        delete PLAYER_LIST[socket.id];
        if(Object.keys(PLAYER_LIST).length == 0) {
            print("ok actually everybody left so");
            started = false;
        }
        //print('socket disconnection')
    });
    
    socket.on('name',function(data) {
        print(data.name);
        player.name=data.name;
        for(var i in SOCKET_LIST) {
            SOCKET_LIST[i].emit('chatted',"<b style='color:green'>["+player.name + "] has joined the game 🎉</bruh>");
        }
        if(started) {
            socket.emit('start','yes im sure');
        }else {
            socket.emit('sendGameInfwo',host.name);
        }
        
        //console.log(crap);
        
    });

    socket.on('sendMsg',function(msg) {
        var playerName = player.name;
        console.log("["+playerName + "]: "+msg);
        if(msg.substring(0,2) == "~~" && msg.substring(msg.length-2,msg.length) == "~~") {
            msg = `<s>${msg.slice(2,msg.length-2)}</s>`
        }
        if(msg.substring(0,2) == "__" && msg.substring(msg.length-2,msg.length) == "__") {
            msg = `<u>${msg.slice(2,msg.length-2)}</u>`
        }
        if(msg.substring(0,3) == "***" && msg.substring(msg.length-3,msg.length) == "***") {
            msg = `<b><i>${msg.slice(3,msg.length-3)}</i></b>`
        }else if(msg.substring(0,2) == "**" && msg.substring(msg.length-2,msg.length) == "**") {
            msg = `<b>${msg.slice(2,msg.length-2)}</b>`
        }else if(msg.substring(0,1) == "*" && msg.substring(msg.length-1,msg.length) == "*") {
            msg = `<i>${msg.slice(1,msg.length-1)}</i>`
        }
        
        
        for(var i in SOCKET_LIST) {
            SOCKET_LIST[i].emit('chatted',"["+playerName + "]: "+msg);
        }
    });
    
    socket.on('mousePos',function(data) {
        //console.log('recieving')
        for(var i in SOCKET_LIST) {
            SOCKET_LIST[i].emit('mousePos',data);
        }
    });
    socket.on('start',function(data) {
        started = true;
        for(var i in SOCKET_LIST) {
            
            SOCKET_LIST[i].emit('start','yes im sure');
            
            SOCKET_LIST[i].emit('chatted',`<bruh style='color:green'>Its ${host.name}'s turn!</bruh>`);
        }
        host.socket.emit('myTurn',true);
    });
    
    
    bruh++;
});
setInterval(function() {
    players = Object.keys(PLAYER_LIST).length
    //print(Object.keys(SOCKET_LIST).length);
    var pack = [];

    for(var i in PLAYER_LIST) {
        var player = PLAYER_LIST[i];
        //print(player.score);
        pack.push({
            x:player.x,
            y:player.y,

        });
    }
    for(var i in SOCKET_LIST) {
        var socket = SOCKET_LIST[i];
        socket.emit('newData',pack);
        
    }
    
},1000/30)
/*setInterval(function() {
    if(host) {
        print(host.name);
    }
    
},1000);*/