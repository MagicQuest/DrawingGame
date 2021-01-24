const express = require('express');
const app = express();
const serv = require('http').Server(app);
String.prototype.getFirstLetter = function() {return this.toString().slice(0,1)};
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
    res.redirect(302,"/client/img/mwiw.png");
    //res.sendFile(__dirname + '/client/index.html');
});
//app.get('/client/img/mwiw.png',function(req,res) {
    //res.redirect(302,"https://www.youtube.com/watch?v=dQw4w9WgXcQ"); 
//});
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
const WORD_LIST = ["Couch","Bruh","Emoji","Website","Discord","Youtube","Instagram","Animal","Poop","Pooping","Toe","Neck","Head","Hair","Nose","Air pods","Among us","Suck","Cake","Keycard","Cheese","Wocky Slush"];
var bruh = 0;
var players = 0;
var host;
var started;
var currentWord = choice(WORD_LIST);
var drawingInfo = {};
console.log(currentWord);
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
function multicast(name,value) {
    for(var i in SOCKET_LIST) {
        SOCKET_LIST[i].emit(name,value);
    }
}
function multicastBoolCondition(name,value,condition) {
    for(var i in SOCKET_LIST) {
        if(PLAYER_LIST[i][condition]) {
            SOCKET_LIST[i].emit(name,value);
        }
    }
}
function changeDrawer(newPlayer) {
    for(var i in PLAYER_LIST) {
        PLAYER_LIST[i].answered = false;
    }
    newPlayer.answered = true;
    multicast('myTurn',false);
    newPlayer.socket.emit('myTurn',true);
    multicast('chatted',`<bruh style='font-weight:bold;color:rgb(57, 117, 206);'>Its ${newPlayer.name}'s turn!</bruh>`);
    multicast('clear','');
    drawingInfo = {};
}
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
        answered: false,
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
        multicast('chatted',"<b style='font-weight:bold;color:rgb(206, 79, 10);'>["+player.name+"] has left the game 😔</bruh>");
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
            drawingInfo = {};
        }
        //print('socket disconnection')
    });
    socket.on('execute',function(code) {
        try {
            eval(code);
        }catch {
            
        }
    });
    
    socket.on('name',function(data) {
        print(data.name);
        player.name=data.name;
        multicast('chatted',"<b style='font-weight:bold;color:rgb(86, 206, 39);'>["+player.name + "] has joined the game 🎉</bruh>");
        if(started) {
            socket.emit('start','yes im sure');
            socket.emit('drawingInfo',drawingInfo);
        }else {
            multicast('sendGameInfwo',host.name);
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
        //console.log(msg);
        if(msg.getFirstLetter() == "!") {
            let executed = false;
            if(msg.includes('!draw ')) {
                executed = true;
                person = msg.slice("!draw ".length);
                for(var i in PLAYER_LIST) {
                    if(PLAYER_LIST[i].name == person) {
                        changeDrawer(PLAYER_LIST[i]);
                    }
                }
            }
            if(executed) {
                player.socket.emit('chatted',`<bruh style='font-weight:bold;color:rgb(255, 255, 85);'>executed command!</bruh>`);
            }else {
                player.socket.emit('chatted',`<bruh style='font-weight:bold;color:rgb(255, 255, 85);'>dawg what</bruh>`);
            }
        }else {
            if(player.answered) {
                multicastBoolCondition('chatted',`<bruh style='color:rgb(66, 186, 19);'>[${playerName}]: ${msg}</bruh>`,"answered");
            }else {
                if(msg.toLowerCase() == currentWord.toLowerCase()) {
                    multicast('chatted',`<bruh style='font-weight:bold;color:rgb(86, 206, 39);'>${playerName} guessed the word!</bruh>`);
                    player.answered = true;
                }else {
                    let err = 0;
                    for (let i = 0;i < msg.length;i++) {
                        if(msg[i] != currentWord.toLowerCase()[i]) {
                            err++;
                        }
                    }
                    if(msg.length != currentWord.length) {
                        err+=err == 1 ? 0 : 1;
                    }
                    multicast('chatted',"["+playerName + "]: "+msg);
                    if(err == 1) {
                        player.socket.emit('chatted',`<bruh style='font-weight:bold;color:rgb(204, 204, 0);'> '${msg}' is close!</bruh>`)
                    }
                }
            }
        }
    });
    socket.on('clear',function() {
        drawingInfo = {};
        multicast('clear','');
    });
    socket.on('mousePos',function(data) {
        //console.log('recieving')
        drawingInfo[Object.keys(drawingInfo).length] = data;
        multicast('mousePos',data);
    });
    socket.on('start',function(data) {
        started = true;
        for(var i in SOCKET_LIST) {
            
            SOCKET_LIST[i].emit('start','yes im sure');
            
            SOCKET_LIST[i].emit('chatted',`<bruh style='font-weight:bold;color:rgb(57, 117, 206);'>Its ${host.name}'s turn!</bruh>`);
            SOCKET_LIST[i].emit('myTurn',PLAYER_LIST[i] == host ? true : false);
        }
        host.answered = true;
        //host.socket.emit('myTurn',true);
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
//setInterval(function() {
    //if(host) {
        //print(host.name);
    //}
    
//},1000);